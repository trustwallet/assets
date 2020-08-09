import { fixAll } from "../action/update-all";

export async function main() {
    try {
        await fixAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
