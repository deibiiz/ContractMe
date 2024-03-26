// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyContractManagement.sol";
import "./MyContractChanges.sol";

contract MyContractAux is MyContractManagement, MyContractChanges {
    function getManagersOfToken(
        uint256 _tokenId
    ) public view returns (address[] memory) {
        return tokenManagersList[_tokenId];
    }

    function isManagerOfToken(
        uint256 _tokenId,
        address _manager
    ) public view returns (bool) {
        return tokenManagers[_tokenId][_manager];
    }

    function getContractsFromOwner(
        address _address
    ) public view returns (uint256[] memory) {
        return contractsOwner[_address];
    }

    function getContractsOfWorker(
        address _address
    ) public view returns (uint256[] memory) {
        return activeContractsOfWorker[_address];
    }

    function getUnsignedContractsOfWorker(
        address worker
    ) public view returns (uint256[] memory) {
        uint256 totalContracts = unsignedContractsOfWorker[worker].length;
        uint256[] memory tempContracts = new uint256[](totalContracts);
        uint256 count = 0;

        for (uint256 i = 0; i < totalContracts; i++) {
            uint256 contractId = unsignedContractsOfWorker[worker][i];

            if (
                !contractDetails[contractId].isSigned && tokenExists(contractId)
            ) {
                tempContracts[count] = contractId;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = tempContracts[j];
        }
        return result;
    }

    function tokenExists(uint256 _tokenId) public view returns (bool) {
        try this.ownerOf(_tokenId) {
            return true;
        } catch {
            return false;
        }
    }

    function isContractSigned(uint256 _tokenID) public view returns (bool) {
        return contractDetails[_tokenID].isSigned;
    }

    function getOwnerOfContract(
        uint256 _tokenID
    ) public view returns (address) {
        return ownerOf(_tokenID);
    }
}
