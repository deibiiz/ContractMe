import React from "react";
import MetaMask from "../ether/MetaMask.js";

const MiComponente = () => {
    const { connectWallet, isConnected, account } = MetaMask();

    const handleBlockchainInteraction = async () => {
        if (!isConnected) {
            await connectWallet();
        }
        if (isConnected) {

        }
    };

    return (
        <div>
            { }
            <button onClick={handleBlockchainInteraction}>Interactuar con Blockchain</button>
        </div>
    );
};

export default MiComponente;