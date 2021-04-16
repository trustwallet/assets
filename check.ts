import axios from "axios";

const ethAllowlistPath = "./blockchains/ethereum/allowlist.json";
//const ethAllowlistUrl = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/allowlist.json";
const ethexplorerApiUrl = "https://api.ethplorer.io"
const ethexplorerApiKey = "EK-4pw9Q-8fLs5oW-1Cb1U"
const ethexplRateLimitWait = 240;  // make calls not more often than each  ~1 sec
let ethexplNextCallTime = Date.now() + ethexplRateLimitWait;
//const ethscanRateLimitWait = 1050;  // make calls not more often than each  ~1 sec
//let ethscanNextCallTime = Date.now() + ethscanRateLimitWait;

// wait for some time, before making api calls, in order to rate-limit
async function ethexplRateLimit() {
    while (Date.now() < ethexplNextCallTime) {
        const toSleep = ethexplNextCallTime - Date.now() + 1;
        //console.log("sleeping...", toSleep);
        await new Promise(r => setTimeout(r, toSleep));
        //console.log("...slept");
    }
    ethexplNextCallTime += ethexplRateLimitWait;
}

async function callEthExplApi(url) {
    await ethexplRateLimit();
    let resp = await axios.get(url);
    if (resp.status != 200) {
        console.log("ERROR: Non-OK status", resp.status, resp.statusText, url);
        return {};
    }
    //console.log(url, resp.status);
    const data = resp.data
    //console.log(data);
    return data;
}

async function getTokenInfoEthExpl(token) {
    const url = `${ethexplorerApiUrl}/getTokenInfo/${token}?apiKey=${ethexplorerApiKey}`;
    const data = await callEthExplApi(url);
    return data;
}

async function getTokenHistoryEthExpl(token) {
    const url = `${ethexplorerApiUrl}/getTokenHistory/${token}?apiKey=${ethexplorerApiKey}&type=transfer&limit=3`;
    const data = await callEthExplApi(url);
    return data;
}

async function getHoldersEthExpl(token) {
    const tokenInfo = await getTokenInfoEthExpl(token);
    console.log(".");
    //console.log(tokenInfo);
    return tokenInfo["holdersCount"];
}

async function getLatestTxAgeEthExpl(token) {
    const tokenHistory = await getTokenHistoryEthExpl(token);
    console.log("+");
    //console.log(tokenHistory);
    if (!tokenHistory["operations"]) {
        return 0;
    }
    if (tokenHistory["operations"].length < 1) {
        return 0;
    }
    const timestamp = tokenHistory["operations"][0]["timestamp"];
    const now = Date.now() / 1000;
    const ageSec = now - timestamp;
    const ageDays = Math.floor(ageSec / 86400); // round DOWN
    //console.log(timestamp, now, ageSec, ageDays);
    return ageDays;
}

