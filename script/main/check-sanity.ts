import { sanityCheckAll } from "../action/update-all";

export async function main() {
    try {
        const returnCode = await sanityCheckAll();
        process.exit(returnCode);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
