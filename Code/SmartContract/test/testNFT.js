const MyContract = artifacts.require("MyContract");

contract("MyContract", accounts => {
  const mintPrice = web3.utils.toWei("0.1", "ether");
  const overpayAmount = web3.utils.toWei("0.15", "ether");
  const [owner, buyer] = accounts;

  it("should mint a token when exactly 0.1 ether is paid", async () => {
    const contract = await MyContract.deployed();

    const initialBalance = await web3.eth.getBalance(buyer);
    await contract.mint({ from: buyer, value: mintPrice });
    const finalBalance = await web3.eth.getBalance(buyer);

    const cost = web3.utils.toBN(initialBalance).sub(web3.utils.toBN(finalBalance));
    assert(cost.lte(web3.utils.toBN(mintPrice)), "The cost should not exceed 0.1 ether");
  });

  it("should return the excess ether when overpaid", async () => {
    const contract = await MyContract.deployed();

    const initialBalance = await web3.eth.getBalance(buyer);
    await contract.mint({ from: buyer, value: overpayAmount });
    const finalBalance = await web3.eth.getBalance(buyer);

    const expectedFinalBalance = web3.utils.toBN(initialBalance)
                                      .sub(web3.utils.toBN(mintPrice));
    assert(finalBalance > expectedFinalBalance, "Excess ether should be refunded");
  });
});
