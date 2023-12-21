const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
    const [owner, buyer, buer2] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
    const salary = web3.utils.toWei("1", "ether");
    const duration = 5; 
    const description = "Contrato de prueba para firmar";
    

    it("Verifica que solo un usuario distino al que acuñó el NFT pueda firmarlo", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        try{
            await contract.signContract(tokenId, { from: owner });
        }catch(e){
            errorOcurred = true;
        }

        assert(errorOcurred, "El dueño del contrato no puede firmarlo");
    });

    it("Verifica que solo el usuario especificado en el contrato pueda firmarlo", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        try{
            await contract.signContract(tokenId, { from: buyer2 });
        }catch(e){
            errorOcurred = true;
        }

        assert(errorOcurred, "Solo el usuario especificado en el contrato puede firmarlo");
    });

    it("Verifica que el un contrato que haya sido firmado no pueda ser firmado de nuevo", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await contract.signContract(tokenId, { from: buyer });

        try{
            await contract.signContract(tokenId, { from: buyer });
        }catch(e){
            errorOcurred = true;
        }

        assert(errorOcurred, "Un contrato que ya ha sido firmado no puede ser firmado de nuevo");
    });

    it("Verifica que un contrato no pueda ser firmado tras su vencimiento", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;
        
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
            // Avanza el tiempo
    await new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [duration + 1], // Aumenta el tiempo más allá de la duración del contrato
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err); }
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_mine',
                params: [],
                id: new Date().getTime()
            }, (err, result) => {
                if (err) { return reject(err); }
                resolve();
            });
        });
    });


        try{
            await contract.signContract(tokenId, { from: buyer });
        }catch(e){
            errorOcurred = true;
        }

        assert(errorOcurred, "Un contrato que ya ha vencido no puede ser firmado");
    });

});

