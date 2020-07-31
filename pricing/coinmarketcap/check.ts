import { CheckStepInterface } from "../../script/action/interface";
import { readFileSync } from "../../script/common/filesystem";
import { mapTiker, TickerType } from "../../src/test/models";
import { isChecksum } from "../../script/common/eth-web3";
import { isTRC10, isTRC20 } from "../../script/action/tron";
import { retrieveAssetSymbols } from "../../script/action/binance";

export function getChecks(): CheckStepInterface[] {
    const cmcMap: mapTiker[] = JSON.parse(readFileSync("./pricing/coinmarketcap/mapping.json"));
    return [
        {
            getName: () => { return "Must have items";},
            check: async () => {
                if (cmcMap.length == 0) {
                    return `CMC map must have items`;
                }
                return "";
            }
        },
        {
            getName: () => { return `Items must be sorted by "id" in ascending order`;},
            check: async () => {
                var error: string = "";
                cmcMap.forEach((el, i) => {
                    if (i > 0) {
                        const prevID = cmcMap[i - 1].id;
                        const curID = el.id;
                        if (curID < prevID) {
                            error += `Item ${curID} must be greather or equal to ${prevID}\n`;
                        }
                    }
                });
                return error;
            }
        },
        {
            getName: () => { return `Items must be sorted by "coin" in ascending order if have same "id"`;},
            check: async () => {
                var error: string = "";
                cmcMap.forEach((el, i) => {
                    if (i > 0) {
                        const prevEl = cmcMap[i - 1]
        
                        const prevCoin = prevEl.coin
                        const prevID = cmcMap[i - 1].id
        
                        const curCoin = el.coin
                        const curID = el.id
        
                        if (prevID == curID) {
                            if (curCoin < prevCoin) {
                                error += `Item ${JSON.stringify(el)} must be greather or equal to ${JSON.stringify(prevEl)}\n`;
                            }
                        }
    
                    }
                });
                return error;
            }
        },
        {
            getName: () => { return "Properies value shoud not contain spaces";},
            check: async () => {
                var error: string = "";
                cmcMap.forEach((el, i) => {
                    Object.keys(el).forEach(key => {
                        const val = el[key]
                        if (typeof val === "string") {
                            if (val.indexOf(" ") >= 0) {
                                error += ` Property value "${val}" should not contain space\n`;
                            }
                        }
                    })
                });
                return error;
            }
        },
        {
            getName: () => { return "Params should have value and correct type";},
            check: async () => {
                var error: string = "";
                cmcMap.forEach((el) => {
                    const {coin, type, id, token_id} = el;
                    if (typeof coin !== "number") {
                        error += `Coin ${coin} must be type "number"\n`;
                    }
                    if (type !== "token" && type !== "coin") {
                        error += `Element with id ${id} has wrong type: "${type}"\n`;
                    }
                    if (type === "token") {
                        if (!token_id) {
                            error += `token_id ${token_id} with id ${id} must be type not empty\n`;
                        }
                    }
                    if (type === "coin") {
                        if ("token_in" in el) {
                            error += `Element with id ${id} should not have property "token_id"\n`;
                        }
                    }
                });
                return error;
            }
        },
        {
            getName: () => { return `"token_id" should be in correct format`;},
            check: async () => {
                var error: string = "";
                const bep2Symbols = await retrieveAssetSymbols();
                cmcMap.forEach((el) => {
                    const {coin, token_id, type, id} = el
                    switch (coin) {
                        case 60:
                            if (type === TickerType.Token) {
                                if (!isChecksum(token_id)) {
                                    error += `"token_id" ${token_id} with id ${id} must be in checksum'n`;
                                }
                            }
                            break;
                        case 195:
                            if (type === TickerType.Token) {
                                if (!isTRC10(token_id) && !isTRC20(token_id)) {
                                    error += `"token_id" ${token_id} with id ${id} must be in TRC10 or TRC20\n`;
                                }
                            }
                            break;
                        case 714:
                            if (type === TickerType.Token) {
                                if (!(bep2Symbols.indexOf(token_id) >= 0)) {
                                    error += `"token_id" ${token_id} with id ${id} must be BEP2 symbol\n`;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
                return error;
            }
        },
        {
            getName: () => { return `"token_id" shoud be unique`;},
            check: async () => {
                var error: string = "";
                const mappedList = cmcMap.reduce((acm, val) => {
                    if (val.hasOwnProperty("token_id")) {
                        if (acm.hasOwnProperty(val.token_id)) {
                            acm[val.token_id] == ++acm[val.token_id]
                        } else {
                            acm[val.token_id] = 0
                        }
                    }
                    return acm
                }, {});
                cmcMap.forEach((el) => {
                    if (el.hasOwnProperty("token_id")) {
                        if (mappedList[el.token_id] > 0) {
                            error += `CMC map ticker with "token_id" ${el.token_id} shoud be unique'n`;
                        }
                    }
                });
                return error;
            }
        },
    ];
}
