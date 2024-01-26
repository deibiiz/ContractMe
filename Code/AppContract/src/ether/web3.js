import Web3 from 'web3';

const MyContract = require('./MyContract.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0xAA35aDdD720e29aaC8Eb05C28A820754091cfD77';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };