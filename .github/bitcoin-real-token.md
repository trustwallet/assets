# Bitcoin Real Token (BRT)

## Overview

Bitcoin Real Token (BRT) is a collateral-backed BRC-20 asset bridged onto the Bitcoin mainnet with transparent mint, transfer, and redemption flows backed by verifiable BTC reserves.

## Supply

- **Maximum supply:** 21,000,000 BRT
- **Circulating supply (initial mint):** 5,000,000 BRT
- **Collateralization:** 1.05 BTC reserve ratio per 1,000 BRT issued, held in a 3-of-5 multisig managed by the Bitcoin Real Token Reserve Council.

Supply expansions require on-chain governance approval and attestation of additional collateral deposits before mint requests are processed. Excess collateral cannot be withdrawn without a corresponding burn of outstanding BRT.

## Minting Flow

1. Reserve operators deposit BTC into the custodial multisig wallet (`bc1qn7k3z6l4dq9z70m36v5y5vhwjttep7g3l6rv4c`).
2. A proof-of-reserve transaction and Merkle proof are generated and published to the `proofs` directory of the GitHub repository.
3. Once collateral exceeds the required threshold, a mint inscription is submitted on Bitcoin specifying the BRC-20 ticker `brt`.
4. Newly minted BRT is distributed to participants according to the governance-approved allocation schedule.

## Transfers

BRT inherits standard BRC-20 transfer semantics:

- Transfers are performed through ordinal inscriptions referencing the `brt` ticker.
- All transfers settle on-chain and are visible through BRC-20 explorers such as UniSat.

## Collateral Monitoring

- Real-time dashboard: <https://bitcoinrealtoken.org/proof-of-reserves>
- JSON API: `https://bitcoinrealtoken.org/api/proof-of-reserves`
- GitHub proofs: <https://github.com/bitcoinrealtoken/proof-of-reserves>
- Open telemetry feed: `wss://stream.bitcoinrealtoken.org/reserves`

Reserve attestations are issued weekly and whenever collateral balances change materially. Independent auditors can verify balances by monitoring the multisig address and reconciling with the published proofs.

### Hosting the dashboard and forum

Run the lightweight Go server packaged with this repository to expose the dashboard, JSON API, and governance forum:

```bash
go run ./cmd/brtserver --listen :8080
```

Set up a reverse proxy or load balancer to route `https://bitcoinrealtoken.org` and `https://forum.bitcoinrealtoken.org` to the running service. Use the `--data` flag if you want the server to watch an external JSON snapshot instead of the embedded values:

```bash
go run ./cmd/brtserver --listen :8443 --data /srv/brt/state.json --reload 15s
```

`internal/brtserver/data/latest.json` is the canonical source tracked in git. Update that file first, then redeploy the service to keep the dashboard, API responses, and on-chain metadata in lockstep.

### Collateral pipeline integration

Trigger the deployment workflow directly from your collateral monitoring system once fresh reserve data is available:

1. Create a GitHub token (fine-grained PAT or GitHub App installation token) with the `workflow` scope and store it in your pipeline secret manager.
2. Call the workflow dispatch endpoint, providing the branch and the latest metrics:

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/trustwallet/assets/actions/workflows/brt-deploy.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "circulating_supply": "5005000",
      "btc_locked": "5255.75",
      "collateral_ratio": "1.051"
    }
  }'
```

3. Store the GitHub token in a secure secret manager (for example, AWS Secrets Manager, HashiCorp Vault, or your CI/CD vault) and have the collateral exporter retrieve it at runtime. The workflow updates `internal/brtserver/data/latest.json`, commits the change (if any), rebuilds/pushes the container image, and reapplies Terraform. The environment variable `BRT_PIPELINE_TRIGGERED` is set automatically so downstream telemetry can track automated runs.

4. Hook your exporter to issue this request whenever reserve balances change, then monitor the workflow run history (or subscribe to workflow webhooks) to confirm each update is processed.

Schedule-driven automation can use the same endpoint or the workflow `push` trigger by committing state updates with the helper script `.github/scripts/update_brt_state.py`.

## Redemption

1. Holders submit a redemption request through the official portal.
2. BRT tokens are burned via a `brt` burn inscription.
3. BTC is released from the multisig after multi-party approval, minus redemption fees covering network costs.

## Governance & Contact

- Governance forum: <https://forum.bitcoinrealtoken.org>
- Emergency contact: `security@bitcoinrealtoken.org`

For integration assistance, open an issue at <https://github.com/bitcoinrealtoken/integrations>.
