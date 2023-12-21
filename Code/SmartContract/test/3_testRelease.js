const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
    const [owner, buyer] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
    const salary = web3.utils.toWei("1", "ether");
    const duration = 1;
    const description = "Contrato de prueba para firmar";
    
    it("Verifica que solo el propiertario pueda liberar el salario", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        await contract.signContract(mintedToken.logs[0].args.tokenId, { from: buyer });
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
            await contract.releaseSalary(tokenId, { from: buyer });
        }catch(e){
            errorOcurred = true;
        }
        
        assert(errorOcurred, "El salario no puede ser liberado por alguien distinto al propietario");
    });


    it("Verifica que el salario no pueda ser liberado antes de que el contrato expire", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        await contract.signContract(mintedToken.logs[0].args.tokenId, { from: buyer });
        const tokenId = mintedToken.logs[0].args.tokenId;

        try{
            await contract.releaseSalary(tokenId, { from: owner });
        }catch(e){
            errorOcurred = true;
        }
        
        assert(errorOcurred, "El salario no puede ser liberado antes de que el contrato expire");
    });

    it("Comprueba que el salario se transfiera al comprador cuando se libere el pago", async () => {
        const contract = await MyContract.deployed();
        const initialBalance = await web3.eth.getBalance(buyer);
        const mintedToken = await contract.mint(buyer, salary, duration, description, { from: owner, value: salary });
        await contract.signContract(mintedToken.logs[0].args.tokenId, { from: buyer });
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
        await contract.releaseSalary(tokenId, { from: owner });
        const finalBalance = await web3.eth.getBalance(buyer);

        console.log("Salario: ", salary);
        console.log("Saldo inicial del trabajador: ", initialBalance);
        console.log("Saldo final del trabajador: ", finalBalance);
        assert(finalBalance > initialBalance, "El salario no se transfirió al comprador");
    });

});