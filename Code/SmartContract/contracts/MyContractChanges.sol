// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyContract.sol";

contract MyContractChanges is MyContract {
    event ChangeProposed(
        uint256 indexed tokenId,
        address indexed employer,
        address indexed worker,
        uint256 salary,
        uint256 newSalary,
        uint256 timestamp
    );

    event ApprovalChanges(
        uint256 indexed tokenId,
        address indexed employer,
        address indexed worker,
        uint256 salary,
        uint256 newSalary,
        uint256 timestamp
    );

    event RejectChanges(
        uint256 indexed tokenId,
        address indexed employer,
        address indexed worker,
        uint256 newSalary,
        uint256 timestamp
    );

    function pauseContract(uint256 _tokenID) public {
        require(
            !contractDetails[_tokenID].isPaused,
            "Error: condiciones no cumplidas."
        );

        contractDetails[_tokenID].isPaused = true;
        contractDetails[_tokenID].pauseTime = block.timestamp;
    }

    function unPauseContract(uint256 _tokenID) public {
        require(
            contractDetails[_tokenID].isPaused,
            "Error: condiciones no cumplidas."
        );

        uint256 pauseDuration = block.timestamp -
            contractDetails[_tokenID].pauseTime;

        contractDetails[_tokenID].duration += pauseDuration;
        contractDetails[_tokenID].pauseDuration += pauseDuration;
        contractDetails[_tokenID].pauseTime = 0;
        contractDetails[_tokenID].isPaused = false;
    }

    function assignManagerToToken(
        uint256 _tokenID,
        address _newManager
    ) public {
        require(
            msg.sender == ownerOf(_tokenID) &&
                !tokenManagers[_tokenID][_newManager] &&
                _newManager != ownerOf(_tokenID),
            "Error: condiciones no cumplidas."
        );

        if (!tokenManagers[_tokenID][_newManager]) {
            tokenManagers[_tokenID][_newManager] = true;
            tokenManagersList[_tokenID].push(_newManager);
            contractsOwner[_newManager].push(_tokenID);
        }
    }

    function revokeManagerFromToken(uint256 _tokenId, address _manager) public {
        require(
            msg.sender == ownerOf(_tokenId) &&
                tokenManagers[_tokenId][_manager],
            "Error: condiciones no cumplidas."
        );

        for (uint256 i = 0; i < tokenManagersList[_tokenId].length; i++) {
            if (tokenManagersList[_tokenId][i] == _manager) {
                removeManagerFromList(_tokenId, i);
                break;
            }
        }

        tokenManagers[_tokenId][_manager] = false;
        removeContractFromOwner(_tokenId, _manager);
    }

    function removeManagerFromList(uint256 _tokenId, uint256 _index) private {
        tokenManagersList[_tokenId][_index] = tokenManagersList[_tokenId][
            tokenManagersList[_tokenId].length - 1
        ];
        tokenManagersList[_tokenId].pop();
    }

    function proposeChange(
        uint256 _tokenID,
        string memory _newTitle,
        uint256 _newSalary,
        uint256 _newDuration,
        string memory _newDescription,
        bool _isPaused
    ) public payable {
        require(
            contractDetails[_tokenID].isSigned &&
                !isContractFinished(_tokenID) &&
                !changeProposals[_tokenID].isPending &&
                tokenManagers[_tokenID][msg.sender],
            "Error: condiciones no cumplidas."
        );

        uint256 currentSalary = contractDetails[_tokenID].salary;
        if (_newSalary > currentSalary) {
            uint256 salaryDifference = _newSalary - currentSalary;
            require(
                msg.value >= salaryDifference,
                "Fondos insuficientes para cubrir el incremento del salario"
            );

            uint256 excessAmount = msg.value - salaryDifference;
            if (excessAmount > 0) {
                payable(msg.sender).transfer(excessAmount);
            }
            emit ChangeProposed(
                _tokenID,
                msg.sender,
                contractDetails[_tokenID].worker,
                currentSalary,
                _newSalary,
                block.timestamp
            );
        }

        changeProposals[_tokenID] = ChangeProposal({
            newTitle: _newTitle,
            newSalary: _newSalary,
            newDuration: _newDuration,
            newDescription: _newDescription,
            isPaused: _isPaused,
            isPending: true
        });
    }

    function rejectChange(uint256 _tokenID) public {
        require(
            changeProposals[_tokenID].isPending &&
                !isContractFinished(_tokenID),
            "Error: condiciones no cumplidas."
        );

        ChangeProposal memory proposedChange = changeProposals[_tokenID];

        if (proposedChange.newSalary > contractDetails[_tokenID].salary) {
            uint256 salaryDifference = proposedChange.newSalary -
                contractDetails[_tokenID].salary;
            address owner = ownerOf(_tokenID);
            payable(owner).transfer(salaryDifference);
        }

        changeProposals[_tokenID].isPending = false;
        emit RejectChanges(
            _tokenID,
            ownerOf(_tokenID),
            contractDetails[_tokenID].worker,
            proposedChange.newSalary,
            block.timestamp
        );
    }

    function applyChange(uint256 _tokenID) public payable {
        require(
            changeProposals[_tokenID].isPending &&
                !isContractFinished(_tokenID),
            "Error: condiciones no cumplidas."
        );

        ChangeProposal memory proposedChange = changeProposals[_tokenID];
        uint256 salary = contractDetails[_tokenID].salary;

        if (proposedChange.newSalary < salary) {
            uint256 refundAmount = salary - proposedChange.newSalary;
            address owner = ownerOf(_tokenID);
            payable(owner).transfer(refundAmount);
        }

        contractDetails[_tokenID].title = proposedChange.newTitle;
        contractDetails[_tokenID].salary = proposedChange.newSalary;
        contractDetails[_tokenID].duration = proposedChange.newDuration;
        contractDetails[_tokenID].description = proposedChange.newDescription;

        if (proposedChange.isPaused != contractDetails[_tokenID].isPaused) {
            if (proposedChange.isPaused) {
                pauseContract(_tokenID);
            } else {
                unPauseContract(_tokenID);
            }
        }

        changeProposals[_tokenID].isPending = false;

        emit ApprovalChanges(
            _tokenID,
            ownerOf(_tokenID),
            contractDetails[_tokenID].worker,
            salary,
            proposedChange.newSalary,
            block.timestamp
        );
    }
}
