pragma solidity ^0.4.24;

import './../TokenERC721.sol';
import './../Draw.sol';



contract Kassa {
}

contract PrizePool {

    address public kassaContractAddress; // контракт кассы
    address public lotteryDrawContractAddress; //контракт розыгрыша

    uint256 public reservedMoney = 0; // зарезервированная часть средств

    address public owner; // владелец контракта
    bool public initComplete = false;

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
        require(initComplete
        , "init not complete"
        );

        (, uint8 drawStage) = Draw(lotteryDrawContractAddress).getStageOfCurrentDraw();
        require(Draw(drawStage == 21 ||  drawStage == 22
        , "Acceptance of applications period isn't end"
        );
        _;
    }

    modifier isKassaContract() {
        require(initComplete
        , "init not complete"
        );
        require(msg.sender == kassaContractAddress
        , "only kassaContract is allowed"
        );
        _;
    }

    modifier isLotteryDrawContract() {
        require(initComplete
        , "init not complete"
        );
        require(msg.sender == lotteryDrawContractAddress
        , "only lotteryDrawContract is allowed"
        );
        _;
    }

    function getPrizePoolBalance() public view returns (uint){
        uint balance = address(this).balance;
        require(balance >= reservedMoney
        , "Prize pool balance is incorrect, please contact the admin"
        );

        return balance - reservedMoney;
    }

    function determineWinners(uint winnersCount) public isKassaContract isAcceptanceOfApplicationsEnd returns (uint){
        if (winnersCount == 0) {
            return 0;
        }

        uint prizePool = this.getPrizePoolBalance();
        reservedMoney += prizePool;
        return prizePool / winnersCount;
    }

    function sendToWinner(address winner, uint value) public isKassaContract {
        require(value > 0
        , "Value must be > 0"
        );
        require(reservedMoney >= value
        , "Reserved money amount is not enough"
        );
        reservedMoney -= value;
        address(winner).transfer(value);
    }

    function setKassaContractAddress(address _address) public onlyOwner {
        require(kassaContractAddress == address(0)
        , "kassaContractAddress is already set"
        );
        kassaContractAddress = _address;
        if (this.isInitComplete()) {
            initComplete = true;
        }
    }

    function setLotteryDrawContractAddress(address _address) public onlyOwner {
        require(lotteryDrawContractAddress == address(0)
        , "lotteryDrawContractAddress is already set"
        );
        lotteryDrawContractAddress = _address;
        if (this.isInitComplete()) {
            initComplete = true;
        }
    }

    function isInitComplete() public view returns (bool) {
        if (initComplete) {
            return true;
        }
        return (lotteryDrawContractAddress != address(0))
        && (kassaContractAddress != address(0));
    }

    function() payable public {

    }
}

