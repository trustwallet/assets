import { correctAndUpdate } from "../action/update-all";

export function main() {
    try {
        correctAndUpdate(false, true);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
