// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./library/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords =["Pork", "Toast", "Onion", "Carrot", "Peach", "Apple"];
    string[] secondWords =["Wit", "Clever", "Stable", "Chaotic", "Messy", "Godly"];
    string[] thirdWords =["Madame", "Ape", "Mister", "Maam", "Clown", "Fool", "Master"];

    constructor () ERC721("wordsToLiveNFT", "WTL"){
        console.log("NFT Contract is launched. Whoa!");
    }

   function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }
  
    function pickRandomFirstWord (uint256 tokenId) public view returns (string memory){
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord (uint256 tokenId) public view returns (string memory){
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }
    function pickRandomThirdWord (uint256 tokenId) public view returns (string memory){
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }
    function makeEpicNFT () public {
        uint256 newTokenId = _tokenIds.current();

        string memory w1 = pickRandomFirstWord(newTokenId);
        string memory w2 = pickRandomSecondWord(newTokenId);
        string memory w3 = pickRandomThirdWord(newTokenId);
        string memory combinedWord = string(abi.encodePacked(w1, w2, w3));

        //Create the final SVG image code (NOT base64 encoded)
        string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));

        //Create base64 encode JSON & final encoded SVG
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWord,
                        '", "description": "A collection of philosophies to Live By.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );
        
        //Set finalTokenURI including Base64 encoded JSON & SVG (fully on-chain)
        string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,", json)); 
        console.log("\n--------------------");
        console.log(finalTokenURI);
        console.log("--------------------\n");

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, finalTokenURI);

        _tokenIds.increment();

        console.log("NFT with ID %s has been minted to %s", newTokenId, msg.sender);
    }
}