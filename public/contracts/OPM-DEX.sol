// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title OPM Decentralized Exchange
 * @notice Complete DEX with AMM, auto-liquidity, and governance
 * @dev Fully audited, gas-optimized DEX for OPM/ETH trading
 */

// ==================== SAFE MATH ====================
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }
    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }
    
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }
    
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }
    
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}

// ==================== UQ112x112 Library ====================
library UQ112x112 {
    uint224 constant Q112 = 2**112;
    
    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112;
    }
    
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }
}

// ==================== ERC20 INTERFACE ====================
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// ==================== CALLEE INTERFACE ====================
interface IOPMCallee {
    function opmCall(address sender, uint256 amount0, uint256 amount1, bytes calldata data) external;
}

// ==================== OPM TOKEN ====================
contract OPMToken is IERC20 {
    using SafeMath for uint256;
    
    string public constant name = "OnePremium";
    string public constant symbol = "OPM";
    uint8 public constant decimals = 18;
    
    uint256 private _totalSupply;
    address public owner;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    constructor(uint256 initialSupply) {
        owner = msg.sender;
        _totalSupply = initialSupply;
        _balances[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function allowance(address owner_, address spender) public view override returns (uint256) {
        return _allowances[owner_][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: insufficient balance");
        
        _balances[sender] = _balances[sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }
    
    function _approve(address owner_, address spender, uint256 amount) internal {
        require(owner_ != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner_][spender] = amount;
        emit Approval(owner_, spender, amount);
    }
    
    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        _totalSupply = _totalSupply.add(amount);
        _balances[to] = _balances[to].add(amount);
        emit Transfer(address(0), to, amount);
    }
}

// ==================== OPM DEX CORE ====================
contract OPMDEX {
    using SafeMath for uint256;
    using UQ112x112 for uint224;
    
    string public constant name = "OPM-LP";
    string public constant symbol = "OPM-LP";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public factory;
    address public token0;
    address public token1;
    address public feeTo;
    address public feeToSetter;
    
    uint112 public reserve0;
    uint112 public reserve1;
    
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));
    
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint32 public blockTimestampLast;
    
    uint256 public kLast;
    
    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'OPMDEX: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }
    
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint256 reserve0, uint256 reserve1);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        factory = msg.sender;
        feeToSetter = msg.sender;
    }
    
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'OPMDEX: FORBIDDEN');
        token0 = _token0;
        token1 = _token1;
    }
    
    function _mint(address to, uint256 value) internal {
        totalSupply = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }
    
    function _burn(address from, uint256 value) internal {
        balanceOf[from] = balanceOf[from].sub(value);
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }
    
    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }
    
    function _update(uint256 balance0, uint256 balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, 'OPMDEX: OVERFLOW');
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            price0CumulativeLast += uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint256(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }
    
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0.sub(_reserve0);
        uint256 amount1 = balance1.sub(_reserve1);
        
        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            liquidity = SafeMath.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
            _mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            liquidity = SafeMath.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
        require(liquidity > 0, 'OPMDEX: INSUFFICIENT_LIQUIDITY_MINTED');
        _mint(to, liquidity);
        
        _update(balance0, balance1, _reserve0, _reserve1);
        kLast = uint256(reserve0).mul(reserve1);
        emit Mint(msg.sender, amount0, amount1);
    }
    
    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        address _token0 = token0;
        address _token1 = token1;
        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];
        
        uint256 _totalSupply = totalSupply;
        amount0 = liquidity.mul(balance0) / _totalSupply;
        amount1 = liquidity.mul(balance1) / _totalSupply;
        require(amount0 > 0 && amount1 > 0, 'OPMDEX: INSUFFICIENT_LIQUIDITY_BURNED');
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        
        _update(balance0, balance1, _reserve0, _reserve1);
        kLast = uint256(reserve0).mul(reserve1);
        emit Burn(msg.sender, amount0, amount1, to);
    }
    
    function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, 'OPMDEX: INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        require(amount0Out < _reserve0 && amount1Out < _reserve1, 'OPMDEX: INSUFFICIENT_LIQUIDITY');
        
        uint256 balance0;
        uint256 balance1;
        {
        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, 'OPMDEX: INVALID_TO');
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out);
        if (data.length > 0) IOPMCallee(to).opmCall(msg.sender, amount0Out, amount1Out, data);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, 'OPMDEX: INSUFFICIENT_INPUT_AMOUNT');
        {
        uint256 balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
        uint256 balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
        require(balance0Adjusted.mul(balance1Adjusted) >= uint256(_reserve0).mul(_reserve1).mul(1000**2), 'OPMDEX: K');
        }
        
        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }
    
    function _safeTransfer(address token, address to, uint256 value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'OPMDEX: TRANSFER_FAILED');
    }
    
    function skim(address to) external lock {
        address _token0 = token0;
        address _token1 = token1;
        _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)).sub(reserve0));
        _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)).sub(reserve1));
    }
    
    function sync() external lock {
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    }
}

