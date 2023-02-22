// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Nft is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint64 private _mintingFee = 0.01 ether;

    event WithdrawBalance(uint256 amount);
    event SafeMint(address recipient, uint256 tokenId, string tokenURI);

    constructor() ERC721("Nft", "NFT") {}

    function withdrawBalance() external onlyOwner {
        uint256 amount = address(this).balance;
        payable(owner()).transfer(amount);

        emit WithdrawBalance(amount);
    }

    function viewBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function safeMint(
        address recipient,
        string memory tokenURI
    ) public payable {
        require(msg.value >= 0.01 ether, "Need to pay up!");
        payable(msg.sender).transfer(msg.value - 0.01 ether);

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit SafeMint(recipient, tokenId, tokenURI);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }
}
