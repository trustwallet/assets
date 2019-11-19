const axios = require("axios")
const bluebird = require("bluebird")
const fs = require("fs")
const path = require("path")
const chalk = require('chalk')
const blacklist = require('../blockchains/binance/blacklist.json')

;(async () => {
    const { assetInfoList } = await axios.get(`https://explorer.binance.org/api/v1/assets?page=1&rows=1000`).then(r => r.data)

    await bluebird.each(assetInfoList, async ({ asset, assetImg }) => {
        if (assetImg && blacklist.indexOf(asset) == -1) {
            const binanceDir = path.join(__dirname, `../blockchains/binance`)
            const imagePath = `${binanceDir}/assets/${asset}/logo.png`

            if (fs.existsSync(imagePath)) {
                console.log(chalk.green(`${asset}`))
            } else {
                console.log(chalk.red(`${asset}`))
                fs.mkdir(`${binanceDir}/assets/${asset}`, err => {
                    if (err && err.code != `EEXIST`) throw err
                })

                await fetchImage(assetImg).then(buffer => {
                    buffer.pipe(fs.createWriteStream(imagePath))
                })
            }
        }
    })

    function fetchImage(url) {
        return axios.get(url, { responseType: "stream" }).then(r => r.data).catch(err => {
            throw `Error fetchImage: ${url} ${err.message}`
        })
    }

})().catch(err => {
    console.error(err)
    process.exit(1)
})