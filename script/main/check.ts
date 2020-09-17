import { sanityCheckAll, consistencyCheckAll } from "../action/update-all";

export async function main() {
    var returnCode: number = 0;

    try {
        const [errors1, warnings1] = await sanityCheckAll();
        // warnings ignored
        if (errors1.length > 0) {
            returnCode = errors1.length;
        }
    } catch(err) {
        console.error(err);
        returnCode = 1;
    }

    try {
        const [errors1, warnings1] = await consistencyCheckAll();
        // warnings ignored
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
