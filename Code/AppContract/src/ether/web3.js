import Web3 from 'web3';

const MyContract = require('./MyContractAux.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0x481Da21e18C0c55Fd26Dd7e721a6EdCb84557FAD';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };