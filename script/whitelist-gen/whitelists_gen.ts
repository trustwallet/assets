import * as fs from "fs";
import {Blockchain} from "./blockchain";

const blockchains = __dirname + '/../../blockchains';

fs.readdirSync(blockchains).forEach(path => {
    const blockchain = new Blockchain(`${blockchains}/${path}`);
    blockchain.generateWhitelisted();
});