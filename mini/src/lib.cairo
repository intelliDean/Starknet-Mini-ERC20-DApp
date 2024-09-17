use core::starknet::ContractAddress;

#[starknet::interface]
pub trait MiniTrait<T> {
    fn name(self: @T) -> felt252;

    fn symbol(self: @T) -> felt252;

    fn owner(self: @T) -> ContractAddress;

    fn balance_of(self: @T, _owner: ContractAddress) -> u128;

    fn mint(ref self: T, receiver: ContractAddress, amount: u128);

    fn transfer(ref self: T, receiver: ContractAddress, _amount: u128);
}

#[starknet::contract]
pub mod Mini {
    use core::starknet::{ContractAddress, contract_address_const, get_caller_address};
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess
    };

    #[storage]
    struct Storage {
        owner: ContractAddress,
        balances: Map<ContractAddress, u128>,
        name: felt252,
        symbol: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        MintToken: MintToken,
        TransferToken: TransferToken,
        Deployer: Deployer
    }

    #[derive(Drop, starknet::Event)]
    struct MintToken {
        #[key]
        receiver: ContractAddress,
        amount: u128
    }

    #[derive(Drop, starknet::Event)]
    struct TransferToken {
        #[key]
        sender: ContractAddress,
        #[key]
        receiver: ContractAddress,
        amount: u128
    }

    #[derive(Drop, starknet::Event)]
    struct Deployer {
        #[key]
        deployer: ContractAddress
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, _name: felt252, _symbol: felt252, _owner: ContractAddress
    ) {
        self.name.write(_name);
        self.symbol.write(_symbol);
        self.owner.write(_owner);

        self.emit(Deployer { deployer: _owner });
    }

    #[abi(embed_v0)]
    impl Mini of super::MiniTrait<ContractState> {
        fn name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn symbol(self: @ContractState) -> felt252 {
            self.symbol.read()
        }

        fn owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn balance_of(self: @ContractState, _owner: ContractAddress) -> u128 {
            self.balances.entry(_owner).read()
        }

        fn mint(ref self: ContractState, receiver: ContractAddress, amount: u128) {
            //only owner
            self.only_owner();
            self.address_zero(receiver);

            //this is where the minting is done
            self.balances.entry(receiver).write(self.balances.entry(receiver).read() + amount);

            self.emit(MintToken { receiver: receiver, amount: amount })
        }

        fn transfer(ref self: ContractState, receiver: ContractAddress, _amount: u128) {
            self.address_zero(receiver);

            let caller = get_caller_address();
            let caller_balance = self.balances.entry(caller).read();

            assert(caller_balance >= _amount, 'Insufficient balance');

            self.balances.entry(caller).write(caller_balance - _amount);

            self.balances.entry(receiver).write(self.balances.entry(receiver).read() + _amount);

            self.emit(TransferToken { sender: caller, receiver: receiver, amount: _amount });
        }
    }


    #[generate_trait]
    impl PrivateMethods of PrivateMethodsTrait {
        fn only_owner(self: @ContractState) {
            assert(get_caller_address() == self.owner.read(), 'Caller is not the owner');
        }

        fn address_zero(self: @ContractState, receiver: ContractAddress) {
            assert(receiver != contract_address_const::<0>(), 'Address zero not allowed');
        }
    }
}
