const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
    const [owner, buyer] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
    const salary = web3.utils.toWei("1", "ether");
    const duration = 5; 
    const description = "Contrato de prueba para firmar";
    

    it("Verifica que solo un usuario distino al que acuñó el NFT pueda firmarlo", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        try{
            await contract.signContract(tokenId, { from: owner });
        }catch(e){
            errorOcurred = true;
        }

        assert(errorOcurred, "El dueño del contrato no puede firmarlo");
    });

    it("Verifica que el un contrato que haya sido firmado no pueda ser firmado de nuevo", async () => {
        const contract = await MyContract.deployed();
        let errorOcurred = false;

        const mintedToken = await contract.mint(salary, duration, description, { from: owner, value: salary });
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
        
        const mintedToken = await contract.mint(salary, duration, description, { from: owner, value: salary });
        const tokenId = mintedToken.logs[0].args.tokenId;
        await new Promise(resolve => setTimeout(resolve, duration+10000)); //para el tiempo esta cantidad de tiempo


        try{
            await contract.signContract(tokenId, { from: buyer });
        }catch(e){
            errorOcurred = true;
        }

        assert(errorOcurred, "Un contrato que ya ha vencido no puede ser firmado");
    });

});

