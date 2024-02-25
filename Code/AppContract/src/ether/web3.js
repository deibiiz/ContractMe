import Web3 from 'web3';

const MyContract = require('./MyContractAux.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0xa73fDD29D63617f05BbEF5Ea1f0492C13A6aE7Ae';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };