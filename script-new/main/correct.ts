import { correctAndUpdate } from "../action/update-all";

export function main() {
    try {
        correctAndUpdate(true, false);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
