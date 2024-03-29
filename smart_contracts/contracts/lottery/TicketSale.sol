pragma solidity ^0.4.24;

interface IDraw {
    function isSellingTicketPeriod() external view returns (bool);
}

interface TokenERC721 {
    function mint(address _owner, uint256 _amountOfTokens) external;
}

contract TicketSale {

    address public owner; // владелец контракта
    uint public price;

    address public tokenERC721Address; // сам билет
    TokenERC721 public ticketContract;

    address public prizePoolAddress; // призовой фонд
    address public lotteryIncomeWalletAddress; // кошелек прибыли акционеров

    address public lotteryDrawAddress; //контракт розыгрыша
    IDraw public lotteryDrawContract;

    bool public initComplete = false;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier isInitComplete() {

        require(tokenERC721Address != address(0)
        , "TokenERC721 contract must be set"
        );

        require(prizePoolAddress != address(0)
        , "PricePool contract must be set"
        );

        require(lotteryIncomeWalletAddress != address(0)
        , "LotteryIncomeWallet contract must be set"
        );

        require(lotteryDrawAddress != address(0),
            "LotteryDraw contract must be set"
        );

        _;
    }

    function setInitIfComplete() public isInitComplete{
        initComplete = true;
    }

    function setTicket(address _address) public onlyOwner {
        require(tokenERC721Address == address(0)
        , "TokenERC721 contract has already set"
        );
        tokenERC721Address = _address;
        ticketContract = TokenERC721(_address);
    }

    function setPrizePool(address _address) public onlyOwner {
        require(prizePoolAddress == address(0)
        , "PricePool contract has already set"
        );
        prizePoolAddress = _address;
    }

    function setIncomeWallet(address _address) public onlyOwner {
        require(lotteryIncomeWalletAddress == address(0)
        , "LotteryIncomeWallet contract has already set"
        );
        lotteryIncomeWalletAddress = _address;
    }

    function setLotteryDraw(address _address) public onlyOwner {
        require(lotteryDrawAddress == address(0),
            "LotteryDraw contract has already set"
        );
        lotteryDrawAddress = _address;
        lotteryDrawContract = IDraw(_address);
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "New price must be > 0 ");

        require(lotteryDrawAddress != address(0),
            "LotteryDraw contract is not init yet"
        );

        require(!lotteryDrawContract.isSellingTicketPeriod()
        , "You can't set new ticket price during selling period"
        );

        price = newPrice;
    }


    function() payable public {
        buy();
    }

    function buy() payable public isInitComplete {

        require(lotteryDrawContract.isSellingTicketPeriod()
        , "You can't buy tickets because selling period is ended"
        );
        // период продажи билетов
        require(msg.value > 0
        , "You cant invest because value is 0"
        );
        // Отримані кошти?


        uint256 buyer_wei = msg.value;
        uint256 ticket_count = buyer_wei / price;
        // Порахована кількість токенів
        require(ticket_count > 0
        , "You can't buy because wei_amount less than price of one ticket"
        );

        uint256 actually_wei = ticket_count * price;
        uint256 wei_change = buyer_wei - actually_wei;

        ticketContract.mint(msg.sender, ticket_count);

        uint256 toIncome = actually_wei / 10;
        uint256 toPrizePool = actually_wei - toIncome;

        lotteryIncomeWalletAddress.transfer(toIncome);
        // send 10% income
        prizePoolAddress.transfer(toPrizePool);
        // send 90% to prizePool

        if (wei_change != 0) {
            msg.sender.transfer(wei_change);
            //send back the change
        }
    }


}

