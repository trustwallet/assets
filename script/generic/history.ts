import * as util from "util";
import {
    isPathExistsSync,
    readFileSync,
    writeFileSync,
} from "./filesystem";
import * as child_process from "child_process";

class VersionInfo {
    versionNum: number;
    commit: string;
    date: string;
}

const FilenameLatest = "history/LATEST.json";
const FilenameChangeTemplate = "history/versions/";
const IncludeHistoryPrefix1 = "blockchains/";
const IncludeHistoryPrefix2 = "dapps/";
//const TooManyChangesLimit = 40;

//const util = require('util');
const exec = util.promisify(child_process.exec);

async function execGit(options: string): Promise<string> {
    try {
        const cmd = `git ${options}`;
        console.log(`executing cmd:  ${cmd}`);
        const { stdout, stderr } = await exec(cmd);
        if (stdout) {
            console.log('stdout:');
            console.log(stdout);
        }
        if (stderr) {
            console.log('stderr:', stderr);
        }
        return stdout;
    } catch (err) {
        console.log('exception:', err);
        return "";
    }
}

function readLatestVersion(): VersionInfo {
    const zeroVer: VersionInfo = {versionNum: 0, commit: "", date: (new Date()).toISOString()};
    try {
        const rawdata = readFileSync(FilenameLatest);
        const ver: VersionInfo = JSON.parse(rawdata) as VersionInfo;
        if (!ver.versionNum && !ver.commit) {
            return zeroVer;
        }
        return ver;
    } catch (err) {
        console.log('Exception:', err);
        return zeroVer;
    }
}

function writeLatestVersion(version: VersionInfo): void {
    try {
        const content: string = JSON.stringify(version, null, 4);
        writeFileSync(FilenameLatest, content);
    } catch (err) {
        console.log('Exception:', err);
    }
}

async function getCurrentCommit(): Promise<string> {
    const raw = await execGit("rev-parse master");
    if (!raw) {
        return raw;
    }
    return raw.split("\n").filter(l => l)[0];
}

async function getChangedFiles(commitStart: string, commitEnd: string): Promise<string[]>{
    const bulk: string = await execGit(`diff --name-only ${commitStart} ${commitEnd}`);
    if (!bulk) {
        return [];
    }
    const list: string[] = bulk.split("\n").map(l => l.trim()).filter(l => l);
    return list;
}

function filterChangedFiles(files: string[]): string[] {
    return files.filter(l => {
        return (l.startsWith(IncludeHistoryPrefix1) || l.startsWith(IncludeHistoryPrefix2));
    });
}

function changeListToJson(versionStart: VersionInfo, versionEnd: VersionInfo, changes: string[]): unknown {
    //let fullChanges = false;
    //if (changes.length > TooManyChangesLimit) {
    //    fullChanges = true;
    //}
    const obj: unknown = {
        "versionEnd": versionEnd,
        "versionStart": versionStart,
        //"fullChange": fullChanges,
        //"changeCount": changes.length,
    };
    //if (!fullChanges) {
        obj["changes"] = changes;
    //}
    return obj;
}

// return filename
function writeChangeList(version: VersionInfo, changeList: unknown): string {
    try {
        const filename: string = FilenameChangeTemplate + version.versionNum.toString() + ".json";
        if (isPathExistsSync(filename)) {
            throw `Error: file already exists: ${filename}`;
        }
        const content = JSON.stringify(changeList, null, 4);
        writeFileSync(filename, content);
        return filename;
    } catch (err) {
        console.log('exception:', err);
        return null;
    }
}

export async function processChanges(): Promise<number> {
    console.log("Compiling changes since last commit ...");
    const ver = readLatestVersion();
    if (ver.versionNum == 0 || !ver.versionNum || !ver.commit) {
        console.log("Error: Could not obtain latest version");
        return 1;
    }
    console.log(`Latest version:  ${JSON.stringify(ver, null, 4)}`);

    const currCommit = await getCurrentCommit();
    console.log(`Current commit:  ${currCommit}`);
    if (!currCommit) {
        console.log("Error: Could not obtain current commit");
        return 2;
    }

    if (currCommit == ver.commit) {
        console.log(`Warning: no new commit since ${ver.commit}`);
        return 3;
    }

    const newVer: VersionInfo = {
        versionNum: ver.versionNum + 1,
        commit: currCommit,
        date: (new Date()).toISOString(),
    };
    console.log(`New version:  ${JSON.stringify(newVer, null, 4)}`);

    const filesRaw: string[] = await getChangedFiles(ver.commit, currCommit);
    console.log(`${filesRaw.length} changed files found`);
    if (!filesRaw || filesRaw.length == 0) {
        console.log(`Error: Could not obtain list of changed files between commits ${ver.commit} and ${currCommit}`);
        return 4;
    }
    const files: string[] = filterChangedFiles(filesRaw);
    console.log(`${files.length} changed files found (excluding history files)`);
    if (!files || files.length == 0) {
        console.log(`Warning: No changed files (excluding history files) between commits ${ver.commit} and ${currCommit}`);
        return 0;
    }

    const changeList: unknown = changeListToJson(ver, newVer, files);
    const newChangeFile = writeChangeList(newVer, changeList);
    if (!newChangeFile) {
        console.log(`Error: could not write out new change file`);
        return 6;
    }
    writeLatestVersion(newVer);
    console.log(`Changes written to ${FilenameLatest} and ${newChangeFile}`);

    return 0;
}
