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

    struct ChangeProposal {
        string newTitle;
        uint256 newSalary;
        uint256 newDuration;
        string newDescription;
        bool isPaused;
        bool isPending;
    }

    mapping(uint256 => ContractDetails) public contractDetails;
    mapping(uint256 => ChangeProposal) public changeProposals;
    mapping(uint256 => mapping(address => bool)) public tokenManagers;
    mapping(address => uint256[]) public contractsOwner;
    mapping(address => uint256[]) public activeContractsOfWorker;
    mapping(address => uint256[]) public unsignedContractsOfWorker;
    mapping(uint256 => address[]) public tokenManagersList;
    uint256 public tokenID;


    function isContractFinished(uint256 _tokenID) public view returns (bool) {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); 
        }
        
        if (contractDetails[_tokenID].isFinished == true) {
            return true;
        }
        if (
            block.timestamp >
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration +
                contractDetails[_tokenID].pauseDuration
        ) {
            return true;
        }
        return false;
    }


    function removeContractFromOwner(
        uint256 _tokenID,
        address _owner
    ) internal {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); 
        }
        require(
            ownerOf(_tokenID) == _owner,
            "El propietario no coincide con el propietario del token"
        );

        uint256 contractIndex;
        uint256 lastContractIndex = contractsOwner[_owner].length - 1;

        for (uint i = 0; i < contractsOwner[_owner].length; i++) {
            if (contractsOwner[_owner][i] == _tokenID) {
                contractIndex = i;
                break;
            }
        }

        if (contractIndex != lastContractIndex) {
            contractsOwner[_owner][contractIndex] = contractsOwner[_owner][
                lastContractIndex
            ];
        }
        contractsOwner[_owner].pop();
    }

    constructor() ERC721("MyToken", "MTK") {}
}
