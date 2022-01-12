const { expect } = require("chai");

describe("EventEmitter", function () {
  it("Should emit NewEpicNFTMinted", async function () {
    const nftContractFactory = await ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    await expect(nftContract.makeEpicNFT()).to.emit(nftContract, "NewEpicNFTMinted");
  });
});