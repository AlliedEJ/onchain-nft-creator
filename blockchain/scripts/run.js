const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to: " + nftContract.address);

    //Create First NFT
    let txn = await nftContract.makeEpicNFT();
    await txn.wait()

    //Create Second NFT
    txn = await nftContract.makeEpicNFT();
    await txn.wait()

    //Check tokenCoun
    let count = await nftContract.getTotalMint();
    console.log(count.toNumber());
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