import * as binance from "./binance";
import * as eth_forks from "./eth-forks";
import * as foldersfiles from "./folders-and-files";
import * as logo_size from "./logo-size";
import * as tezos from "./tezos";
import * as validators from "./validators";
import * as whitelists from "./whitelists";
import * as coinmarketcap from "../../pricing/coinmarketcap/script";

function checkList(checks: any[]): number {
    console.log("Running checks...");
    var returnCode = 0;

    checks.forEach(check => {
        const {name, error} = check();
        if (error && error.length > 0) {
            console.log(`Check Error: "${check.name}/${name}": "${error}"`);
            returnCode = 1;
        } else {
            console.log(`Check "${check.name}/${name}" ok`);
        }
    });

    return returnCode;
}

export function checkAll(): number {
    return checkList([
        foldersfiles.check
    ]);
}

export function fixAll() {
    console.log("Running fixes...");
    eth_forks.fix();
    logo_size.fix();
    validators.fix();
    whitelists.fix();
}

export function updateAll() {
    console.log("Running updates (using external data sources) ...");
    tezos.update();
    binance.update();
    coinmarketcap.update();
}
