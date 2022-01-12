import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";

// Constants
const TWITTER_HANDLE = 'alliedblock';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const COLLECTION_LINK = 'https://rinkeby.rarible.com/collection/0xFD2fcb6121B56cAED2270A009dC757dB3a6E0e8B/items';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0xFD2fcb6121B56cAED2270A009dC757dB3a6E0e8B";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentCount, setCount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum){
      console.log("Metmask is not detected.");
      return;
    } else{
      console.log("We have an ethereum object", ethereum);
    }
    
    //Check for account authorization
    const accounts = await ethereum.request({method: 'eth_accounts'});
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      checkChainId();
      setupEventListener();
    } else {
      console.log("No authorized account found")
    }
  }

  //Connect Wallet Button Action
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      //Request account access
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      checkChainId();
      setupEventListener();
    } catch (error){
      console.log(error)
    }
  }
  
  //Mint NFT Button Action
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
        console.log("Paying the GAS...")
        let nftTxn = await connectedContract.makeEpicNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

   // Setup Mint Event listener
   const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // This will "capture" our event when our contract throws it.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  //Check Chain ID for Rinkeby
  const checkChainId = async () => {
    const { ethereum } = window;

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
  }

  //Pull token count from Smart Contract
  const tokenCount = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        let totalCurrentTokens = await connectedContract.getTotalMint();
        let tokenNumber = totalCurrentTokens.toNumber();
        console.log(tokenNumber);
        setCount(tokenNumber);
      } else {
        console.log("Ethereum object doesn't exist!");
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );
  
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])
  useEffect(() => {
    tokenCount()
  }, [])
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <p className="sub-text">Total Minted: {currentCount}/{TOTAL_MINT_COUNT}</p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
          <p><a className="footer-text" href={COLLECTION_LINK} target="_blank">see the collection</a></p> 
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
