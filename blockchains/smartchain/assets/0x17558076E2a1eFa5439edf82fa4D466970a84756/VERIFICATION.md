# BscScan Contract Verification Guide

## Contract Information
- **Contract Address:** 0x17558076E2a1eFa5439edf82fa4D466970a84756
- **Network:** BSC (Binance Smart Chain)
- **Contract Name:** BEP20
- **Compiler Version:** 0.7.6+commit.7338295f

## Verification Steps

### 1. Prepare Files
- Source code is in `contract.sol`
- All dependencies are included in a single flattened file
- No constructor arguments required for this contract

### 2. Go to BscScan Verification
Visit: https://bscscan.com/verifyContract?a=0x17558076E2a1eFa5439edf82fa4D466970a84756

### 3. Fill Verification Form

| Field | Value |
|-------|-------|
| Contract Address | 0x17558076E2a1eFa5439edf82fa4D466970a84756 |
| Contract Name | BEP20 |
| Compiler Type | Solidity (Single file) |
| Compiler Version | v0.7.6+commit.7338295f |
| Optimization | Yes (enabled) |
| Runs | 999999 |

### 4. Paste Source Code
Copy the entire contents of `contract.sol` and paste into the source code field.

### 5. Constructor Arguments
Leave empty (encoded: `0x`)

### 6. Submit Verification
Click "Verify and Publish" button and wait for confirmation.

## Expected Result
✅ Green checkmark on BscScan
✅ Source code will be publicly visible
✅ Users can interact with contract through BscScan interface

## Troubleshooting
If verification fails:
- Ensure compiler version exactly matches (0.7.6)
- Verify optimization settings match
- Check that source code contains no extra whitespace
- Ensure contract name is exactly "BEP20" (case-sensitive)
