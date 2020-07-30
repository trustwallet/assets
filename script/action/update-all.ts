import { Binance } from "./binance";
import { EthForks } from "./eth-forks";
import { FoldersFiles } from "./folders-and-files";
import { LogoSize } from "./logo-size";
import { TezosAction } from "./tezos";
import { Validators } from "./validators";
import { Whitelist } from "./whitelists";
import { Coinmarketcap } from "../../pricing/coinmarketcap/script";
import { ActionInterface, CheckStepInterface } from "./interface";
import * as chalk from 'chalk';

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

function checkStepList(steps: CheckStepInterface[]): number {
    var returnCode = 0;
    steps.forEach(step => {
        try {
            console.log(`     Running check step '${step.getName()}'...`);
            const error = step.check();
            if (error && error.length > 0) {
                console.log(`-  ${chalk.red('X')} '${step.getName()}': '${error}'`);
                returnCode = 1;
            } else {
                console.log(`-  ${chalk.green('✓')} '${step.getName()}' ok`);
            }
        } catch (error) {
            console.log(`-  ${chalk.red('X')} '${step.getName()}': Caught error: ${error.message}`);
            returnCode = 2;
        }
    });
    return returnCode;
}

function checkActionList(actions: ActionInterface[]): number {
    console.log("Running checks...");
    var returnCode = 0;
    actions.forEach(action => {
        try {
            if (action.getChecks) {
                const steps = action.getChecks();
                if (steps && steps.length > 0) {
                    console.log(`   Action '${action.getName()}' has ${steps.length} check steps`);
                    const ret1 = checkStepList(steps);
                    if (ret1 != 0) {
                        returnCode = ret1;
                    }
                }
            }
        } catch (error) {
            console.log(`-  ${chalk.red('X')} '${action.getName()}' Caught error: ${error.message}`);
            returnCode = 3;
        }
    });
    console.log(`All checks done, returnCode ${returnCode}`);
    return returnCode;
}

function fixByList(actions: ActionInterface[]) {
    console.log("Running fixes...");
    actions.forEach(action => {
        try {
            if (action.fix) {
                console.log(`Fix '${action.getName()}':`);
                action.fix();
            }
        } catch (error) {
            console.log(`Caught error: ${error.message}`);
        }
    });
    console.log("All fixes done.");
}

function updateByList(actions: ActionInterface[]) {
    console.log("Running updates (using external data sources) ...");
    actions.forEach(action => {
        try {
            if (action.update) {
                console.log(`Update '${action.getName()}':`);
                action.update();
            }
        } catch (error) {
            console.log(`Caught error: ${error.message}`);
        }
    });
    console.log("All updates done.");
}

export function checkAll(): number {
    return checkActionList(actionList);
}

export function fixAll() {
    fixByList(actionList);
}

export function updateAll() {
    updateByList(actionList);
}
