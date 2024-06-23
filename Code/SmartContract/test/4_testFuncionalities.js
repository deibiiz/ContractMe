const MyContract = artifacts.require("MyContractAux");

contract("MyContract", accounts => {
    const [owner, buyer, owner2, owner3, buyer2] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
    const salary = web3.utils.toWei("1", "ether");
    const start = 0;
    const duration = 10;
    const description = "Contrato de prueba para firmar";
    const title = "Titulo de prueba";

    it("Comprueba que un contrato se pause de forma correcta", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await contract.signContract(tokenId, { from: buyer });

        // Verificar el estado antes de la pausa
        let contractDetails = await contract.contractDetails(tokenId);
        assert.equal(contractDetails.isPaused, false, "El contrato ya estaba pausado antes de llamar a pauseContract");

        await contract.pauseContract(tokenId, { from: owner });

        // Verificar el estado después de la pausa
        contractDetails = await contract.contractDetails(tokenId);
        assert.equal(contractDetails.isPaused, true, "El contrato no se ha pausado correctamente");
    });

    it("Comprueba que el contrato se despause de forma correcta", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await contract.signContract(tokenId, { from: buyer });
        await contract.pauseContract(tokenId, { from: owner });

        // Verificar el estado antes de la pausa
        let contractDetails = await contract.contractDetails(tokenId);
        assert.equal(contractDetails.isPaused, true, "El contrato no estaba pausado antes de intentar despausarlo");

        await contract.unPauseContract(tokenId, { from: owner });

        // Verificar el estado después de la pausa
        contractDetails = await contract.contractDetails(tokenId);
        assert.equal(contractDetails.isPaused, false, "El contrato no se ha despausado correctamente");
    });

    it("Comprueba que un dueño se pueda cancelar y este deje de tener valor.", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const mintedToken1 = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const mintedToken2 = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const tokenId2 = mintedToken2.logs[0].args.tokenId;

        await contract.cancelContract(tokenId2, { from: owner });


        let errorOcurred = false;
        try {
            await contract.ownerOf(tokenId2);
        } catch (e) {
            errorOcurred = true;
        }

        assert.isTrue(errorOcurred, "El contrato no se ha cancelado correctamente");

    });


    it("Comprueba que el rol de manager pueda interactuar con el contrato", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await contract.assignManagerToToken(mintedToken.logs[0].args.tokenId, owner2);

        await contract.cancelContract(tokenId, { from: owner2 });
        let errorOcurred = false;
        try {
            await contract.ownerOf(tokenId);
        } catch (e) {
            errorOcurred = true;
        }

        assert.isTrue(errorOcurred, "El contrato no se ha cancelado correctamente");
    });

    it("Comprueba que un manager pueda modificar un contrato", async () => {
        const contract = await MyContract.deployed();
        const newSalary = web3.utils.toWei("0.5", "ether");
        const newDuration = 20;
        const nwedescription = "Nuevo Contrato de prueba";
        const newTitle = "Nuevo titulo de prueba";

        const mintedToken = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await contract.signContract(tokenId, { from: buyer });


        try {
            await contract.proposeChange(tokenId, newTitle, newSalary, newDuration, nwedescription, true, { from: owner, value: newSalary });
            await contract.applyChange(tokenId, { from: buyer });
        } catch (e) {
            console.log(e);
        }


        const modifiedContract = await contract.contractDetails(tokenId);
        assert.equal(modifiedContract.salary, newSalary, "El salario no se ha modificado correctamente");
        assert.equal(modifiedContract.duration, newDuration, "La duración no se ha modificado correctamente");
    });

    it("Comprueba los contratos que ha emitido un owner", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer2, salary, start, duration, description, title, { from: owner3, value: salary });
        const mintedToken2 = await contract.mint(buyer2, salary, start, duration, description, title, { from: owner3, value: salary });
        const mintedToken3 = await contract.mint(buyer2, salary, start, duration, description, title, { from: owner, value: salary });
        await contract.signContract(mintedToken.logs[0].args.tokenId, { from: buyer2 });
        await contract.signContract(mintedToken2.logs[0].args.tokenId, { from: buyer2 });
        await contract.signContract(mintedToken3.logs[0].args.tokenId, { from: buyer2 });

        const contractsOwner = await contract.getContractsFromOwner(owner3);
        const contractsWorker = await contract.getContractsOfWorker(buyer2);
        assert.equal(contractsOwner.length, 2, "El número de contratos del owner no es correcto");
        assert.equal(contractsWorker.length, 3, "El número de contratos del trabajador no es correcto");
    });

    it("Comprueba que se pueda eliminar a un manager", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, start, duration, description, title, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;

        await contract.assignManagerToToken(tokenId, owner2, { from: owner });
        let managers = await contract.getManagersOfToken(tokenId);
        assert(managers.includes(owner2), "El manager no fue asignado correctamente");

        const actualOwner = await contract.ownerOf(tokenId);
        assert.equal(actualOwner, owner, "El propietario del token no es quien intenta hacer la revocación");

        await contract.revokeManagerFromToken(tokenId, owner2, { from: owner, gas: 1000000 });
        managers = await contract.getManagersOfToken(tokenId);
        assert.equal(managers.length, 0, "El manager no se ha eliminado correctamente");
    });


});