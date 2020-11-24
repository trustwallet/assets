import { updateAll } from "../generic/update-all";

export async function main(): Promise<void> {
    try {
        await updateAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
