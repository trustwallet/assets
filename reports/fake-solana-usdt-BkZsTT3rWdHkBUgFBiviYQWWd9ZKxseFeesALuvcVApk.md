# Fake USDT Tokens on Solana — Security Report

**Reported by:** ArtaSecurity  
**Date:** 2026-07-07  
**Network:** Solana Mainnet  

---

## 🔴 Fake Token #1

**Mint Address:** `BkZsTT3rWdHkBUgFBiviYQWWd9ZKxseFeesALuvcVApk`  
**Displayed Name:** USDT (visual)  
**Real Name bytes:** `ՍЅᎠТ` (Unicode homoglyph attack)  
**Technique:** Armenian `Ս`(U+054D) + Old Slavic `Ѕ`(U+0405) + Cherokee `Ꭰ`(U+13A0) + Cyrillic `Т`(U+0422)  
**Supply:** 18,446,744,073,709,000,000 (max u64)  
**Pool:** Meteora DLMM  
**Creator wallet:** `EfQXY62LycqpSL1qg73wsRWdgCmLH5DemFojfxvwzsUj`  
**Solscan:** https://solscan.io/token/BkZsTT3rWdHkBUgFBiviYQWWd9ZKxseFeesALuvcVApk  

---

## 🔴 Fake Token #2

**Mint Address:** `ES9k2ZdqJmoYhAHdTa9Bq1XmJjQnTNWqHgKTEVg5zvNb`  
**Displayed Name:** USDT (visual)  
**Technique:** Unicode homoglyph / name spoofing  
**Solscan:** https://solscan.io/token/ES9k2ZdqJmoYhAHdTa9Bq1XmJjQnTNWqHgKTEVg5zvNb  

---

## ✅ Real USDT on Solana

**Official Mint:** `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`  
**Issuer:** Tether Limited  
**Solscan:** https://solscan.io/token/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB  

---

## 🛡️ How to verify

Always check the **exact mint address** — never trust the token name alone.  
Use ArtaSecurity bot to scan any token: [@ArtaSecurityBot](https://t.me/ArtaSecurityBot)

---

*Research: ArtaSecurity | https://artablockchain.in*
