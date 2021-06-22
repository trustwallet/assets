import { processChanges } from "../generic/history";

export async function main(): Promise<void> {
    try {
        const ret = await processChanges();
        if (ret != 0) {
            process.exit(ret);
        }
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
