pragma solidity ^0.4.24;
import "./TokenERC20.sol";

contract LotteryIncomeWallet {
    address public owner;
    mapping(address => uint256) holderIndexes;
    address[] private stockHolders;
    address drawContract;
    address incomeWallet;
    address tokenERC20Address;
    mapping(address => uint256) public dividentsAvailable;
    mapping(address => mapping(uint256 => uint256)) dividendsFromDraw;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier onlyDraw() {
        require(msg.sender == drawContract, "Only Draw contract can call this");
        _;
    }

    modifier onlyStockHolders() {
        require(msg.sender == drawContract, "Only Stock Holders can call this");
        _;
    }

    function getOwnersList() private returns (address[]) {
        stockHolders = TokenERC20(tokenERC20Address).getOwnerAddressesList();
    }

    function getOwnersListIndex(address _ownerAddress) public returns(uint256) {
        return TokenERC20(tokenERC20Address).ownersIndex[_ownerAddress];
    }

}
