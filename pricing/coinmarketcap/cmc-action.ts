import { ActionInterface, CheckStepInterface } from "../../script/action/interface";
import { update, mergeCmcData } from "./script";
import { getSanityChecks } from "./check";

export class Coinmarketcap implements ActionInterface {
    getName(): string { return "Coinmarketcap mapping"; }

    getSanityChecks(): CheckStepInterface[] { return getSanityChecks(); }
    
    getConsistencyChecks = null;

    sanityFix = null;
    
    async consistencyFix(): Promise<void> {
        // do merge, for the case exceptions or script has been changed
        await mergeCmcData();
    }

    async update(): Promise<void> {
        await update();
    }
}
