pragma solidity ^0.4.25;

contract LotteryDraw{
    function isAcceptanceOfApplicationsEnd() public returns(bool){}
}

contract Kassa{
}

contract PrizePool {
    
    address public kassaContractAddress;
    address public lotteryDrawContractAddress;
   
    uint256 public reservedMoney = 0; // зарезервированная часть средств
    uint256 public fixPrizeAmount = 0; // объем текущего призового фонда
  
    address public owner; // владелец контракта
  
   constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner
        , "Only owner of contract can call this"
        );
        _;
    }

    modifier isAcceptanceOfApplicationsEnd() {
        require(LotteryDraw(lotteryDrawContractAddress).isAcceptanceOfApplicationsEnd()
        , "Acceptance of applications period isn't end"
        );
        _;
    }
    
    modifier isKassaContract() {
        require(kassaContractAddress != address(0) 
        , "kassaContractAddress is not set"
        );
        require(msg.sender == kassaContractAddress
        , "only kassaContract is allowed"
        );
        _;
    }

    modifier isLotteryDrawContract() {
        require(lotteryDrawContractAddress != address(0)
        , "lotteryDrawContractAddress is not set"
        );
        require(msg.sender == lotteryDrawContractAddress
        , "only lotteryDrawContract is allowed"
        );
        _;
    }
    
    function lotterySellingPeriodEnds() public isLotteryDrawContract returns(uint){
        require(fixPrizeAmount == 0 
        , "fixPrizeAmount must be 0"
        );
        fixPrizeAmount = address(this).balance;
        return fixPrizeAmount;
    }
    
    function determineWinners(uint winnersCount) public isKassaContract isAcceptanceOfApplicationsEnd returns(uint){
        require(fixPrizeAmount > 0
        , 'Fixed Prize Amount must be > 0'
        );
        if(winnersCount == 0){
            return 0;
        }
        reservedMoney += fixPrizeAmount;
        fixPrizeAmount = 0;
        return fixPrizeAmount/winnersCount;
    }
    
    function sendToWinner(address winner, uint value) public isKassaContract{
        require(winner != address(0) 
        , "winner address is not correct"
        );
        require(value > 0 
        , "Value must be > 0"
        );
        require(reservedMoney >= value 
        , "Reserved money amount is not enough"
        );
        reservedMoney-=value;
        address(winner).transfer(value);
    }
    
    function setKassaContractAddressAddress(address _kassaContractAddress) public onlyOwner {
        require(kassaContractAddress == address(0) 
        , "kassaContractAddress is already set"
        );
        kassaContractAddress = _kassaContractAddress;
    }
    
    function setLotteryDrawContractAddress(address _lotteryDrawContractAddress) public onlyOwner {
        require(lotteryDrawContractAddress == address(0) 
        , "lotteryDrawContractAddress is already set"
        );
        lotteryDrawContractAddress = _lotteryDrawContractAddress;
    }

    function() payable public {

    }
}