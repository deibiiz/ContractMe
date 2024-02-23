import Web3 from 'web3';

const MyContract = require('./MyContractAux.json');
const ganacheUrl = 'http://192.168.1.33:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));
const contractAddress = '0xaA6002DfdD3F5557bed08A2dc91471d356bE4721';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };