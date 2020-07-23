import * as updateBEP2 from "../action/updateBEP2";
import * as format_lists from "../action/format-lists";

function update() {
    try {
        updateBEP2.update();
        format_lists.update();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

update();
