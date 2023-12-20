// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyContract is ERC721 {
    uint256 tokenID;
    mapping(uint256 => ContractDetails) public contractDetails;
    event ContractSigned(uint256 indexed tokenId, address worker);
    event SalaryReleased(uint256 indexed tokenId, uint256 salary);
    event TokenMinted(uint256 tokenId);
    struct ContractDetails {
        uint256 salary;
        uint256 startDate;
        uint256 duration;
        string description;
        bool isSigned;
        address worker;
    }

    constructor() ERC721("MyToken", "MTK") {}

    function mint(
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
            worker: address(0) // 0x0000000
        });

        contractDetails[tokenID] = newContract;
        emit TokenMinted(tokenID);

        return tokenID;
    }

    function signContract(uint256 _tokenID) public payable {
        try this.ownerOf(_tokenID) {} catch {
            revert("El token no existe."); // he intentado hacerlo con _exists pero no me ha funcionado
        }
        require(
            msg.sender != ownerOf(_tokenID),
            "No puedes firmar tu propio contrato"
        );
        require(
            !contractDetails[_tokenID].isSigned,
            "El contrato ya ha sido firmado"
        );
        require(
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration >=
                block.timestamp,
            "El contrato ha expirado"
        );

        contractDetails[_tokenID].isSigned = true;
        contractDetails[_tokenID].worker = msg.sender;
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
            msg.sender == ownerOf(_tokenID),
            "Solo el propietario puede liberar el salario"
        );
        require(
            contractDetails[_tokenID].startDate +
                contractDetails[_tokenID].duration <=
                block.timestamp,
            "El contrato no ha expirado aun"
        );

        address payable worker = payable(contractDetails[_tokenID].worker);
        uint256 salary = contractDetails[_tokenID].salary;
        worker.transfer(salary);
        emit SalaryReleased(_tokenID, salary);
    }
}
