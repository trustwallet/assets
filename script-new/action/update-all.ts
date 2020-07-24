import * as eth_forks from "./eth-forks";
import * as logo_size from "./logo-size";
import * as validators from "./validators";
import * as whitelists from "./whitelists";
import * as binance from "./binance";

export function correctAndUpdate(doCorrect: boolean, doUpdate: boolean) {
    // corrections
    if (doCorrect) {
        console.log("Running corrections...");
        eth_forks.correct();
        logo_size.correct();
        validators.correct();
        whitelists.correct();
    }

    // updates (using external data sources)
    if (doUpdate) {
        console.log("Running updates (using external data sources) ...");
        binance.update();
    }
}
