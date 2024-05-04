//ganache-cli --host 192.168.1.33 -d --db ganache_db

import { ethers } from 'ethers';
import MyContract from './MyContractAux.json';



function EtherProvider() {
    const provider = new ethers.providers.JsonRpcProvider('http://192.168.1.33:8545');
    const contractAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
    const contract = new ethers.Contract(MyContract.abi, provider);

    return { contract, provider, contractAddress }
}

export { EtherProvider }

