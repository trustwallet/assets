# Fock Smart Contract

This directory contains the reference implementation of **Fock**, a simple ERC‑20 meme coin. The token has a fixed supply of five million units and no owner account after deployment. The symbol for the token is `FOCK`. An optional liquidity fee can be specified during deployment, with any collected fees forwarded to the designated liquidity address. The fee percentage is immutable once the contract is deployed.

The contract relies on [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) for the ERC‑20 implementation and additional security primitives. To compile or deploy the contract you will need access to the OpenZeppelin contracts library (version 4.8 or later) and a Solidity compiler supporting version 0.8.17.

This code is provided for reference purposes only and has not been audited. Always review and test thoroughly before deploying to a production network.
