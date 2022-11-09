// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.3/utils/Counters.sol";

contract MyToken is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // For the mint to raise money
    uint256 public price = 0.005 ether; 
    
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Dogs_for_the_planet", "DFTP") {
        _tokenIdCounter.increment();
    }

    // Owner of contract can withdraw the funds
    function withdraw() public onlyOwner() {
        require(address(this).balance > 0, "No funds raised !");
        payable(owner()).transfer(address(this).balance);
    }

    // URL pinata metadata NFTs
    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/Qmb8HcWeooj1FAmvtQxkyZPiqQbhVTdQwF8y1bvU3AfGxx/";
    }

    // MINT function
    function safeMint() public payable {
        
        require(msg.value >= price, "Make sure you send enough ETHER (0.005 for mint)");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
