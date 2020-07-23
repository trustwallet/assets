import { stakingChains } from "../common/blockchains";
import { getChainValidatorsListPath } from "../common/repo-structure";
import { formatJsonFile } from "../common/json";

function formatValidators() {
    stakingChains.forEach(chain => {    
        const validatorsPath = getChainValidatorsListPath(chain);
        formatJsonFile(validatorsPath);
    })
}

export async function update() {
    formatValidators();
}
