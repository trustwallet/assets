import { checkAll } from "../action/update-all";

export function main() {
    try {
        const returnCode = checkAll();
        process.exit(returnCode);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
