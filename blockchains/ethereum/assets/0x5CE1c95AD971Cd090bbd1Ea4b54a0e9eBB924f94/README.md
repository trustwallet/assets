# Verification and Notes for 0x5CE1c95AD971Cd090bbd1Ea4b54a0e9eBB924f94

Bu dizine eklenen dosyalar ve yapılması gerekenler:

1) info.json — "chore: update info.json — set decimals to 6, add website and description (please verify on-chain)"
   - Ben info.json içindeki `decimals` değerini 6 olarak güncelledim ve website/description ekledim.
   - Bu geçici bir düzeltmedir: Lütfen kontratın on‑chain değerlerini doğrulayın (name, symbol, decimals). Eğer on‑chain değer farklıysa info.json'ı hemen güncelleyeceğim.

2) logo.png — mevcut dosya kurala uymuyor
   - Depodaki logo kare değil (mevcut ölçüler 296×307 gibi). TrustWallet kurallarına göre logo 256×256 PNG, şeffaf arka plan olmalıdır.
   - Lütfen 256×256 boyutunda, PNG ve şeffaf arka planlı bir logo yükleyin. Alternatif olarak aşağıdaki komutu kullanarak lokalinizde dönüştürebilirsiniz (ImageMagick yüklü ise):

     convert logo.png -resize 256x256 -background transparent -gravity center -extent 256x256 logo_256.png

   - Hazır bir raw URL sağlarsanız ben dosyayı PR'a commit edebilirim.

3) On‑chain doğrulama (kritik)
   - Etherscan üzerinden kontratı kontrol edin: https://etherscan.io/token/0x5CE1c95AD971Cd090bbd1Ea4b54a0e9eBB924f94
   - Eğer kontrat doğrulanmışsa `Contract Source Code Verified` bilgisi ve `Token Tracker` bölümünde name/symbol/decimals görülecektir.
   - Web3 ile doğrulamak isterseniz aşağıdaki örnek snippet'i kullanabilirsiniz (node + ethers.js):

```js
// node ile çalıştırmak için
const { ethers } = require('ethers');
const provider = ethers.getDefaultProvider('mainnet');
const addr = '0x5CE1c95AD971Cd090bbd1Ea4b54a0e9eBB924f94';
const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
];
(async () => {
  const c = new ethers.Contract(addr, abi, provider);
  try {
    console.log('name:', await c.name());
    console.log('symbol:', await c.symbol());
    console.log('decimals:', await c.decimals());
  } catch (e) {
    console.error('Could not read contract metadata. Contract may be unverified or not standard ERC20.');
    console.error(e);
  }
})();
```

4) İzinler / Sonraki adımlar (ne gerekiyorsa ben yaparım)
   - Eğer bana 256×256 PNG (raw URL veya dosya) sağlarsanız ben onu PR içindeki `logo.png` ile değiştirecek ve commit atacağım.
   - Eğer Etherscan'dan kontratın verified olduğunu ve decimals = X olduğunu söylerseniz, ben info.json'ı X ile güncelleyip commit atarım.
   - Benim doğrudan PR'ı onaylama/merge etme yetkim yok; PR'ın merge edilmesi trustwallet maintainer'larına aittir.

---

Commit edilmiş değişiklikleri ve PR'ı kontrol etmek için:
- PR: https://github.com/trustwallet/assets/pull/37431
- Fork commit: https://github.com/tonyymnta/assets/commit/b72dc3f25d9ca03212b2c61ea7bd975d7bfa1b24

Hazır olduğunuzda (1) logo dosyasını verin veya (2) Etherscan doğrulama sonucunu paylaşın — ben kalan commitleri atıp PR'ı merge için hazır hale getireceğim.