/*
// wait for some time, before making api calls, in order to rate-limit
async function ethscanRateLimit() {
    while (Date.now() < ethscanNextCallTime) {
        const toSleep = ethscanNextCallTime - Date.now() + 1;
        //console.log("sleeping...", toSleep);
        await new Promise(r => setTimeout(r, toSleep));
        //console.log("...slept");
    }
    ethscanNextCallTime += ethscanRateLimitWait;
}

async function getEtherscanPage(url) {
    try {
        const url2 = url.substring(url.length - 25, url.length)
        //console.log(url2, url);
        await rateLimit();
        let config = {
            headers: {
              Cookie: "__cfduid=d3131c7e849576183ee66cbcfb659db2e1605166374; ASP.NET_SessionId=srmh1clcgaljqsx3lbijvjp2; __cflb=02DiuFnsSsHWYH8WqVXcJWaecAw5gpnmdriuXuu1dS6Yc"
            },
            httpsAgent: new Agent({ keepAlive: true }),
          }
        let resp = await axios.get(url, config);
        if (resp.status != 200) {
            console.log("ERROR: Non-OK status", resp.status, resp.statusText, url2);
            return "";
        }
        //console.log(url2, resp.status);
        const page = resp.data;
        //console.log(page.length);
        return page;
    } catch (error) {
        console.log("ERROR: Exception", error);
        return ""
    }
}

function parseDelimitedStringInPage(pageContent, fragment1, fragment2, urlInfo) {
    const idx2 = pageContent.indexOf(fragment2);
    if (idx2 < 30) {
        console.log("ERROR: fragment2 not found", fragment2, "page len", pageContent.length, "url", urlInfo);
        return "";
    }
    const idx1 = pageContent.substring(idx2 - 30).indexOf(fragment1);
    //console.log("idx1", idx1);
    if (idx1 < 0) {
        console.log("ERROR: fragment1 not found", fragment1, "page len", pageContent.length, "url", urlInfo);
        return "";
    }
    const string = pageContent.substring(idx2 - 30 + idx1 + fragment1.length, idx2);
    return string;
}

function getHoldersFromExplorerPage(pageContent, urlInfo) {
    let holdersString = parseDelimitedStringInPage(pageContent, 'col-md-8">\n', " addresses</div>", urlInfo);
    if (holdersString.length == 0) {
        return 0;
    }
    // remove any , or .
    holdersString = holdersString.replace(',', '').replace('.', '');
    let holders = Number(holdersString)
    //console.log(explorerUrl2, holdersString);
    return holders;
}

function parseHumanAge(age) {
    const idx1 = age.indexOf("days");
    if (idx1 >= 0) {
        const daysString = age.substring(0, idx1);
        //console.log("daysString", daysString);
        return Number(daysString);
    }
    // less than two days
    const idx2 = age.indexOf("day");
    if (idx2 >= 0) {
        return 1;
    }
    return 0;
}

function getLatestTxAgeFromExplorerPage(pageContent, urlInfo) {
    let ageHuman = parseDelimitedStringInPage(pageContent, "'>", " ago<", urlInfo);
    if (ageHuman.length == 0) {
        return 0;
    }
    //console.log("ageHuman", ageHuman);
    const age = parseHumanAge(ageHuman);
    console.log("ageHuman: [", ageHuman, "] days:", age);
    return age;
}

async function getHoldersEthscan(token) {
    const etherscanUrl = `https://etherscan.io/token/${token}`;
    const etherscanPage = await getEtherscanPage(etherscanUrl);
    let holders = getHoldersFromExplorerPage(etherscanPage, etherscanUrl);
    return holders;
}

async function getLatestTxAgeEthscan(token) {
    const etherscanUrl = `https://etherscan.io/token/generic-tokentxns2?m=normal&contractAddress=${token}&a=&sid=15e15d0f633dfd04b3c35b171828c4b8&p=1`;
    //console.log("etherscanUrl", etherscanUrl);
    const etherscanPage = await getEtherscanPage(etherscanUrl);
    let txAge = getLatestTxAgeFromExplorerPage(etherscanPage, etherscanUrl);
    return txAge;
}
*/

async function getHolders(token) {
    return await getHoldersEthExpl(token)
}

// return the age of the latest transaction with this token, in days
async function getLatestTxAge(token) {
    return await getLatestTxAgeEthExpl(token)
}

async function run() {
    const allowTokens: string[] = require(ethAllowlistPath);
    //console.log("ethAllowlistUrl", ethAllowlistPath, ethAllowlistUrl);
    //const allowTokens: string[] = await axios.get(ethAllowlistUrl).then(r => r.data);
    console.log("allowTokens", allowTokens.length);

    //const chunkStart = 0;
    //const chunkLen = 10000;
    let countStarted = 0;
    let countDone = 0;
    await allowTokens.forEach(async token => {
        countStarted += 1;
        //if (count-1 >= chunkStart && count-1 < chunkStart + chunkLen) {
            try {
                let holders = await getHolders(token);
                let txAge = await getLatestTxAge(token);
                let old1 = (holders > 0 && holders < 100 && txAge > 90);
                let old2 = (txAge > 540);
                countDone += 1;
                console.log("TOKEN", countDone, token, holders, txAge, old1 ? "OLD!" : "", (old2 && !old1) ? "OLD2!" : "");
            } catch (error) {
                console.log("ERROR: Exception", error);
            }
        //}
    });
}

run();
