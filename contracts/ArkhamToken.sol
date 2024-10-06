//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ArkhamToken is ERC20, ERC20Capped, ERC20Burnable {
    address payable public i_owner;
    uint256 public blockReward;

    constructor(uint256 cap, uint256 reward) ERC20("ArkhamToken", "ARK") ERC20Capped(cap * (10 ** decimals())) {
        i_owner = payable(msg.sender);
        _mintNew(i_owner, 70000000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mintNew(address account, uint256 value) internal {
        require(ERC20.totalSupply() + value <= cap(), "ERC20: transfer amount exceeds balance");
        super._mint(account, value);
    }

    function _mintMinerReward() internal {
        _mintNew(block.coinbase, blockReward);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    modifier onlyOwner {
        require(msg.sender == i_owner, "Only the owner can call this function");
        _;
    }

    function _update(address from, address to, uint256 value) internal override (ERC20,ERC20Capped) {
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
            _mintMinerReward();
        }
        super._update(from, to, value);
    }
}