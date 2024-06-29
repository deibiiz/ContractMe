const MyContract = artifacts.require("MyContractAux");

contract("MyContract", accounts => {

  const [owner, buyer] = accounts; //owner es el que despliega el contrato y buyer generalmente es la segunda cuenta de ganache
  const salary = web3.utils.toWei("1", "ether");
  const start = 1;
  const duration = 120; // 2 minutos
  const description = "Trabajo de prueba";
  const title = "Titulo de prueba";

  it("Acuñar un NFT cuando se envia el suficiente dinero", async () => {
    const contract = await MyContract.deployed();

    const initialBalance = await web3.eth.getBalance(buyer);
    await contract.mint(buyer, salary, start, duration, description, title, { from: buyer, value: salary });
    const finalBalance = await web3.eth.getBalance(buyer);
    const cost = web3.utils.toBN(initialBalance).sub(web3.utils.toBN(finalBalance));

    assert(cost.gte(web3.utils.toBN(salary)), "El valor enviado debe ser mayor o igual que el salario establecido");
  });


  it("No se puede acuñar un NFT si no se envia suficiente dinero", async () => {
    const contract = await MyContract.deployed();

    let errorOcurred = false;
    try {
      await contract.mint(buyer, salary, start, duration, description, title, { from: buyer, value: web3.utils.toWei("0.5", "ether") });
    } catch (e) {
      errorOcurred = true;
    }

    assert(errorOcurred, "No se puede acuñar un NFT si no se envia suficiente dinero");
  });
});
