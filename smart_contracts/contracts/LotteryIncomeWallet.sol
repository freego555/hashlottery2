pragma solidity ^0.4.24;
//import "./MigrationAgent.sol";

contract LotteryIncomeWallet {
    mapping(uint256 => bool)  isDrawFinished;
    address[] private stockHolders;
    mapping(address => uint256) public dividentsAvailable;
    mapping(address => mapping(uint256 => uint256)) dividendsFromDraw;



    constructor(){

    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier onlyDraw() {
        require(msg.sender == draw, "Only Draw contract can call this");
        _;
    }

    modifier only() {
        require(msg.sender == draw, "Only Draw contract can call this");
        _;
    }

    modifier isDrawOver() {
        require(Crowdsale(crowdSaleContract).isIcoEnd() == status, "ICO isn't end");
        _;
    }


}
