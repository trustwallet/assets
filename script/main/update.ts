import { updateAll } from "../action/update-all";

export function main() {
    try {
        updateAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
