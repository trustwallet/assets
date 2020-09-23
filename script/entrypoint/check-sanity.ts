import { sanityCheckAll } from "../generic/update-all";

export async function main(): Promise<void> {
    try {
        // warnings ignored
        const [errors] = await sanityCheckAll();
        process.exit(errors.length);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
