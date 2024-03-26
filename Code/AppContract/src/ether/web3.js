import Web3 from 'web3';
const MyContract = require('./MyContractAux.json');

//const Url = "https://sepolia.infura.io/v3/d2fa416c31e348ef82c706d0a1e24fc8";
const Url = "http://192.168.1.33:8545"

const web3 = new Web3(new Web3.providers.HttpProvider(Url));
const contractAddress = '0x755D402D37fcBD213D9157aa885B39D2595414cC';
//const contractAddress = '0x0da30EFA5506cE310dC34975b24aF0812EF118aC';

const MyContract1 = new web3.eth.Contract(MyContract.abi, contractAddress);

export { web3, MyContract1 };
