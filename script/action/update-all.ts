import { BinanceAction } from "./binance";
import { EthForks } from "./eth-forks";
import { FoldersFiles } from "./folders-and-files";
import { LogoSize } from "./logo-size";
import { TezosAction } from "./tezos";
import { TronAction } from "./tron";
import { Validators } from "./validators";
import { Whitelist } from "./whitelists";
import { Coinmarketcap } from "../../pricing/coinmarketcap/cmc-action";
import { ActionInterface, CheckStepInterface } from "./interface";
import * as chalk from 'chalk';
import * as bluebird from "bluebird";

const actionList: ActionInterface[] = [
    new FoldersFiles(),
    new EthForks(),
    new LogoSize(),
    new Whitelist(),
    new Validators(),
    new TezosAction(),
    new BinanceAction(),
    new TronAction(),
    new Coinmarketcap()
];

async function checkStepList(steps: CheckStepInterface[]): Promise<number> {
    var returnCode = 0;
    await bluebird.each(steps, async (step) => {
        try {
            //console.log(`     Running check step '${step.getName()}'...`);
            const error = await step.check();
            if (error && error.length > 0) {
                console.log(`-  ${chalk.red('X')} '${step.getName()}': '${error}'`);
                returnCode = 1;
            } else {
                console.log(`-  ${chalk.green('✓')} '${step.getName()}' OK`);
            }
        } catch (error) {
            console.log(`-  ${chalk.red('X')} '${step.getName()}': Caught error: ${error.message}`);
            returnCode = 2;
        }
    });
    return returnCode;
}

async function checkActionList(actions: ActionInterface[]): Promise<number> {
    console.log("Running checks...");
    var returnCode = 0;
    await bluebird.each(actions, async (action) => {
        try {
            if (action.getChecks) {
                const steps = action.getChecks();
                if (steps && steps.length > 0) {
                    console.log(`   Action '${action.getName()}' has ${steps.length} check steps`);
                    const ret1 = await checkStepList(steps);
                    if (ret1 != 0) {
                        returnCode = ret1;
                    } else {
                        console.log(`- ${chalk.green('✓')} Action '${action.getName()}' OK, all ${steps.length} steps`);
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

async function fixByList(actions: ActionInterface[]) {
    console.log("Running fixes...");
    await bluebird.each(actions, async (action) => {
        try {
            if (action.fix) {
                console.log(`Fix '${action.getName()}':`);
                await action.fix();
            }
        } catch (error) {
            console.log(`Caught error: ${error.message}`);
        }
    });
    console.log("All fixes done.");
}

async function updateByList(actions: ActionInterface[]) {
    console.log("Running updates (using external data sources) ...");
    await bluebird.each(actions, async (action) => {
        try {
            if (action.update) {
                console.log(`Update '${action.getName()}':`);
                await action.update();
            }
        } catch (error) {
            console.log(`Caught error: ${error.message}`);
        }
    });
    console.log("All updates done.");
}

export async function checkAll(): Promise<number> {
    return await checkActionList(actionList);
}

export async function fixAll() {
    await fixByList(actionList);
}

export async function updateAll() {
    await updateByList(actionList);
}
