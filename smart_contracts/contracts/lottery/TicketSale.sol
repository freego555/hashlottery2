pragma solidity ^0.4.24;

contract TokenERC721 {

}

contract PrizePool {

}

contract LotteryIncomeWallet {

}

contract Draw {
    function isSellingTicketsPeriodEnd() public returns (bool){}
}

contract TicketSale {

    address public owner; // владелец контракта
    uint public price;

    address public TokenERC721Address; // сам билет
    TokenERC721 public ticketContract;

    address public PrizePoolAddress; // призовой фонд
    address public LotteryIncomeWalletAddress; // кошелек прибыли акционеров

    address public LotteryDrawAddress; //контракт розыгрыша
    Draw public LotteryDrawContract;

    bool public initComplete = false;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier isInitComplete() {
        if (initComplete) {
            _;
        }

        require(TokenERC721Address != address(0)
        , "TokenERC721 contract must be set"
        );

        require(PrizePoolAddress != address(0)
        , "PricePool contract must be set"
        );

        require(LotteryIncomeWalletAddress != address(0)
        , "LotteryIncomeWallet contract must be set"
        );

        require(LotteryDrawAddress != address(0),
            "LotteryDraw contract must be set"
        );
        initComplete = true;
        _;
    }

    function setTicket(address _address) public onlyOwner {
        require(TokenERC721Address == address(0)
        , "TokenERC721 contract has already set"
        );
        TokenERC721Address = _address;
        ticketContract = TokenERC721(_address);
    }

    function setPrizePool(address _address) public onlyOwner {
        require(PrizePoolAddress == address(0)
        , "PricePool contract has already set"
        );
        PrizePoolAddress = _address;
    }

    function setIncomeWallet(address _address) public onlyOwner {
        require(LotteryIncomeWalletAddress == address(0)
        , "LotteryIncomeWallet contract has already set"
        );
        LotteryIncomeWalletAddress = _address;
    }

    function setLotteryDraw(address _address) public onlyOwner {
        require(LotteryDrawAddress == address(0),
            "LotteryDraw contract has already set"
        );
        LotteryDrawAddress = _address;
        LotteryDrawContract = LotteryDraw(_address);
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "New price must be > 0 ");
        price = newPrice;
    }


    function() payable public {
        buy();
    }

    function buy() payable public isInitComplete {
        require(!LotteryDrawContract.isSellingTicketsPeriodEnd()
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

        uint256 actually_wei = token_count * price;
        uint256 wei_change = buyer_wei - actually_wei;

        actually_wei = buyer_wei - wei_change;
        ticketContract.mint(msg.sender, ticket_count);

        uint256 toPrizePool = actually_wei * 9 / 10;
        uint256 toIncome = actually_wei - toPrizePool;

        LotteryIncomeWalletAddress.transfer(toIncome);
        // send 10% income
        PrizePoolAddress.transfer(toPrizePool);
        // send 90% to prizePool

        if (wei_change != 0) {
            msg.sender.transfer(wei_change);
            //send back the change
        }
    }


}

