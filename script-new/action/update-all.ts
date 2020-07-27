import * as eth_forks from "./eth-forks";
import * as logo_size from "./logo-size";
import * as validators from "./validators";
import * as whitelists from "./whitelists";
import * as binance from "./binance";
import * as coinmarketcap from "../../pricing/coinmarketcap/script";

export function fixAndUpdate(doFix: boolean, doUpdate: boolean) {
    // fixes
    if (doFix) {
        console.log("Running fixes...");
        eth_forks.fix();
        logo_size.fix();
        validators.fix();
        whitelists.fix();
    }

    // updates (using external data sources)
    if (doUpdate) {
        console.log("Running updates (using external data sources) ...");
        binance.update();
        coinmarketcap.update();
    }
}
