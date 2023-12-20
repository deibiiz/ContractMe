from solcx import compile_standard, install_solc
import json
from web3 import Web3
import os
from dotenv import load_dotenv

#load_dotenv()

with open("./SimpleStorage.sol", "r") as file:
    simple_storage_file = file.read()


#compilar
install_solc("0.6.0")
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleStorage.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*":{
                    "*":["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
                }
            }
        },
    },
    solc_version="0.6.0"
)

with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

#bytecode
#ABI

bytecode = compiled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["evm"][  
    "bytecode"
]["object"]

abi = json.loads(
    compiled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["metadata"]
)["output"]["abi"]

w3 = Web3(Web3.HTTPProvider("http://172.26.224.1:7545"))
chain_id = 5777
my_address = "0x910D7c8704936b81213529C453a2D70bAa3bF4ac"
private_key = "0x0743e8a5c3a9a2a256265e000a16d0ae729dd8e8305fce93f08561fb56c50781"
#private_key = os.getenv("PRIVATE_KEY") #desde la terminal he exportado la private key

# Create the contract in Python
SimpleStorage = w3.eth.contract(abi = abi, bytecode = bytecode)
print(SimpleStorage)
# Get the latest transaction
nonce = w3.eth.getTransactionCount(my_address)

# Submit the transaction that deploys the contract
transaction = SimpleStorage.constructor().buildTransaction(
    {
        "chainId": chain_id,
        "gasPrice": w3.eth.gas_price,
        "from": my_address,
        "nonce": nonce,
    }
)
# Sign the transaction
#signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
print(transaction)
# 3. enviar la transaccion

