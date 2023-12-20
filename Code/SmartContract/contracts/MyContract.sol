// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    uint256 tokenID;
    uint tokenPrice = 1 ether;

    constructor() ERC721("MyToken", "MTK") {}

    function mint() public payable returns (uint256) {
        require(msg.value >= tokenPrice, "insufficient funds");
        tokenID++;
        _mint(msg.sender, tokenID);

        uint256 remainder = msg.value - tokenPrice;
        if (remainder > 0) {
            payable(msg.sender).transfer(remainder);
        }

        return tokenID;
    }
}
