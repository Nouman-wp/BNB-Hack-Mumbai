const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProofLayerSBT", function () {
  let ProofLayerSBT;
  let sbt;
  let owner;
  let minter;
  let user;

  const TEST_URI = "ipfs://QmTest123";

  beforeEach(async function () {
    [owner, minter, user] = await ethers.getSigners();

    ProofLayerSBT = await ethers.getContractFactory("ProofLayerSBT");
    sbt = await ProofLayerSBT.deploy();
    await sbt.deployed();

    // Grant minter role to minter account
    const minterRole = await sbt.MINTER_ROLE();
    await sbt.grantRole(minterRole, minter.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const defaultAdminRole = await sbt.DEFAULT_ADMIN_ROLE();
      expect(await sbt.hasRole(defaultAdminRole, owner.address)).to.be.true;
    });

    it("Should set the right name and symbol", async function () {
      expect(await sbt.name()).to.equal("ProofLayer SBT");
      expect(await sbt.symbol()).to.equal("PROOF");
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      await expect(sbt.connect(minter).mint(user.address, TEST_URI))
        .to.emit(sbt, "ProofPackMinted")
        .withArgs(user.address, 0, TEST_URI);

      expect(await sbt.ownerOf(0)).to.equal(user.address);
      expect(await sbt.tokenURI(0)).to.equal(TEST_URI);
    });

    it("Should not allow non-minters to mint tokens", async function () {
      await expect(
        sbt.connect(user).mint(user.address, TEST_URI)
      ).to.be.revertedWith(
        `AccessControl: account ${user.address.toLowerCase()} is missing role ${await sbt.MINTER_ROLE()}`
      );
    });

    it("Should not allow minting to zero address", async function () {
      await expect(
        sbt.connect(minter).mint(ethers.constants.AddressZero, TEST_URI)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should not allow minting with empty URI", async function () {
      await expect(
        sbt.connect(minter).mint(user.address, "")
      ).to.be.revertedWith("URI cannot be empty");
    });
  });

  describe("Soulbound Properties", function () {
    beforeEach(async function () {
      await sbt.connect(minter).mint(user.address, TEST_URI);
    });

    it("Should not allow transfer", async function () {
      await expect(
        sbt.connect(user).transferFrom(user.address, minter.address, 0)
      ).to.be.revertedWith("Token cannot be transferred");
    });

    it("Should not allow safe transfer", async function () {
      await expect(
        sbt
          .connect(user)
          ["safeTransferFrom(address,address,uint256)"](
            user.address,
            minter.address,
            0
          )
      ).to.be.revertedWith("Token cannot be transferred");
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to grant minter role", async function () {
      const minterRole = await sbt.MINTER_ROLE();
      await sbt.grantRole(minterRole, user.address);
      expect(await sbt.hasRole(minterRole, user.address)).to.be.true;
    });

    it("Should not allow non-admin to grant minter role", async function () {
      const minterRole = await sbt.MINTER_ROLE();
      await expect(
        sbt.connect(user).grantRole(minterRole, user.address)
      ).to.be.revertedWith(
        `AccessControl: account ${user.address.toLowerCase()} is missing role ${await sbt.DEFAULT_ADMIN_ROLE()}`
      );
    });
  });
});
