const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
    const [owner, buyer, owner2] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
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

    });

});