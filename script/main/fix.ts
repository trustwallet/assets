import { fixAll } from "../action/update-all";

export function main() {
    try {
        fixAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
