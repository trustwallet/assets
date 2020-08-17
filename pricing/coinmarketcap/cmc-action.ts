import { ActionInterface, CheckStepInterface } from "../../script/action/interface";
import { run } from "./script";
import { getSanityChecks } from "./check";

export class Coinmarketcap implements ActionInterface {
    getName(): string { return "Coinmarketcap mapping"; }

    getSanityChecks(): CheckStepInterface[] { return getSanityChecks(); }
    
    getConsistencyChecks = null;

    sanityFix = null;
    
    consistencyFix = null;

    async update(): Promise<void> {
        await run();
    }
}
