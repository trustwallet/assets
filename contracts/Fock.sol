// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Fock
 * @dev ERC20 token with fixed supply, no ownership and optional liquidity fee.
 * All tokens are minted once at deployment and no further minting is possible.
 */
contract Fock is ERC20, ERC20Burnable, ReentrancyGuard {
    /// @notice Fee percentage (in basis points) sent to the liquidity address on each transfer.
    /// Set to zero to disable fees.
    uint256 public immutable liquidityFee;

    /// @notice Address that receives collected liquidity fees.
    address public immutable liquidityAddress;

    uint256 private constant FEE_DENOMINATOR = 10000;

    constructor(address _liquidityAddress, uint256 _feeBasisPoints) ERC20("Fock", "FOCK") {
        require(_liquidityAddress != address(0), "invalid liquidity address");
        require(_feeBasisPoints <= 1000, "fee too high"); // <=10%
        liquidityAddress = _liquidityAddress;
        liquidityFee = _feeBasisPoints;

        // Mint 5,000,000 tokens to the deployer.
        uint256 initialSupply = 5_000_000 * 10 ** decimals();
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Overrides the internal _transfer to take a fee and forward it to the
     * liquidity address. The fee percentage is immutable.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        if (liquidityFee == 0 || sender == liquidityAddress || recipient == liquidityAddress) {
            super._transfer(sender, recipient, amount);
        } else {
            uint256 feeAmount = (amount * liquidityFee) / FEE_DENOMINATOR;
            uint256 sendAmount = amount - feeAmount;
            super._transfer(sender, liquidityAddress, feeAmount);
            super._transfer(sender, recipient, sendAmount);
        }
    }
}
