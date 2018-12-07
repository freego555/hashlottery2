pragma solidity ^0.4.24;
import "./TokenERC20.sol";
//import "./Draw.sol";

contract Draw {
    address public owner;
    uint256 public currentDrawId = 0;

    constructor() public {
        owner = msg.sender;
    }

    function initDistributing(address wallet_address, uint256 count) public {
        LotteryIncomeWallet(wallet_address).initDistributing(currentDrawId++, count);
    }
}


contract LotteryIncomeWallet {
    address public owner;
    mapping(address => uint256) holderIndexes;
    address[] public stockHolders;
    address drawContractAddress = address(0);
    address tokenERC20Address = address(0);
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
        drawIncome[Draw(drawContractAddress).currentDrawId()] += msg.value;

    }

    function() payable public {
        trackPayments();
    }

}





/** Other variant */
pragma solidity ^0.4.24;
import "./TokenERC20.sol";
import "./Draw.sol";


contract LotteryIncomeWallet {
    address public owner;
    mapping(address => uint256) holderIndexes;
    address[] public stockHolders;
    address[] public stockHoldersMock;
    uint256 public stockHoldersCount;
    address drawContractAddress = address(0);
    address tokenERC20Address = address(0);
    mapping(address => uint256) public dividentsAvailable; //[owner'sAddress][total_dividends_available]
    mapping(address => mapping(uint256 => uint256)) public dividendsFromDraw; //[owner'sAddress][lottery_id][dividends]
    mapping(uint256 => uint256) public drawIncome; //[lottery_id][total_income_from_this_lottery]
    uint256 public total_persentage; //debugging

    event GotPartStockHolders(uint256 _startIndex, uint256 _count, uint256 lotery_id);

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
        require(dividentsAvailable[msg.sender] > 0, "Only Stock Holders can call this");
        _;
    }

    function setToken(address _tokenAddress) public isTokenSet() {
        tokenERC20Address = _tokenAddress;
    }

    function setDraw(address _drawAddress) public isDrawSet() {
        drawContractAddress = _drawAddress;
    }

    function getOwnersListIndex(address _ownerAddress) public view returns(uint256) {
        return TokenERC20(tokenERC20Address).ownersIndex(_ownerAddress);
    }

    // функция получает часть массива акционеров из Токена-20 и начисляет этой части дивиденды
    function getOwnerAddressesListPart(uint256 _startIndex, uint256 _count, uint256 lotery_id) public {

        if ((_startIndex + _count) <= stockHoldersCount) {
            stockHolders = TokenERC20(tokenERC20Address).getOwnerAddressesList(_startIndex, _startIndex + _count);
            distributeIncome(stockHolders, lotery_id);

            getOwnerAddressesListPart(_startIndex + _count, _count, lotery_id);
        } else {
            stockHolders = TokenERC20(tokenERC20Address).getOwnerAddressesList(_startIndex, stockHoldersCount);
            distributeIncome(stockHolders, lotery_id);
        }
    }

    // данная функция  распределяет прибыль от лотереи, путем определения текущей доли каждого акционера и начисления части прибыли от текущего розыгрыша согласно доле
    function distributeIncome(address[] stockHoldersPart, uint256 lotery_id) public {
        for (uint256 index = 0; index < stockHoldersPart.length; index++) {
            uint256 owned = TokenERC20(tokenERC20Address).getOwnership(stockHoldersPart[index]);
            total_persentage += owned;
            dividendsFromDraw[stockHoldersPart[index]][lotery_id] = owned * drawIncome[lotery_id] / 1000000;
        }
    }

    // Функция, которая запускает рекурсивное получение массива акционеров частями из Токена-20
    function initDistributing(uint256 lotery_id, uint256 count) public  {
        stockHoldersCount = TokenERC20(tokenERC20Address).getOwnerAddressesListLength();
        getOwnerAddressesListPart(1, count, lotery_id);

    }

    function trackPayments() private {
        drawIncome[Draw(drawContractAddress).currentDrawId()] += msg.value;

    }

    function () payable public {
        trackPayments();
    }
}

0x14723a09acff6d2a60dcdf7aa4aff308fddc160c //3
0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db //5997
0x583031d1113ad414f02576bd6afabfb302140225 //14000
0xdd870fa1b7c4700f2bd7f44238821c26f7392148 //16000
0x4aa7f9e01bf8015b9f75db95978209efef1c71da //24000
0x46372a2d0cab03e983137ad289340f79cac18cf0 //40000
