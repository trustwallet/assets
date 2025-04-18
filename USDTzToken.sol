// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

// Import SafeMath library to prevent overflow/underflow issues
import "./SafeMath.sol";

/**
 * @dev Implementation of the ERC20 token standard with added features.
 */
contract USDTzToken {
    using SafeMath for uint256;

    // Declare state variables for token details
    string public name;
    string public symbol;
    uint8 public decimals = 18;  // Standard ERC20 tokens usually have 18 decimals
    uint256 public totalSupply;

    // Mapping to track balances and allowances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events as per ERC20 standard
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Constructor to initialize the token details and assign total supply.
     * @param _name The name of the token
     * @param _symbol The symbol of the token
     * @param _initialSupply The initial supply of tokens to be minted (in units of smallest denomination)
     */
    /**
 * @dev Constructor to initialize the token details and assign total supply.
 * @param _name The name of the token
 * @param _symbol The symbol of the token
 * @param _initialSupply The initial supply of tokens to be minted (in units of smallest denomination)
 */
constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
    name = _name;
    symbol = _symbol;
    totalSupply = _initialSupply * 10 ** uint256(decimals); // Adjust for decimals
    balanceOf[msg.sender] = totalSupply;  // Assign the total supply to the contract deployer's address
    emit Transfer(address(0), msg.sender, totalSupply);  // Emit Transfer event from zero address
}


    /**
     * @dev See {IERC20-transfer}.
     * @param recipient The recipient's address
     * @param amount The amount to be transferred
     */
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-approve}.
     * @param spender The address allowed to spend tokens
     * @param amount The amount allowed for spending
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     * @param sender The address from which tokens are being transferred
     * @param recipient The address to which tokens are being transferred
     * @param amount The amount to transfer
     */
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, allowance[sender][msg.sender] - amount);
        return true;
    }

    /**
     * @dev Internal function to handle the transfer of tokens.
     * @param sender The address sending the tokens
     * @param recipient The address receiving the tokens
     * @param amount The amount to transfer
     */
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount <= balanceOf[sender], "ERC20: transfer amount exceeds balance");

        balanceOf[sender] = balanceOf[sender].sub(amount);
        balanceOf[recipient] = balanceOf[recipient].add(amount);

        emit Transfer(sender, recipient, amount);
    }

    /**
     * @dev Internal function to approve tokens for a spender.
     * @param owner The owner of the tokens
     * @param spender The address allowed to spend tokens
     * @param amount The amount of tokens allowed to spend
     */
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        allowance[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Internal function to mint new tokens.
     * @param account The account to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        totalSupply = totalSupply.add(amount);
        balanceOf[account] = balanceOf[account].add(amount);
        emit Transfer(address(0), account, amount);  // Emit Transfer event from zero address
    }

    /**
     * @dev Internal function to burn tokens.
     * @param account The account from which tokens are being burned
     * @param amount The amount of tokens to burn
     */
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");
        require(amount <= balanceOf[account], "ERC20: burn amount exceeds balance");

        balanceOf[account] = balanceOf[account].sub(amount);
        totalSupply = totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);  // Emit Transfer event to the zero address
    }
}
