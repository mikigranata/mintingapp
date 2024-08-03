export const mintingFamilyAbi = [
  {
      "inputs": [{ "internalType": "contract IERC20", "name": "_token", "type": "address" }],
      "stateMutability": "nonpayable", "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }],
      "name": "UserRegistered", "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "inviter", "type": "address" }, { "indexed": true, "internalType": "address", "name": "invitee", "type": "address" }],
      "name": "UserInvited", "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "Deposited", "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "TransferFrom", "type": "event"
  },
  {
      "inputs": [],
      "name": "startApp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "_inviter", "type": "address" }],
      "name": "recordInvitation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
      "name": "getRewardForAddress",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "getInviter",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "getReferralCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "getReferrals",
      "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "isRegistered",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "users",
      "outputs": [{ "internalType": "address", "name": "inviter", "type": "address" }, { "internalType": "bool", "name": "registered", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "inviter", "type": "address" }],
      "name": "getInviterEarnings",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
      "name": "deposits",
      "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "withdrawUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "withdrawOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
];

export const erc20Abi = [
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  }
];