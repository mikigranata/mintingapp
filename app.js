let web3;
let accounts;
let provider;
let web3Modal;
let mintingFamilyContract;
let lastRewardCheckTime = 0;

const mintingFamilyAbi = [
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

const erc20Abi = [
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

const mintingFamilyAddress = '0x9f39c9D414D81c8Be38e4e60815fD90d8c954F7a';
const usdtAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
const polygonMainnetChainId = '0x56'; // Chain ID for Polygon Mainnet

window.addEventListener('load', async () => {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider.default,
            options: {
                rpc: {
                    1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
                    3: "https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID",
                },
                chainId: 1
            }
        },
        phantom: {
            package: true
        },
    };

    web3Modal = new Web3Modal.default({
        cacheProvider: true,
        providerOptions,
    });

    if (web3Modal.cachedProvider) {
        await connectWallet();
    }
});

async function connectWallet() {
    try {
        provider = await web3Modal.connect();

        provider.on("accountsChanged", (newAccounts) => {
            handleAccountsChanged(newAccounts);
        });

        provider.on("chainChanged", (chainId) => {
            console.log("chainChanged", chainId);
            if (chainId !== polygonMainnetChainId) {
                switchNetwork();
            }
        });

        provider.on("disconnect", (code, reason) => {
            console.log("disconnect", code, reason);
            disconnectWallet();
        });

        web3 = new Web3(provider);
        accounts = await web3.eth.getAccounts();
        mintingFamilyContract = new web3.eth.Contract(mintingFamilyAbi, mintingFamilyAddress);

        const chainId = await web3.eth.getChainId();
        if (chainId !== parseInt(polygonMainnetChainId, 16)) {
            await switchNetwork();
        }

        document.getElementById('connect-button').style.display = 'none';
        document.getElementById('wallet-info').style.display = 'block';
        document.getElementById('address').innerText = accounts[0];

        updateUserInfo(accounts[0]);
    } catch (err) {
        console.log(err);
    }
}

async function switchNetwork() {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: polygonMainnetChainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: polygonMainnetChainId,
                        chainName: 'Polygon Mainnet',
                        rpcUrls: ['https://polygon-rpc.com/'],
                        nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                        },
                        blockExplorerUrls: ['https://polygonscan.com/']
                    }],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
    }
}

function handleAccountsChanged(newAccounts) {
    if (newAccounts.length === 0) {
        disconnectWallet();
    } else {
        accounts = newAccounts;
        document.getElementById('address').innerText = accounts[0];
        updateUserInfo(accounts[0]);
    }
}

