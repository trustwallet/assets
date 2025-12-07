// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Cursor Tron Coin (CURT)
/// @notice A capped TRC20-compatible utility token meant to reside on Tron mainnet.
/// @dev Deployment recipe:
///  - Compile with Solidity 0.8.20+ in TronIDE/TronBox.
///  - Constructor arguments are (treasury, owner, initialRelease) where initialRelease
///    is denominated using 6 decimals (1 CURT == 1e6 units).
///  - Post deployment, call `setMinter` for minting executors and `pause`/`unpause`
///    for emergency stops. The contract is dependency-free so it can be audited easily.

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        require(initialOwner != address(0), "Ownable: owner is zero");
        _transferOwnership(initialOwner);
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller not owner");
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is zero");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract Pausable is Context {
    bool private _paused;

    event Paused(address account);
    event Unpaused(address account);

    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

contract CursorTronCoin is Context, Ownable, Pausable {
    string private constant _NAME = "Cursor Tron Coin";
    string private constant _SYMBOL = "CURT";
    uint8 private constant _DECIMALS = 6;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e6; // 1B CURT

    address public immutable treasury;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => bool) private _minters;
    uint256 private _totalSupply;

    event MinterUpdated(address indexed account, bool enabled);

    modifier onlyMinter() {
        require(_msgSender() == owner() || _minters[_msgSender()], "CURT: not minter");
        _;
    }

    constructor(address treasuryAddress, address initialOwner, uint256 initialRelease) Ownable(initialOwner) {
        require(treasuryAddress != address(0), "CURT: treasury is zero");
        require(initialRelease <= MAX_SUPPLY, "CURT: cap exceeded");
        treasury = treasuryAddress;
        if (initialRelease > 0) {
            _mint(treasuryAddress, initialRelease);
        }
    }

    // --- ERC20/TRC20 metadata view functions ---

    function name() external pure returns (string memory) {
        return _NAME;
    }

    function symbol() external pure returns (string memory) {
        return _SYMBOL;
    }

    function decimals() external pure returns (uint8) {
        return _DECIMALS;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner_, address spender) external view returns (uint256) {
        return _allowances[owner_][spender];
    }

    // --- Core token flows ---

    function transfer(address to, uint256 amount) external whenNotPaused returns (bool) {
        _transfer(_msgSender(), to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external whenNotPaused returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external whenNotPaused returns (bool) {
        uint256 currentAllowance = _allowances[from][_msgSender()];
        require(currentAllowance >= amount, "CURT: allowance exceeded");
        unchecked {
            _approve(from, _msgSender(), currentAllowance - amount);
        }
        _transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external whenNotPaused returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external whenNotPaused returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "CURT: allowance below zero");
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }
        return true;
    }

    // --- Minting, burning & roles ---

    function setMinter(address account, bool enabled) external onlyOwner {
        require(account != address(0), "CURT: minter zero");
        _minters[account] = enabled;
        emit MinterUpdated(account, enabled);
    }

    function isMinter(address account) external view returns (bool) {
        if (account == owner()) {
            return true;
        }
        return _minters[account];
    }

    function mint(address to, uint256 amount) external onlyMinter returns (bool) {
        _mint(to, amount);
        return true;
    }

    function burn(uint256 amount) external returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }

    function burnFrom(address account, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[account][_msgSender()];
        require(currentAllowance >= amount, "CURT: allowance exceeded");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
        return true;
    }

    // --- Circuit breaker controls ---

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // --- Internal helpers ---

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "CURT: transfer from zero");
        require(to != address(0), "CURT: transfer to zero");
        require(amount > 0, "CURT: amount zero");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "CURT: balance too low");

        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "CURT: mint to zero");
        require(amount > 0, "CURT: amount zero");
        require(_totalSupply + amount <= MAX_SUPPLY, "CURT: cap exceeded");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "CURT: burn from zero");
        require(amount > 0, "CURT: amount zero");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "CURT: burn exceeds balance");

        unchecked {
            _balances[account] = accountBalance - amount;
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner_, address spender, uint256 amount) internal {
        require(owner_ != address(0), "CURT: approve from zero");
        require(spender != address(0), "CURT: approve to zero");

        _allowances[owner_][spender] = amount;
        emit Approval(owner_, spender, amount);
    }

    // --- Events mirrored from TRC20 spec ---

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
