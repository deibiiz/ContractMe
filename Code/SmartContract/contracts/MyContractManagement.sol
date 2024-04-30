// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyContract.sol";

contract MyContractManagement is MyContract {
    event SalaryReleased(
        uint256 indexed tokenId,
        uint256 salary,
        address indexed employer,
        address indexed worker,
        uint256 timestamp
    );

    event TokenMinted(
        uint256 tokenId,
        address indexed employer,
        address indexed worker,
        uint256 salary,
        uint256 timestamp
    );

    event ContractCancelled(
        uint256 indexed tokenId,
        address indexed employer,
        address indexed worker,
        uint256 salary,
        uint256 timestamp
    );

    event ContractSigned(
        uint256 indexed tokenId,
        address indexed employer,
        address indexed worker,
        uint256 timestamp
    );

    event ContractFinalized(
        uint256 indexed tokenId,
        address indexed employer,
        address indexed worker,
        uint256 timestamp
    );

    function mint(
        address _to,
        uint256 _salary,
        uint256 _start,
        uint256 _duration,
        string memory _description,
        string memory _title
    ) public payable returns (uint256) {
        require(
            msg.value >= _salary,
            "Dede enviar el salario como valor del contrato"
        );
        tokenID++;
        _mint(msg.sender, tokenID);
        uint256 remainder = msg.value - _salary;
        if (remainder > 0) {
            payable(msg.sender).transfer(remainder);
        }

        ContractDetails memory newContract = ContractDetails({
            salary: _salary,
            startDate: _start + block.timestamp,
            duration: _duration,
            title: _title,
            description: _description,
            isSigned: false,
            worker: _to,
            isFinished: false,
            isReleased: false,
            isPaused: false,
            pauseTime: 0,
            pauseDuration: 0
        });

        contractDetails[tokenID] = newContract;
        tokenManagers[tokenID][msg.sender] = true;
        contractsOwner[msg.sender].push(tokenID);
        unsignedContractsOfWorker[_to].push(tokenID);

        emit TokenMinted(tokenID, msg.sender, _to, _salary, block.timestamp);
        return tokenID;
    }

    function signContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe.");
        }
        require(
            tokenManagers[_tokenID][msg.sender] == false &&
                !contractDetails[_tokenID].isSigned &&
                contractDetails[_tokenID].isFinished == false &&
                isContractFinished(_tokenID) == false,
            "Error: condiciones no cumplidas."
        );

        contractDetails[_tokenID].isSigned = true;
        contractDetails[_tokenID].worker = msg.sender;
        activeContractsOfWorker[msg.sender].push(_tokenID);

        emit ContractSigned(
            _tokenID,
            ownerOf(_tokenID),
            msg.sender,
            block.timestamp
        );
    }

    function releaseSalary(uint256 _tokenID) public payable {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe.");
        }
        require(
            contractDetails[_tokenID].isSigned &&
                contractDetails[_tokenID].isReleased == false &&
                tokenManagers[_tokenID][msg.sender] == true &&
                isContractFinished(_tokenID) == true,
            "Error: condiciones no cumplidas."
        );

        address payable worker = payable(contractDetails[_tokenID].worker);
        uint256 salary = contractDetails[_tokenID].salary;
        worker.transfer(salary);
        contractDetails[_tokenID].isReleased = true;

        emit SalaryReleased(
            _tokenID,
            salary,
            msg.sender,
            worker,
            block.timestamp
        );
    }

    function finalizeContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe.");
        }
        require(
            tokenManagers[_tokenID][msg.sender] == true &&
                contractDetails[_tokenID].isSigned &&
                contractDetails[_tokenID].isFinished == false &&
                isContractFinished(_tokenID) == false,
            "Error: condiciones no cumplidas."
        );

        contractDetails[_tokenID].isFinished = true;
        emit ContractFinalized(
            _tokenID,
            ownerOf(_tokenID),
            contractDetails[_tokenID].worker,
            block.timestamp
        );
    }

    function cancelContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe.");
        }
        require(
            tokenManagers[_tokenID][msg.sender] == true &&
                !contractDetails[_tokenID].isSigned &&
                contractDetails[_tokenID].isFinished == false,
            "Error: condiciones no cumplidas."
        );

        address payable owner = payable(ownerOf(_tokenID));
        uint256 salary = contractDetails[_tokenID].salary;
        owner.transfer(salary);
        removeContractFromOwner(_tokenID, owner);
        _burn(_tokenID);

        emit ContractCancelled(
            _tokenID,
            owner,
            contractDetails[_tokenID].worker,
            salary,
            block.timestamp
        );
    }
}
