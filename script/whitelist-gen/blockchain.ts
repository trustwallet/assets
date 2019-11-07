import * as fs from "fs";

export class Blockchain {
    private readonly whiteListed = 'whitelist.json';
    private readonly blackListed = 'blacklist.json';
    private readonly assets = 'assets';

    constructor(private path: string) {}

    public generateWhitelisted() {
        const assetsPath = `${this.path}/${this.assets}`;
        const whiteListedPath = `${this.path}/${this.whiteListed}`;
        const blackListedPath = `${this.path}/${this.blackListed}`;
        if (fs.existsSync(assetsPath)) {
            // create files if ones don't exist
            if (!fs.existsSync(whiteListedPath)) {
                fs.writeFileSync(whiteListedPath, '[]');
            }

            if (!fs.existsSync(blackListedPath)) {
                fs.writeFileSync(blackListedPath, '[]');
            }

            const blackListed: any = JSON.parse(fs.readFileSync(blackListedPath) as any).reduce((acc, curr) => {
                acc[curr] = true;
                return acc;
            }, {});
            const whiteListed = fs.readdirSync(assetsPath).filter(name => !blackListed[name]);
            fs.writeFileSync(whiteListedPath, JSON.stringify(whiteListed, null, 4));
        }
    }
}