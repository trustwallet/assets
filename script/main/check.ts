import { sanityCheckAll, consistencyCheckAll } from "../action/update-all";

export async function main() {
    var returnCode: number = 0;

    try {
        const ret1 = await sanityCheckAll();
        if (ret1 != 0) {
            returnCode = ret1;
        }
    } catch(err) {
        console.error(err);
        returnCode = 1;
    }

    try {
        const ret1 = await consistencyCheckAll();
        if (ret1 != 0) {
            returnCode = ret1;
        }
    } catch(err) {
        console.error(err);
        returnCode = 1;
    }

    process.exit(returnCode);
}

main();
