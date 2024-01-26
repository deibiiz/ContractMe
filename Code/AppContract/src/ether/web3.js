import Web3 from 'web3';

const MyContract = require('./MyContract.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0x02BdA2c6430Af65C58334f481F9A174e43Af90e6';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };