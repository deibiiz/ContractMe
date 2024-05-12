//ganache-cli --host 192.168.1.33 -d --db ganache_db



let web3Instance = null;

export async function getWeb3() {
    if (!web3Instance) {
        const { default: Web3 } = await import('web3');
        const Url = "http://192.168.1.33:8545";
        web3Instance = new Web3(new Web3.providers.HttpProvider(Url));
    }
    return web3Instance;
}

export async function getMyContract() {
    const web3 = await getWeb3();
    const MyContract1 = require('./MyContractAux.json');
    const contractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
    const MyContract = new web3.eth.Contract(MyContract1.abi, contractAddress);
    return MyContract;
}



/*
import Web3 from 'web3';
const MyContract1 = require('./MyContractAux.json');

const Url = "http://192.168.1.33:8545";
const provider = new Web3(new Web3.providers.HttpProvider(Url));
const contractAddress = '0x82b79c961EE10faAdAaFC0b9bD74d6EE8048032E';

const MyContract = new provider.eth.Contract(MyContract1.abi, contractAddress);

export { MyContract, provider };
*/