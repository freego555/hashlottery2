pragma solidity ^0.4.24;

contract TicketSalerContract{
    
    function isLotteryEnd(){}
}

contract PrizePool {
    
    public address ContractAddress;
    uint owner;
    
    function PrizePool() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier isLotteryEnd() {
        require(TicketSalerContract(salerContractAddress).isLotteryEnd(), "Lottery isn't end");
        _;
    }
    
    modifier isSalerContract() {
        require(salerContractAddress != address(0) , "salerContractAddress is not set");
        require(msg.sender == salerContractAddress, "only TicketSalerContract allowed");
        _;
    }

    
    // Must isIcoEnd => true && isIcoFail => true
    // Call from Crowdsale.sol
    function sendToWinner(address _winner, uint value) public isLotteryEnd() isSalerContract(){
        // todo check if reserver amount < value
        // amount > 0
        address(_investor).transfer(value);
    }
    
   
    // Call from terminal
    function setTicketSalerContractAddress(address _ticketSalerContract) public onlyOwner() {
        require(salerContractAddress == address(0) , "salerContractAddress is already set");
        salerContractAddress = _ticketSalerContract;
    }

    function() payable public {

    }
}