// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyContract is ERC721 {

    struct ContractDetails {
        uint256 salary;
        uint256 startDate;
        uint256 duration;
        string title;
        string description;
        bool isSigned;
        address worker;
        bool isFinished;
        bool isReleased;
        bool isPaused;
        uint256 pauseTime;
        uint256 pauseDuration;
    }

    uint256 public tokenID;

    mapping(uint256 => ContractDetails) public contractDetails;

    constructor() ERC721("MyToken", "MTK") {}
}
