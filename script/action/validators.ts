import { stakingChains } from "../common/blockchains";
import { getChainValidatorsListPath } from "../common/repo-structure";
import { formatSortJsonFile } from "../common/json";
import { ActionInterface } from "./interface";

function formatValidators() {
    stakingChains.forEach(chain => {    
        const validatorsPath = getChainValidatorsListPath(chain);
        formatSortJsonFile(validatorsPath);
    })
}

export class Validators implements ActionInterface {
    getName(): string { return "Validators"; }
    check = null;
    async fix(): Promise<void> {
        formatValidators();
    }
    update = null;
}
