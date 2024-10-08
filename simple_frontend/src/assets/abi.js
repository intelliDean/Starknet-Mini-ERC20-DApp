export const ABI = [
  {
    type: "impl",
    name: "Mini",
    interface_name: "mini::MiniTrait",
  },
  {
    type: "interface",
    name: "mini::MiniTrait",
    items: [
      {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [{ type: "core::felt252" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [{ type: "core::felt252" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "balance_of",
        inputs: [
          {
            name: "_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [{ type: "core::integer::u128" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "mint",
        inputs: [
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "amount", type: "core::integer::u128" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "_amount", type: "core::integer::u128" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      { name: "_name", type: "core::felt252" },
      { name: "_symbol", type: "core::felt252" },
      {
        name: "_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "mini::Mini::MintToken",
    kind: "struct",
    members: [
      {
        name: "receiver",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      { name: "amount", type: "core::integer::u128", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "mini::Mini::TransferToken",
    kind: "struct",
    members: [
      {
        name: "sender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "receiver",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      { name: "amount", type: "core::integer::u128", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "mini::Mini::Deployer",
    kind: "struct",
    members: [
      {
        name: "deployer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "mini::Mini::Event",
    kind: "enum",
    variants: [
      {
        name: "MintToken",
        type: "mini::Mini::MintToken",
        kind: "nested",
      },
      {
        name: "TransferToken",
        type: "mini::Mini::TransferToken",
        kind: "nested",
      },
      { name: "Deployer", type: "mini::Mini::Deployer", kind: "nested" },
    ],
  },
];
