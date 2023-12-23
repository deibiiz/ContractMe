const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
    const [owner, buyer, owner2, owner3, buyer2] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
    const salary = web3.utils.toWei("1", "ether");
    const duration = 10;
    const description = "Contrato de prueba para firmar";

    it("Comprueba que un contrato se pause de forma correcta", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
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
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
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

    it("Comprueba que un contrato se pueda cancelar y este deje de tener valor.", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;

        await contract.cancelContract(tokenId, { from: owner });


        let errorOcurred = false;
        try {
            await contract.ownerOf(tokenId);
        } catch (e) {
            errorOcurred = true;
        }

        assert.isTrue(errorOcurred, "El contrato no se ha cancelado correctamente");

    });


    it("Comprueba que el rol de manager pueda interactuar con el contrato", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await contract.assignManagerToToken(mintedToken.logs[0].args.tokenId, owner2);

        const isOwner2Manager = await contract.isManagerOfToken(tokenId, owner2);
        assert(isOwner2Manager, "El rol de manager no se ha asignado correctamente");

        await contract.cancelContract(tokenId, { from: owner2 });
        let errorOcurred = false;
        try {
            await contract.ownerOf(tokenId);
        } catch (e) {
            errorOcurred = true;
        }

        assert.isTrue(errorOcurred, "El contrato no se ha cancelado correctamente");
    });

    it("Comrprueba que un manager pueda modificar un contrato que todavía no se ha firmado", async () => {
        const contract = await MyContract.deployed();
        const newSalary = web3.utils.toWei("4", "ether");
        const newDuration = 20;
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;

        await contract.modifyContract(tokenId, newSalary, newDuration, description, { from: owner, value: newSalary });
        const modifiedContract = await contract.contractDetails(tokenId);

        assert.equal(modifiedContract.salary, newSalary, "El salario no se ha modificado correctamente");
        assert.equal(modifiedContract.duration, newDuration, "La duración no se ha modificado correctamente");

    });

    it("Comprueba los contratos que ha emitido un owner", async () => {
        const contract = await MyContract.deployed();
        const mintedToken = await contract.mint(buyer2, salary, duration, description, { from: owner3, value: salary });
        const mintedToken2 = await contract.mint(buyer2, salary, duration, description, { from: owner3, value: salary });
        const mintedToken3 = await contract.mint(buyer2, salary, duration, description, { from: owner, value: salary });
        await contract.signContract(mintedToken.logs[0].args.tokenId, { from: buyer2 });
        await contract.signContract(mintedToken2.logs[0].args.tokenId, { from: buyer2 });
        await contract.signContract(mintedToken3.logs[0].args.tokenId, { from: buyer2 });

        const contractsOwner = await contract.getContractsFromOwner(owner3);
        const contractsWorker = await contract.getContractsOfWorker(buyer2);
        assert.equal(contractsOwner.length, 2, "El número de contratos del owner no es correcto");
        assert.equal(contractsWorker.length, 3, "El número de contratos del trabajador no es correcto");
    });
});