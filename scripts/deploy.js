const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to: " + nftContract.address);

    let txn = await nftContract.makeEpicNFT();
    await txn.wait();
    console.log("First NFT Minted");

    txn = await nftContract.makeEpicNFT();
    await txn.wait();
    console.log("Second NFT Minted");

    txn = await nftContract.makeEpicNFT();
    await txn.wait();
    console.log("Third NFT Minted");
}

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

runMain();