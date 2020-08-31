import { BinanceAction } from "./binance";
import { CosmosAction } from "./cosmos";
import { EthForks } from "./eth-forks";
import { FoldersFiles } from "./folders-and-files";
import { JsonAction } from "./json";
import { KavaAction } from "./kava";
import { LogoSize } from "./logo-size";
import { TerraAction } from "./terra";
import { TezosAction } from "./tezos";
import { TronAction } from "./tron";
import { Validators } from "./validators";
import { WavesAction } from "./waves";
import { Allowlist } from "./allowlists";
import { ActionInterface, CheckStepInterface } from "./interface";
import * as chalk from 'chalk';
import * as bluebird from "bluebird";

const actionList: ActionInterface[] = [
    new FoldersFiles(),
    new EthForks(),
    new LogoSize(),
    new Allowlist(),
    new Validators(),
    new JsonAction(),
    // chains:
    new BinanceAction(),
    new CosmosAction(),
    new KavaAction(),
    new TerraAction(),
    new TezosAction(),
    new TronAction(),
    new WavesAction()
];

async function checkStepList(steps: CheckStepInterface[]): Promise<[string[], string[]]> {
    var errors: string[] = [];
    var warnings: string[] = [];
    await bluebird.each(steps, async (step) => {
        try {
            //console.log(`     Running check step '${step.getName()}'...`);
            const [error, warning] = await step.check();
            if (error && error.length > 0) {
                console.log(`-  ${chalk.red('X')} '${step.getName()}': '${error}'`);
                errors.push(`${step.getName()}: ${error}`);
            }
            if (warning && warning.length > 0) {
                console.log(`-  ${chalk.yellow('!')} '${step.getName()}': '${warning}'`);
                warnings.push(`${step.getName()}: ${warning}`);
            }
            if (error.length == 0 && warning.length == 0) {
                console.log(`-  ${chalk.green('✓')} '${step.getName()}' OK`);
            }
        } catch (error) {
            console.log(`-  ${chalk.red('X')} '${step.getName()}': Caught error: ${error.message}`);
            errors.push(`${step.getName()}: Exception: ${error.message}`);
        }
    });
    return [errors, warnings];
}

async function sanityCheckByActionList(actions: ActionInterface[]): Promise<[string[], string[]]> {
    console.log("Running sanity checks...");
    var errors: string[] = [];
    var warnings: string[] = [];
    await bluebird.each(actions, async (action) => {
        try {
            if (action.getSanityChecks) {
                const steps = action.getSanityChecks();
                if (steps && steps.length > 0) {
                    console.log(`   Action '${action.getName()}' has ${steps.length} check steps`);
                    const [errors1, warnings1] = await checkStepList(steps);
                    if (errors1.length > 0) {
                        errors1.forEach(e => errors.push(e));
                    }
                    if (warnings1.length > 0) {
                        warnings1.forEach(w => warnings.push(w));
                    }
                    if (errors1.length == 0 && warnings1.length == 0) {
                        console.log(`- ${chalk.green('✓')} Action '${action.getName()}' OK, all ${steps.length} steps`);
                    }
                }
            }
        } catch (error) {
            console.log(`-  ${chalk.red('X')} '${action.getName()}' Caught error: ${error.message}`);
            errors.push(`${action.getName()}: Exception: ${error.message}`);
        }
    });
    console.log(`All sanity checks done, found ${errors.length} errors, ${warnings.length} warnings`);
    return [errors, warnings];
}

async function consistencyCheckByActionList(actions: ActionInterface[]): Promise<[string[], string[]]> {
    console.log("Running consistency checks...");
    var errors: string[] = [];
    var warnings: string[] = [];
    await bluebird.each(actions, async (action) => {
        try {
            if (action.getConsistencyChecks) {
                const steps = action.getConsistencyChecks();
                if (steps && steps.length > 0) {
                    console.log(`   Action '${action.getName()}' has ${steps.length} check steps`);
                    const [errors1, warnings1] = await checkStepList(steps);
                    if (errors1.length > 0) {
                        errors1.forEach(e => errors.push(e));
                    }
                    if (warnings1.length > 0) {
                        warnings1.forEach(w => warnings.push(w));
                    }
                    if (errors1.length == 0 && warnings1.length == 0) {
                        console.log(`- ${chalk.green('✓')} Action '${action.getName()}' OK, all ${steps.length} steps`);
                    }
                }
            }
        } catch (error) {
            console.log(`-  ${chalk.red('X')} '${action.getName()}' Caught error: ${error.message}`);
            errors.push(`${action.getName()}: Exception: ${error.message}`);
        }
    });
    console.log(`All consistency checks done, found ${errors.length} errors, ${warnings.length} warnings`);
    return [errors, warnings];
}

async function sanityFixByList(actions: ActionInterface[]) {
    console.log("Running sanity fixes...");
    await bluebird.each(actions, async (action) => {
        try {
            if (action.sanityFix) {
                console.log(`Sanity fix '${action.getName()}':`);
                await action.sanityFix();
            }
        } catch (error) {
            console.log(`Caught error: ${error.message}`);
        }
    });
    console.log("All sanity fixes done.");
}

async function consistencyFixByList(actions: ActionInterface[]) {
    console.log("Running consistency fixes...");
    await bluebird.each(actions, async (action) => {
        try {
            if (action.consistencyFix) {
                console.log(`Sanity fix '${action.getName()}':`);
                await action.consistencyFix();
            }
        } catch (error) {
            console.log(`Caught error: ${error.message}`);
        }
    });
    console.log("All consistency fixes done.");
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

export async function sanityCheckAll(): Promise<[string[], string[]]> {
    return await sanityCheckByActionList(actionList);
}

export async function consistencyCheckAll(): Promise<[string[], string[]]> {
    return await consistencyCheckByActionList(actionList);
}

export async function sanityFixAll() {
    await sanityFixByList(actionList);
}

export async function consistencyFixAll() {
    await consistencyFixByList(actionList);
}

export async function updateAll() {
    await updateByList(actionList);
}
