
import Web3 from 'web3';

const MyContract = require('./MyContract.json');
const ganacheUrl = 'http://localhost:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0x98a3465AaA0d9451AA8eC996f4a99d9c15376770';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };