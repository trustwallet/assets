import { ActionInterface, CheckStepInterface } from "../../script/action/interface";
import { run } from "./script";
import { getChecks } from "./check";

export class Coinmarketcap implements ActionInterface {
    getName(): string { return "Coinmarketcap mapping"; }

    getChecks(): CheckStepInterface[] { return getChecks(); }

    fix = null;

    async update(): Promise<void> {
        await run();
    }
}
