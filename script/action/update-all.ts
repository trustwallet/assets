import { Binance } from "./binance";
import { EthForks } from "./eth-forks";
import { FoldersFiles } from "./folders-and-files";
import { LogoSize } from "./logo-size";
import { TezosAction } from "./tezos";
import { Validators } from "./validators";
import { Whitelist } from "./whitelists";
import { Coinmarketcap } from "../../pricing/coinmarketcap/script";
import { ActionInterface } from "./interface";

const actionList: ActionInterface[] = [
    new FoldersFiles(),
    new EthForks(),
    new LogoSize(),
    new Whitelist(),
    new Validators(),
    new TezosAction(),
    new Binance(),
    new Coinmarketcap()
];

function checkList(actions: ActionInterface[]): number {
    console.log("Running checks...");
    var returnCode = 0;

    actions.forEach(action => {
        if (action.getChecks) {
            const steps = action.getChecks();
            if (steps && steps.length > 0) {
                console.log(`Action '${action.getName()}' has ${steps.length} check steps`);
                steps.forEach(step => {
                    console.log(`Running check step '${step.getName()}'...`);
                    const error = step.check();
                    if (error && error.length > 0) {
                        console.log(`Check step Error: '${step.getName()}': '${error}'`);
                        returnCode = 1;
                    } else {
                        console.log(`Check step '${step.getName()}' ok`);
                    }
                });
            }
        }
    });

    return returnCode;
}

function fixByList(actions: ActionInterface[]) {
    console.log("Running fixes...");
    actions.forEach(action => {
        if (action.fix) {
            console.log(`Fix '${action.getName()}':`);
            action.fix();
        }
    });
}

function updateByList(actions: ActionInterface[]) {
    console.log("Running updates (using external data sources) ...");
    actions.forEach(action => {
        if (action.update) {
            console.log(`Update '${action.getName()}':`);
            action.update();
        }
    });
}

export function checkAll(): number {
    return checkList(actionList);
}

export function fixAll() {
    fixByList(actionList);
}

export function updateAll() {
    updateByList(actionList);
}
