pragma solidity ^0.4.24;
//import "./TokenERC20.sol";

contract TokenERC20 {
    mapping(address => uint256) public ownersIndex;
    function getOwnerAddressesList() public returns (address[]) {}
    function getOwnership(address account) public view returns (uint256 percentageMultiplied100) {}
}

contract Draw {
    uint256 public currentDrawId;
}

contract LotteryIncomeWallet {
    address public owner;
    mapping(address => uint256) holderIndexes;
    address[] public stockHolders;
    address drawContractAddress = address(0);
    address tokenERC20Address = address(0);
    mapping(address => uint256) public dividentsAvailable; //[owner'sAddress][total_dividends_available]
    mapping(address => mapping(uint256 => uint256)) dividendsFromDraw; //[owner'sAddress][lottery_id][dividends]
    mapping(uint256 => uint256) drawDividends; //[lottery_id][total_dividends_from_this_lottery]
    uint256 public curr_lottery_id;

    TokenERC20 tokenERC20Contract;

    constructor(){
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

    function getOwnersList() public {
        stockHolders = tokenERC20Contract.getOwnerAddressesList();
    }

    function getOwnersListIndex(address _ownerAddress) public view returns(uint256) {
        return tokenERC20Contract.ownersIndex(_ownerAddress);
    }

    function initDistributing(uint256 lotery_id) public onlyDraw {
        uint8 fromIndex = 0;
        uint8 countIndex = 100;
        uint8 toIndex = fromIndex + countIndex;
        for (uint8 index = fromIndex; index < toIndex; index++) {
            uint256 owned = TokenERC20(tokenERC20Address).getOwnership(stockHolders[index]);
            uint256 dividendsToGet = owned * drawDividends[curr_lottery_id];
        }
    }

    function trackPayments() private {
        curr_lottery_id = Draw(drawContractAddress).currentDrawId();
    }

    function() payable public {
        trackPayments();
    }

}
