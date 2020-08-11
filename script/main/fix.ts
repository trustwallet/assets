import { sanityFixAll, consistencyFixAll } from "../action/update-all";

export async function main() {
    try {
        await sanityFixAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }

    try {
        await consistencyFixAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
