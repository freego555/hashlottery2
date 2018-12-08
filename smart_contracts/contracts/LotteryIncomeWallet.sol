pragma solidity ^0.4.24;
import "./TokenERC20.sol";
//import "./Draw.sol";

interface Draw {
    function currentDrawId() external view returns(uint256 _drawId);
    /*address public owner;
    uint256 public currentDrawId = 0;

    constructor() public {
        owner = msg.sender;
    }

    function initDistributing(address wallet_address) public {
        LotteryIncomeWallet(wallet_address).initDistributing(currentDrawId++);
    }*/
}


contract LotteryIncomeWallet {
    address public owner;
    mapping(address => uint256) holderIndexes;
    address[] public stockHolders;
    address public drawContractAddress = address(0);
    address public tokenERC20Address = address(0);
    mapping(address => uint256) public dividentsAvailable; //[owner'sAddress][total_dividends_available]
    mapping(address => mapping(uint256 => uint256)) public dividendsFromDraw; //[owner'sAddress][lottery_id][dividends]
    mapping(uint256 => uint256) public drawIncome; //[lottery_id][total_income_from_this_lottery]
    uint256 public total_persentage; //debugging

    constructor() public {
        owner = msg.sender;
    }

    modifier isTokenSet() {
        require(tokenERC20Address == address(0), "TokenERC20 Contract Address already set");
        _;
    }

    modifier isDrawSet() {
        require(drawContractAddress == address(0), "Draw Contract Address already set");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier onlyDraw() {
        require(msg.sender == drawContractAddress, "Only Draw contract can call this");
        _;
    }

    modifier onlyStockHolders() {
        require(msg.sender == drawContractAddress, "Only Stock Holders can call this");
        _;
    }

    function setToken(address _tokenAddress) public isTokenSet() {
        tokenERC20Address = _tokenAddress;
    }

    function setDraw(address _drawAddress) public isDrawSet() {
        drawContractAddress = _drawAddress;
    }

    // функция вызывается из initDistributing только при триггере ее кроном или контрактом розыгрыша
    function getOwnersList() internal {
        stockHolders = TokenERC20(tokenERC20Address).getOwnerAddressesList();
    }

    function getOwnersListIndex(address _ownerAddress) public view returns(uint256) {
        return TokenERC20(tokenERC20Address).ownersIndex(_ownerAddress);
    }

    // данная функция распределяет прибыль от лотереи
    function initDistributing(uint256 lotery_id) public onlyDraw {
        getOwnersList();
        total_persentage = 0;
        uint8 fromIndex = 0;
        uint8 countIndex = 100;
        uint256 toIndex = stockHolders.length; //fromIndex + countIndex;
        for (uint8 index = fromIndex; index < toIndex; index++) {
            uint256 owned = TokenERC20(tokenERC20Address).getOwnership(stockHolders[index]);
            total_persentage += owned;
            dividendsFromDraw[stockHolders[index]][lotery_id] = owned * drawIncome[lotery_id] / 1000000;
        }

    }

    function trackPayments() private {
        /*Draw contractDraw = Draw(drawContractAddress);
        uint256 tempField = contractDraw.currentDrawId();
        drawIncome[0] = 1;*/
        drawIncome[Draw(drawContractAddress).currentDrawId()] += msg.value;

    }

    function() payable public {
        //trackPayments();
    }

}
