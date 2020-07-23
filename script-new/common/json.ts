import {
    readFileSync,
    writeFileSync
} from "./filesystem";

const sortElements = arr => arr.sort((a, b) => a - b);

export function formatJsonFile(filename: string) {
    const jsonContent = JSON.parse(readFileSync(filename));
    writeFileSync(filename, JSON.stringify(sortElements(jsonContent), null, 4));
    console.log(`Formatted json file ${filename}`);
}
