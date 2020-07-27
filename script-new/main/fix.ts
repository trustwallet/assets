import { fixAndUpdate } from "../action/update-all";

export function main() {
    try {
        fixAndUpdate(true, false);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
