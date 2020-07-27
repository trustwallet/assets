import { stakingChains } from "../common/blockchains";
import { getChainValidatorsListPath } from "../common/repo-structure";
import { formatSortJsonFile } from "../common/json";

function formatValidators() {
    stakingChains.forEach(chain => {    
        const validatorsPath = getChainValidatorsListPath(chain);
        formatSortJsonFile(validatorsPath);
    })
}

export async function fix() {
    formatValidators();
}
