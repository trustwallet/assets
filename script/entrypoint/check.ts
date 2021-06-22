import { sanityCheckAll, consistencyCheckAll } from "../generic/update-all";

export async function main(): Promise<void> {
    let returnCode = 0;

    try {
        // warnings ignored
        const [errors1] = await sanityCheckAll();
        if (errors1.length > 0) {
            returnCode = errors1.length;
        }
    } catch(err) {
        console.error(err);
        returnCode = 1;
    }

    try {
        // warnings ignored
        const [errors1] = await consistencyCheckAll();
        if (errors1.length > 0) {
            returnCode = errors1.length;
        }
    } catch(err) {
        console.error(err);
        returnCode = 1;
    }

    process.exit(returnCode);
}

main();
