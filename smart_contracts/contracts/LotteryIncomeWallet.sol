pragma solidity ^0.4.24;
//import "./MigrationAgent.sol";

contract LotteryIncomeWallet {
    mapping(address => uint256) holderIndexes;
    address[] private stockHolders;
    address drawContract;
    address incomeWallet;
    mapping(address => uint256) public dividentsAvailable;
    mapping(address => mapping(uint256 => uint256)) dividendsFromDraw;

    address public owner; // владелец контракта
    address public draw; // контракт розыгрыша

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier onlyDraw() {
        require(msg.sender == draw, "Only Draw contract can call this");
        _;
    }

    modifier onlyStockHolders() {
        require(msg.sender == draw, "Only Stock Holders can call this");
        _;
    }

}
