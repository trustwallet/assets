import { updateAll } from "../action/update-all";

export async function main() {
    try {
        await updateAll();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();