async function updateUserInfo(userAddress) {
    try {
        const isRegistered = await mintingFamilyContract.methods.isRegistered(userAddress).call();
        if (!isRegistered) {
            document.getElementById('start-app').style.display = 'block';
            document.getElementById('father-section').style.display = 'none';
            document.getElementById('minting-section').style.display = 'none';
            document.getElementById('withdraw-section').style.display = 'none';
        } else {
            const userInfo = await mintingFamilyContract.methods.users(userAddress).call();
            const inviterAddress = userInfo.inviter;
            document.getElementById('father-address').innerText = inviterAddress !== "0x0000000000000000000000000000000000000000" ? inviterAddress : "No inviter";
            const referralCount = await mintingFamilyContract.methods.getReferralCount(userAddress).call();
            document.getElementById('referral-count').innerText = referralCount;

            let networkGain = await mintingFamilyContract.methods.getInviterEarnings(userAddress).call();
            networkGain = (parseInt(networkGain) / 1e18).toFixed(2);
            document.getElementById('network-gain').innerText = networkGain;

            const deposit = await mintingFamilyContract.methods.deposits(userAddress).call();
            const depositAmount = BigInt(parseInt(deposit.amount));
            if (depositAmount > 0n) {
                const depositAmountNumber = ((Number(depositAmount) / 0.4) - ((Number(depositAmount) / 0.4) * 0.1)) / 1e18;
                document.getElementById('deposit-amount').innerText = depositAmountNumber.toFixed(2);
                document.getElementById('minting-input').style.display = 'none';
                document.getElementById('minting-button').style.display = 'none';
                document.getElementById('deposit-display').style.display = 'block';
            } else {
                document.getElementById('minting-input').style.display = 'block';
                document.getElementById('minting-button').style.display = 'block';
                document.getElementById('deposit-display').style.display = 'none';
            }

            document.getElementById('start-app').style.display = 'none';
            document.getElementById('father-section').style.display = inviterAddress === "0x0000000000000000000000000000000000000000" ? 'block' : 'none';
            document.getElementById('minting-section').style.display = inviterAddress !== "0x0000000000000000000000000000000000000000" ? 'block' : 'none';
            document.getElementById('withdraw-section').style.display = 'block';

            let reward = await mintingFamilyContract.methods.getRewardForAddress(userAddress).call();
            reward = (parseInt(reward) / 1e18).toFixed(5);
            document.getElementById('reward-amount').innerText = reward;

            const withdrawButton = document.getElementById('withdraw-button');
            if (reward > 100 && referralCount >= 3) {
                withdrawButton.style.display = 'block';
                withdrawButton.classList.add('active');
            } else {
                withdrawButton.style.display = 'none';
                withdrawButton.classList.remove('active');
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function disconnectWallet() {
    if (provider && provider.disconnect) {
        await provider.disconnect();
    }
    if (web3Modal) {
        web3Modal.clearCachedProvider();
    }
    provider = null;
    web3 = null;
    accounts = null;
    mintingFamilyContract = null;

    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('wallet-info').style.display = 'none';
    document.getElementById('start-app').style.display = 'none';
    document.getElementById('father-section').style.display = 'none';
    document.getElementById('minting-section').style.display = 'none';
    document.getElementById('withdraw-section').style.display = 'none';
}

async function startApp() {
    try {
        await mintingFamilyContract.methods.startApp().send({ from: accounts[0] });
        document.getElementById('status-message').innerText = 'App started successfully';
        updateUserInfo(accounts[0]);
    } catch (err) {
        document.getElementById('status-message').innerText = 'Error starting the app';
        console.log(err);
    }
}

async function sendInvitation() {
    const inviterAddress = document.getElementById('inviter-address').value;
    try {
        await mintingFamilyContract.methods.recordInvitation(inviterAddress).send({ from: accounts[0] });
        document.getElementById('status-message').innerText = 'Invitation recorded successfully';
        updateUserInfo(accounts[0]);
    } catch (err) {
        document.getElementById('status-message').innerText = 'Error recording invitation';
        console.log(err);
    }
}

async function approveAndMint() {
    let mintingAmount = document.getElementById('minting-amount').value;
    mintingAmount = BigInt(parseInt(mintingAmount) * 1e18)
    if (mintingAmount <= 0) {
        document.getElementById('status-message').innerText = 'Minting amount must be greater than zero';
        return;
    }

    try {
        const tokenContract = new web3.eth.Contract(erc20Abi, usdtAddress);

        await tokenContract.methods.approve(mintingFamilyAddress, '9999999999999999999999999999999999999999').send({ from: accounts[0] });

        await mintingFamilyContract.methods.deposit(mintingAmount).send({ from: accounts[0] });

        document.getElementById('status-message').innerText = 'Minting started successfully';
        updateUserInfo(accounts[0]);
    } catch (err) {
        document.getElementById('status-message').innerText = 'Error during minting';
        console.log(err);
    }
}

async function checkReward() {
    const now = Math.floor(Date.now() / 1000);
    if (now - lastRewardCheckTime < 30) {
        document.getElementById('status-message').innerText = 'move slower boy';
        return;
    }

    try {
        let reward = await mintingFamilyContract.methods.getRewardForAddress(accounts[0]).call();
        reward = (parseInt(reward) / 1e18).toFixed(5);
        document.getElementById('reward-amount').innerText = reward;
        lastRewardCheckTime = now;
    } catch (err) {
        document.getElementById('status-message').innerText = 'move slower boy';
        console.log(err);
    }
}

async function withdrawReward() {
    try {
        await mintingFamilyContract.methods.withdrawUser().send({ from: accounts[0] });
        document.getElementById('status-message').innerText = 'Reward withdrawn successfully';
        updateUserInfo(accounts[0]);
    } catch (err) {
        document.getElementById('status-message').innerText = 'Error withdrawing reward';
        console.log(err);
    }
}
