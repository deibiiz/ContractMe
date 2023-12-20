from brownie import SimpleStorage, accounts, config


def rad_contract():
    simple_storage = SimpleStorage[-1]
    print(simple_storage.retrieve())

def main():
    rad_contract()