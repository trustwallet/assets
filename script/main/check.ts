import { checkAll } from "../action/update-all";

export async function main() {
    try {
        const returnCode = await checkAll();
        process.exit(returnCode);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
