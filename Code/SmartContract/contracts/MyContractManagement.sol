// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyContract.sol";

contract MyContractManagement is MyContract{

    mapping(uint256 => mapping(address => bool)) public tokenManagers;
    mapping(address => uint256[]) public contractsOwner;
    mapping(address => uint256[]) public activeContractsOfWorker;
    mapping(address => uint256[]) public unsignedContractsOfWorker;

    event SalaryReleased(
        uint256 indexed tokenId,
        uint256 salary,
        address indexed worker,
        uint256 timestamp
    );
    event TokenMinted(
        uint256 tokenId,
        address indexed employer,
        uint256 salary,
        uint256 timestamp
    );
    event ContractCancelled(
        uint256 indexed tokenId,
        address indexed employer,
        uint256 salary,
        uint256 timestamp
    );



    function mint(
        address _to,
        uint256 _salary,
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
            startDate: block.timestamp,
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
        emit TokenMinted(tokenID, msg.sender, _salary, block.timestamp);

        return tokenID;
    }



    function signContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[_tokenID][msg.sender] == false,
            "No puedes firmar tu propio contrato"
        );
        require(
            msg.sender == contractDetails[_tokenID].worker,
            "Solo el trabajador puede firmar el contrato"
        );
        require(
            !contractDetails[_tokenID].isSigned,
            "El contrato ya ha sido firmado"
        );
        require(
            contractDetails[_tokenID].isFinished == false,
            "El contrato ha finalizado"
        );
        require(
            isContractFinished(_tokenID) == false,
            "El contrato ha expirado"
        );

        contractDetails[_tokenID].isSigned = true;
        contractDetails[_tokenID].worker = msg.sender;
        activeContractsOfWorker[msg.sender].push(_tokenID);
    }



    function releaseSalary(uint256 _tokenID) public payable {
        require(
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            contractDetails[_tokenID].isReleased == false,
            "El salario ya ha sido liberado"
        );
        require(
            tokenManagers[_tokenID][msg.sender] == true,
            "Solo un manager puede liberar el salario"
        );
        require(
            isContractFinished(_tokenID) == true,
            "El contrato no ha expirado"
        );
        require(
            contractDetails[_tokenID].isPaused == false,
            "El contrato esta pausado"
        );

        address payable worker = payable(contractDetails[_tokenID].worker);
        uint256 salary = contractDetails[_tokenID].salary;
        worker.transfer(salary);
        contractDetails[_tokenID].isReleased = true;
        emit SalaryReleased(_tokenID, salary, worker, block.timestamp);
    }



    function finalizeContract(uint256 _tokenID) public {
        require(
            tokenManagers[_tokenID][msg.sender] == true,
            "Solo un manager puede finalizar un contrato"
        );
        require(
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            contractDetails[_tokenID].isFinished == false,
            "El contrato ya ha finalizado"
        );
        require(
            isContractFinished(_tokenID) == false,
            "El contrato ha expirado"
        );

        contractDetails[_tokenID].isFinished = true;
    }



    function cancelContract(uint256 _tokenID) public {
        require(
            !contractDetails[_tokenID].isSigned,
            "El contrato ya ha sido firmado"
        );

        address payable owner = payable(ownerOf(_tokenID));
        uint256 salary = contractDetails[_tokenID].salary;
        owner.transfer(salary);
        removeContractFromOwner(_tokenID, owner);
        _burn(_tokenID);
        emit ContractCancelled(_tokenID, owner, salary, block.timestamp);
    }



    function removeContractFromOwner(
        uint256 _tokenId,
        address _owner
    ) internal {
        uint256 contractIndex;
        uint256 lastContractIndex = contractsOwner[_owner].length - 1;

        for (uint i = 0; i < contractsOwner[_owner].length; i++) {
            if (contractsOwner[_owner][i] == _tokenId) {
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

    
    function isContractFinished(uint256 _tokenID) public view returns (bool) {
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

}
