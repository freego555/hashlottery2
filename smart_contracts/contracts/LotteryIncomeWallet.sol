pragma solidity ^0.4.24;
import "./TokenERC20.sol";
import "./Draw.sol";

contract LotteryIncomeWallet {
    address public owner;
    address[] public stockHolders;
    uint256 public stockHoldersCount;
    address public drawContractAddress = address(0);
    address public tokenERC20Address = address(0);
    mapping(address => uint256) public dividentsAvailable; //[owner'sAddress][total_dividends_available]
    mapping(address => mapping(uint256 => uint256)) public dividendsFromDraw; //[owner'sAddress][lottery_id][dividends]
    mapping(uint256 => uint256) public drawIncome; //[lottery_id][total_income_from_this_lottery]

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

    modifier onlyDraw() {
        require(msg.sender == drawContractAddress, "Only Draw contract can call this");
        _;
    }

    modifier onlyStockHolders() {
        require(dividentsAvailable[msg.sender] > 0, "You do not have any funds to withdraw");
        _;
    }

    function setToken(address _tokenAddress) public isTokenSet() {
        tokenERC20Address = _tokenAddress;
    }

    function setDraw(address _drawAddress) public isDrawSet() {
        drawContractAddress = _drawAddress;
    }

    // Возможно, данную функцию можно будет удалить
    function getOwnersListIndex(address _ownerAddress) public view returns(uint256) {
        return TokenERC20(tokenERC20Address).ownersIndex(_ownerAddress);
    }

    // функция получает часть массива акционеров из Токена-20 и начисляет этой части дивиденды
    function getOwnerAddressesListPart(uint256 _startIndex, uint256 _count, uint256 lottery_id) private {

        if ((_startIndex + _count) <= stockHoldersCount) {
            stockHolders = TokenERC20(tokenERC20Address).getOwnerAddressesList(_startIndex, _startIndex + _count);
            distributeIncome(stockHolders, lottery_id);

            getOwnerAddressesListPart(_startIndex + _count, _count, lottery_id);
        } else {
            stockHolders = TokenERC20(tokenERC20Address).getOwnerAddressesList(_startIndex, stockHoldersCount);
            distributeIncome(stockHolders, lottery_id);
        }
    }

    // данная функция  распределяет прибыль от лотереи, путем определения текущей доли каждого акционера и начисления части прибыли от текущего розыгрыша согласно доле
    function distributeIncome(address[] stockHoldersPart, uint256 lottery_id) private {
        for (uint256 index = 0; index < stockHoldersPart.length; index++) {
            uint256 owned = TokenERC20(tokenERC20Address).getOwnership(stockHoldersPart[index]);
            dividendsFromDraw[stockHoldersPart[index]][lottery_id] = owned * drawIncome[lottery_id] / 1000000;
            dividentsAvailable[stockHoldersPart[index]] += owned * drawIncome[lottery_id] / 1000000;
        }
    }

    // Функция, которая запускает рекурсивное получение массива акционеров частями из Токена-20
    function initDistributing(uint256 lottery_id, uint256 count) external onlyDraw() {
        stockHoldersCount = TokenERC20(tokenERC20Address).getOwnerAddressesListLength();
        getOwnerAddressesListPart(1, count, lottery_id);

    }

    function trackPayments() private {
        drawIncome[Draw(drawContractAddress).currentDrawId()] += msg.value;
    }

    function () payable public {
        trackPayments();
    }

    function withdraw(uint256 _amount) public onlyStockHolders() {
        require(dividentsAvailable[msg.sender] >= _amount, "You are trying to withdraw more amount than you have");
        dividentsAvailable[msg.sender] -= _amount;
        msg.sender.transfer(_amount);
    }
}

// 0x14723a09acff6d2a60dcdf7aa4aff308fddc160c //3
// 0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db //5997
// 0x583031d1113ad414f02576bd6afabfb302140225 //14000
// 0xdd870fa1b7c4700f2bd7f44238821c26f7392148 //16000
// 0x444da60c250902a02d84f142e3cd4f02e211f205 //24000
// 0x0dd6598d99dd5001a91464aab53730396c128496 //40000