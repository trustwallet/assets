import * as binance from "./binance";
import * as format_lists from "./validators";
import * as eth_forks from "./eth-forks";
import * as whitelists from "./whitelists";

export function fixAndUpdate(fixonly: boolean) {
    // fixes
    console.log("Running fixes ...");
    format_lists.fix();
    eth_forks.fix();
    whitelists.fix();

    // updates (using external data sources)
    console.log("Running updates (using external data sources) ...");
    if (!fixonly) {
        binance.update();
    }
}
