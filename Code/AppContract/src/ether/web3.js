import Web3 from 'web3';
const MyContract = require('./MyContractAux.json');

//const Url = "https://sepolia.infura.io/v3/d2fa416c31e348ef82c706d0a1e24fc8";
const Url = "http://192.168.1.33:8545"

const web3 = new Web3(new Web3.providers.HttpProvider(Url));
const contractAddress = '0xFD0d3abd856475bC045Ec56AA8766B1E0B285923';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };
