/**
 *Submitted for verification at Etherscan.io on 2018-02-08
*/

pragma solidity ^0.4.25;

library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract ForeignToken {
    function balanceOf(address _owner) constant public returns (uint256);
    function transfer(address _to, uint256 _value) public returns (bool);
}

contract ERC20Basic {
    uint256 public totalSupply;
    function balanceOf(address who) public constant returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender) public constant returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface Token {
    function claim(address _to, uint256 _value) external returns (bool);
    function totalSupply() constant external returns (uint256 supply);
    function balanceOf(address _owner) constant external returns (uint256 balance);
}

contract TGOLDe is ERC20 {

    using SafeMath for uint256;
    address owner;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    mapping (address => bool) public blacklist;

    string public constant name = "TGOLDe";
    string public constant symbol = "TGOLDE";
    uint8 public constant decimals = 6;


    uint256 public constant TRON = 1000000;
    uint256 public totalSupply = 100000000000e6;
    uint256 public totalDistributed = 0;
    uint256 public airdropPoolValue = 0;
    uint256 public totalMinted= 0;
    uint256 public time = 1574348400; //2019 11/21 15:00:00 UTC
    uint256 public mineRate = 2500 * TRON;
    uint256 public startTime = 1574348400; //2019 11/21 15:00:00 UTC
    uint256 public miningPeriod = 7776000; //90 days
    uint256 public totalMiners = 0;
    bool public distributionFinished = false;

    mapping (address => uint256) public mineCounts;
    mapping (address => uint256) public mineSum;
    mapping (address => bool) public isMiner;


    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    event GetToken(address indexed to, uint256 amount);
    event DistrFinished();

    event Burn(address indexed burner, uint256 value);



    modifier canDistr() {
        require(!distributionFinished);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
      owner = msg.sender;
      time = now;
    }

    function finishDistribution() onlyOwner canDistr public returns (bool) {
        distributionFinished = true;
        emit DistrFinished();
        return true;
    }

    function getToken() canDistr public returns (bool){
      require(now >= startTime);
      uint256 timePast = now.sub(time);
      time = now;

      uint256 totalTimePast = now.sub(startTime);
      if(totalTimePast >= startTime.add(miningPeriod) && mineRate > TRON){
        startTime = startTime.add(miningPeriod);
        mineRate = mineRate.div(2);
      }

      if(totalMinted< totalSupply){
        uint256 mintAmount = timePast.mul(mineRate);

        if(totalMinted.add(mintAmount) >= totalSupply){
          mintAmount = totalSupply.sub(totalMinted);
          totalMinted= totalSupply;
        }
        airdropPoolValue = airdropPoolValue.add(mintAmount);
      }

      uint256 claimAmount = airdropPoolValue.div(10000);
      airdropPoolValue = airdropPoolValue.sub(claimAmount);
      totalDistributed = totalDistributed.add(claimAmount);

      uint256 ownerMineAmount = claimAmount.div(5);
      uint256 userMineAmount = claimAmount.sub(ownerMineAmount);
      balances[owner] = balances[owner].add(ownerMineAmount);
      balances[msg.sender] = balances[msg.sender].add(userMineAmount);

      mineSum[msg.sender] = mineSum[msg.sender].add(userMineAmount);
      mineCounts[msg.sender]++;

      if(isMiner[msg.sender] == false){
        isMiner[msg.sender] == true;
        totalMiners++;
      }

      if(airdropPoolValue < 10000 && totalMinted == totalSupply){
        distributionFinished = true;
        balances[owner] = balances[owner].add(airdropPoolValue);
        airdropPoolValue = 0;
        emit DistrFinished();
        totalDistributed = totalSupply;
      }

      emit GetToken(msg.sender,userMineAmount);
      return true;
    }

    function () external payable {

    }

    function balanceOf(address _owner) constant public returns (uint256) {
	    return balances[_owner];
    }

    // mitigates the ERC20 short address attack
    modifier onlyPayloadSize(uint size) {
        assert(msg.data.length >= size + 4);
        _;
    }

    function transfer(address _to, uint256 _amount) onlyPayloadSize(2 * 32) public returns (bool success) {

        require(_to != address(0));
        require(_amount <= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) onlyPayloadSize(3 * 32) public returns (bool success) {

        require(_to != address(0));
        require(_amount <= balances[_from]);
        require(_amount <= allowed[_from][msg.sender]);

        balances[_from] = balances[_from].sub(_amount);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(_from, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        // mitigates the ERC20 spend/approval race condition
        if (_value != 0 && allowed[msg.sender][_spender] != 0) { return false; }
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant public returns (uint256) {
        return allowed[_owner][_spender];
    }

    function getTokenBalance(address tokenAddress, address who) constant public returns (uint){
        ForeignToken t = ForeignToken(tokenAddress);
        uint bal = t.balanceOf(who);
        return bal;
    }

    function withdraw() onlyOwner public {
        uint256 etherBalance = address(this).balance;
        owner.transfer(etherBalance);
    }

    function burn(uint256 _value) onlyOwner public {
        require(_value <= balances[msg.sender]);
        // no need to require value <= totalSupply, since that would imply the
        // sender's balance is greater than the totalSupply, which *should* be an assertion failure

        address burner = msg.sender;
        balances[burner] = balances[burner].sub(_value);
        totalSupply = totalSupply.sub(_value);
        totalDistributed = totalDistributed.sub(_value);
        emit Burn(burner, _value);
    }

    function withdrawForeignTokens(address _tokenContract) onlyOwner public returns (bool) {
        ForeignToken token = ForeignToken(_tokenContract);
        uint256 amount = token.balanceOf(address(this));
        return token.transfer(owner, amount);
    }


}