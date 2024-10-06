const { expect } = require("chai");
const hre = require("hardhat");

describe("ArkhamToken contract", function() {

  let Token;
  let arkhamToken;
  let owner;
  let address1;
  let address2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArkhamToken");
    [owner, address1, address2] = await hre.ethers.getSigners();

    arkhamToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await arkhamToken.i_owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await arkhamToken.balanceOf(owner.address);
      expect(await arkhamToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await arkhamToken.cap();
      expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await arkhamToken.blockReward();
      expect(Number(hre.ethers.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await arkhamToken.transfer(address1.address, 50);
      const address1Balance = await arkhamToken.balanceOf(address1.address);
      expect(address1Balance).to.equal(50);

      await arkhamToken.connect(address1).transfer(address2.address, 50);
      const address2Balance = await arkhamToken.balanceOf(address2.address);
      expect(address2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await arkhamToken.balanceOf(owner.address);

      await expect(
        arkhamToken.connect(address1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await arkhamToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await arkhamToken.balanceOf(owner.address);

      await arkhamToken.transfer(address1.address, 100);

      await arkhamToken.transfer(address2.address, 50);

      const finalOwnerBalance = await arkhamToken.balanceOf(owner.address);
      const expectedOwnerBalance = BigInt(initialOwnerBalance) - 150n;
      expect(finalOwnerBalance).to.equal(expectedOwnerBalance);

      const address1Balance = await arkhamToken.balanceOf(address1.address);
      expect(address1Balance).to.equal(100);

      const address2Balance = await arkhamToken.balanceOf(address2.address);
      expect(address2Balance).to.equal(50);
    });
  });
  
});