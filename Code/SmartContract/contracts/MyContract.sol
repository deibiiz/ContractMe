// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyContract is ERC721 {
    uint256 tokenID;
    mapping(uint256 => mapping(address => bool)) public tokenManagers;
    mapping(uint256 => ContractDetails) public contractDetails;
    mapping(address => uint256[]) private contractsOwner;
    mapping(address => uint256[]) private activeContractsOfWorker;
    mapping(uint256 => ChangeProposal) public changeProposals;

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

    event ContractSigned(uint256 indexed tokenId, address worker);
    event SalaryReleased(uint256 indexed tokenId, uint256 salary);
    event TokenMinted(uint256 tokenId);
    event ContractCancelled(uint256 indexed tokenId);
    event ContractFinalized(uint256 indexed tokenId);
    event Debug(
        uint256 currentSalary,
        uint256 newSalary,
        uint256 salaryDifference,
        uint256 msgValue
    );

    constructor() ERC721("MyToken", "MTK") {}

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
        emit TokenMinted(tokenID);

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
        emit SalaryReleased(_tokenID, salary);
    }

    function finalizeContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
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
        emit ContractFinalized(_tokenID);
    }

    function pauseContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            isContractFinished(_tokenID) == false,
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
            contractDetails[_tokenID].isSigned,
            "El contrato no ha sido firmado"
        );
        require(
            contractDetails[_tokenID].isPaused,
            "El contrato no esta pausado"
        );
        require(
            isContractFinished(_tokenID) == false,
            "El contrato ha expirado"
        );

        contractDetails[_tokenID].pauseDuration =
            block.timestamp -
            contractDetails[_tokenID].pauseTime;

        contractDetails[_tokenID].pauseTime = 0;
        contractDetails[_tokenID].isPaused = false;
    }

    function cancelContract(uint256 _tokenID) public {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            tokenManagers[_tokenID][msg.sender] == true,
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
        removeContractFromOwner(_tokenID, msg.sender);
        emit ContractCancelled(_tokenID);
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

    //funcion para proponer un cambio en un contrato
    function proposeChange(
        uint256 _tokenID,
        string memory _newTitle,
        uint256 _newSalary,
        uint256 _newDuration,
        string memory _newDescription,
        bool _isPaused
    ) public payable {
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

    //funcion para rechazar un cambio propuesto
    function rejectChange(uint256 _tokenID) public {
        require(
            changeProposals[_tokenID].isPending == true,
            "No hay cambios propuestos"
        );
        ChangeProposal memory proposedChange = changeProposals[_tokenID];

        if (proposedChange.newSalary > contractDetails[_tokenID].salary) {
            uint256 salaryDifference = proposedChange.newSalary -
                contractDetails[_tokenID].salary;
            address owner = ownerOf(_tokenID);
            payable(owner).transfer(salaryDifference);
        }

        changeProposals[_tokenID].isPending = false;
    }

    //Funcion para modificar un contrato que no haya sido firmado
    function applyChange(uint256 _tokenID) public payable {
        require(
            changeProposals[_tokenID].isPending == true,
            "No hay cambios propuestos"
        );
        ChangeProposal memory proposedChange = changeProposals[_tokenID];

        if (proposedChange.newSalary < contractDetails[_tokenID].salary) {
            uint256 refundAmount = contractDetails[_tokenID].salary -
                proposedChange.newSalary;
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

    function isContractSigned(uint256 _tokenID) public view returns (bool) {
        return contractDetails[_tokenID].isSigned;
    }

    function getOwnerOfContract(
        uint256 _tokenID
    ) public view returns (address) {
        return ownerOf(_tokenID);
    }
}
