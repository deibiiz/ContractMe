// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyContract is ERC721 {
    uint256 tokenID;
    mapping(uint256 => mapping(address => bool)) public tokenManagers;
    mapping(uint256 => ContractDetails) public contractDetails;
    mapping(address => uint256[]) private contractsOwner;
    mapping(address => uint256[]) private activeContractsOfWorker;
    struct ContractDetails {
        uint256 salary;
        uint256 startDate;
        uint256 duration;
        string description;
        bool isSigned;
        address worker;
        bool isFinished;
        bool isPaused;
        uint256 pauseTime;
        uint256 pauseDuration;
    }
    event ContractSigned(uint256 indexed tokenId, address worker);
    event SalaryReleased(uint256 indexed tokenId, uint256 salary);
    event TokenMinted(uint256 tokenId);
    event ContractCancelled(uint256 indexed tokenId);

    constructor() ERC721("MyToken", "MTK") {}

    function mint(
        address _to,
        uint256 _salary,
        uint256 _duration,
        string memory _description
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
            startDate: block.timestamp, // en segundos
            duration: _duration,
            description: _description,
            isSigned: false,
            worker: _to,
            isFinished: false,
            isPaused: false,
            pauseTime: 0,
            pauseDuration: 0
        });

        contractDetails[tokenID] = newContract;
        tokenManagers[tokenID][msg.sender] = true;
        contractsOwner[msg.sender].push(tokenID);
        emit TokenMinted(tokenID);

        return tokenID;
    }

    function signContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[tokenID][msg.sender] == false,
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
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration >=
                block.timestamp,
            "El contrato ha expirado"
        );

        contractDetails[_tokenID].isSigned = true;
        contractDetails[_tokenID].worker = msg.sender;
        activeContractsOfWorker[msg.sender].push(_tokenID);
        emit ContractSigned(_tokenID, msg.sender);
    }

    function releaseSalary(uint256 _tokenID) public payable {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            tokenManagers[tokenID][msg.sender] == true,
            "Solo un manager puede liberar el salario"
        );
        require(
            contractDetails[_tokenID].isFinished == true ||
                contractDetails[_tokenID].startDate +
                    contractDetails[_tokenID].duration <=
                block.timestamp,
            "El contrato no ha expirado aun o no ha finalizado"
        );
        require(
            contractDetails[_tokenID].isPaused == false,
            "El contrato esta pausado"
        );

        address payable worker = payable(contractDetails[_tokenID].worker);
        uint256 salary = contractDetails[_tokenID].salary;
        worker.transfer(salary);
        emit SalaryReleased(_tokenID, salary);
    }

    function finalizeContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[tokenID][msg.sender] == true,
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
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration >
                block.timestamp,
            "El contrato ya ha expirado"
        );

        contractDetails[_tokenID].isFinished = true;
    }

    function pauseContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[tokenID][msg.sender] == true,
            "Solo un manager puede pausar un contrato"
        );
        require(
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration >=
                block.timestamp,
            "El contrato ha expirado"
        );
        require(
            !contractDetails[_tokenID].isPaused,
            "El contrato ya esta pausado"
        );

        contractDetails[_tokenID].isPaused = true;
        contractDetails[_tokenID].pauseTime = block.timestamp;
    }

    function unPauseContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[tokenID][msg.sender] == true,
            "Solo un manager puede reanudar un contrato"
        );
        require(
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            contractDetails[_tokenID].isPaused,
            "El contrato no esta pausado"
        );

        contractDetails[_tokenID].pauseDuration =
            block.timestamp -
            contractDetails[_tokenID].pauseTime;

        contractDetails[_tokenID].duration += contractDetails[_tokenID]
            .pauseDuration;

        contractDetails[_tokenID].pauseTime = 0;
        contractDetails[_tokenID].isPaused = false;
    }

    function cancelContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[tokenID][msg.sender] == true,
            "Solo un manager puede cancelar un contrato"
        );
        require(
            !contractDetails[_tokenID].isSigned,
            "El contrato ya ha sido firmado"
        );

        address payable owner = payable(msg.sender);
        uint256 salary = contractDetails[_tokenID].salary;
        owner.transfer(salary);
        _burn(_tokenID);
        emit ContractCancelled(_tokenID);
    }

    function assignManagerToToken(
        uint256 _tokenId,
        address _newManager
    ) public {
        require(
            tokenManagers[_tokenId][msg.sender],
            "Solo un manager de este contrato puede asignar otro manager"
        );
        tokenManagers[_tokenId][_newManager] = true;
        contractsOwner[_newManager].push(tokenID);
    }

    function revokeManagerFromToken(uint256 _tokenId, address _manager) public {
        require(
            tokenManagers[_tokenId][msg.sender],
            "Solo un manager de este contrato puede revocar otro manager"
        );
        tokenManagers[_tokenId][_manager] = false;
    }

    function isManagerOfToken(
        uint256 _tokenId,
        address _manager
    ) public view returns (bool) {
        return tokenManagers[_tokenId][_manager];
    }

    //Funcion para modificar un contrato que no haya sido firmado
    function modifyContract(
        uint256 _tokenID,
        uint256 _salary,
        uint256 _duration,
        string memory _description
    ) public payable {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[tokenID][msg.sender] == true,
            "Solo un manager puede modificar un contrato"
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
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration >=
                block.timestamp,
            "El contrato ha expirado"
        );

        uint256 currentSalary = contractDetails[_tokenID].salary;

        if (_salary > currentSalary) {
            uint256 salaryDifference = _salary - currentSalary;
            require(
                msg.value >= salaryDifference,
                "Fondos insuficientes para cubrir el incremento del salario"
            );

            uint256 excessAmount = msg.value - salaryDifference;
            if (excessAmount > 0) {
                payable(msg.sender).transfer(excessAmount);
            }
        } else if (_salary < currentSalary) {
            uint256 refundAmount = currentSalary - _salary;
            payable(msg.sender).transfer(refundAmount);
        }

        contractDetails[_tokenID].salary = _salary;
        contractDetails[_tokenID].duration = _duration;
        contractDetails[_tokenID].description = _description;
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
}
