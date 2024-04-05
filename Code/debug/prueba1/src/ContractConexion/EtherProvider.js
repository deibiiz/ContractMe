import { ethers } from 'ethers';
import ABI from './MyContractAux.json';

function EtherProvider() {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/d2fa416c31e348ef82c706d0a1e24fc8');
    const contractAddress = '0x3eA2717cf5AE3ccc89d868fB317aE938b6aC8EBc';
    const contract = new ethers.Contract(contractAddress, ABI, provider);

    return { contract, provider, contractAddress, ABI }
}
export { EtherProvider }
