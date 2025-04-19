pragma solidity ^ 0.5.8;

contract USDTX {
    string public name = "Tether X";
    string public symbol = "USDTX";
    uint8 public decimals = 6;
    uint256 public totalSupply = 100000000 * 10 ** 6;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns(bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance.");
        require(to != address(0), "Invalid address.");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns(bool) {
        require(spender != address(0), "Invalid address.");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns(bool) {
        require(balanceOf[from] >= value, "Insufficient balance.");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded.");
        require(to != address(0), "Invalid address.");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}
