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
        if (action.check) {
            console.log(`Running check '${action.getName()}'...`);
            const error = action.check();
            if (error && error.length > 0) {
                console.log(`Check Error: '${action.getName()}': '${error}'`);
                returnCode = 1;
            } else {
                console.log(`Check '${action.getName()}' ok`);
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
