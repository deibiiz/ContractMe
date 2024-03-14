import Web3 from 'web3';
import MyContract from './MyContractAux.json';

const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.33:8545"));
const MyContractInstance = new web3.eth.Contract(MyContract.abi, "0xBB8d833FE43030c439f3C0E404547CB61dca6eB5");

export { web3, MyContractInstance };
