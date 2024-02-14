import Web3 from 'web3';

const MyContract = require('./MyContract.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0x8F15B1Cb3B9f908A84D6A749977e350B7e59ad3B';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };