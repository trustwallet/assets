// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Valorium {
    string public name = "Valorium";
    string public symbol = "VLM";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply * 10 ** uint256(decimals);  // Adjusted for 18 decimals
        balanceOf[owner] = totalSupply;  // Mint the initial supply to the owner's address
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient Balance!");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
