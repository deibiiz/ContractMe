import Web3 from 'web3';

const MyContract = require('./MyContract.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0x5a0D30E8e062a1cbb2CE694D7e6409350C11125A';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };