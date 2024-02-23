const MyContractAux = artifacts.require("MyContractAux");

module.exports = function (deployer) {
  deployer.deploy(MyContractAux);
}