# Copilot Instructions for xcomment/assets

## Project Overview
This repository is a structured asset store for blockchain projects, primarily containing images (logos) and metadata (info.json) for validators and assets across multiple chains. It is organized for easy programmatic access and updates.

## Directory Structure
- `blockchains/` — Top-level folder containing subfolders for each supported blockchain (e.g., `solana`, `cardano`, `cosmos`, etc.).
  - Each blockchain folder contains:
    - `validators/assets/` — Logos for validator addresses
    - `assets/` — Logos and info.json for asset addresses
- `.vscode/` — Editor configuration (e.g., launch.json)
- `.github/` — GitHub workflows and instructions (this file)

## Key Patterns and Conventions
- **Naming:** Asset and validator folders use canonical blockchain address formats as folder names. Logos are always named `logo.png`. Metadata is stored in `info.json`.
- **Additions:** To add a new asset or validator, create a new folder named after the address and place the required files inside.
- **Updates:** Replace `logo.png` or update `info.json` as needed. Do not rename folders unless the address changes.
- **No code:** This repo is asset-only; there are no build, test, or code workflows.

## Integration Points
- External systems can fetch logos and metadata by traversing the directory structure using blockchain and address as keys.
- No direct API or code integration; all access is via file system or repository clone.

## Examples
- To add a new Solana asset:
  - Path: `blockchains/solana/assets/<ASSET_ADDRESS>/logo.png`
  - Optional: `blockchains/solana/assets/<ASSET_ADDRESS>/info.json`
- To update a Cardano validator logo:
  - Path: `blockchains/cardano/validators/assets/<VALIDATOR_ADDRESS>/logo.png`

## Special Notes
- Do not add code, scripts, or non-asset files to blockchain folders.
- Keep folder and file naming strictly consistent for automated tooling compatibility.
- If adding new blockchains, follow the existing folder structure and naming conventions.

---
If any section is unclear or missing, please provide feedback for further refinement.