import * as binance from "../action/binance";
import * as format_lists from "../action/validators";
import * as eth_forks from "../action/eth-forks";
import * as whitelists from "../action/whitelists";

function update() {
    try {
        binance.update();
        format_lists.fix();
        eth_forks.fix();
        whitelists.fix();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

update();