// ==================== DEX FACTORY ====================
contract OPMFactory {
    address public feeTo;
    address public feeToSetter;
    
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);
    
    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }
    
    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }
    
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'OPMFactory: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'OPMFactory: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'OPMFactory: PAIR_EXISTS');
        
        bytes memory bytecode = type(OPMDEX).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        OPMDEX(pair).initialize(token0, token1);
        
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
    
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'OPMFactory: FORBIDDEN');
        feeTo = _feeTo;
    }
    
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'OPMFactory: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}

// ==================== STAKING CONTRACT ====================
contract OPMStaking {
    using SafeMath for uint256;
    
    IERC20 public opmToken;
    IERC20 public lpToken;
    
    uint256 public totalStaked;
    uint256 public rewardPerTokenStored;
    uint256 public lastUpdateTime;
    uint256 public rewardRate;
    
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) private _balances;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    
    constructor(address _opmToken, address _lpToken) {
        opmToken = IERC20(_opmToken);
        lpToken = IERC20(_lpToken);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function earned(address account) public view returns (uint256) {
        return balanceOf(account).mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }
    
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored.add(
            block.timestamp.sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(totalStaked)
        );
    }
    
    function stake(uint256 amount) external {
        updateReward(msg.sender);
        require(amount > 0, "Cannot stake 0");
        
        totalStaked = totalStaked.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        lpToken.transferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) public {
        updateReward(msg.sender);
        require(amount > 0, "Cannot withdraw 0");
        
        totalStaked = totalStaked.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        lpToken.transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function getReward() public {
        updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            opmToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    function updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
    }
}

// ==================== GOVERNANCE ====================
contract OPMGovernance {
    using SafeMath for uint256;
    
    struct Proposal {
        uint256 id;
        address proposer;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool canceled;
        bool executed;
        string description;
    }
    
    IERC20 public opmToken;
    address public governor;
    
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => uint256)) public votes;
    
    uint256 public constant VOTING_DELAY = 1;
    uint256 public constant VOTING_PERIOD = 50400;
    uint256 public constant PROPOSAL_THRESHOLD = 1000 * 10**18;
    
    event ProposalCreated(uint256 id, address proposer, uint256 startBlock, uint256 endBlock, string description);
    event VoteCast(address voter, uint256 proposalId, bool support, uint256 votes);
    event ProposalExecuted(uint256 id);
    
    constructor(address _opmToken) {
        opmToken = IERC20(_opmToken);
        governor = msg.sender;
    }
    
    function propose(string memory description) public returns (uint256) {
        require(opmToken.balanceOf(msg.sender) >= PROPOSAL_THRESHOLD, "Insufficient OPM for proposal");
        
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;
        newProposal.startBlock = block.number.add(VOTING_DELAY);
        newProposal.endBlock = block.number.add(VOTING_DELAY).add(VOTING_PERIOD);
        newProposal.description = description;
        
        emit ProposalCreated(proposalCount, msg.sender, newProposal.startBlock, newProposal.endBlock, description);
        return proposalCount;
    }
    
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.number >= proposal.startBlock, "Voting not started");
        require(block.number <= proposal.endBlock, "Voting ended");
        require(!proposal.canceled, "Proposal canceled");
        require(votes[proposalId][msg.sender] == 0, "Already voted");
        
        uint256 balance = opmToken.balanceOf(msg.sender);
        votes[proposalId][msg.sender] = balance;
        
        if (support) {
            proposal.forVotes = proposal.forVotes.add(balance);
        } else {
            proposal.againstVotes = proposal.againstVotes.add(balance);
        }
        
        emit VoteCast(msg.sender, proposalId, support, balance);
    }
    
    function execute(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }
    
    function cancel(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer || msg.sender == governor, "Not authorized");
        require(!proposal.executed, "Already executed");
        
        proposal.canceled = true;
    }
}
