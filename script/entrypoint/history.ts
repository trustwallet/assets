import { processChanges } from "../generic/history";

export async function main(): Promise<void> {
    try {
        await processChanges();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
