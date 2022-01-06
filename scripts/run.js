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

    //Log Random Function
    let randm = await nftContract.pickRandomFirstWord(3);

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