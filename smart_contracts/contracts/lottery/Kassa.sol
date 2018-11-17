pragma solidity ^0.4.19;

import './../Draw.sol';
import './../PrizePool.sol';
import './TokenERC721.sol';


contract Kassa {

    address public owner; // владелец контракта

    address public prizePoolAddress;
    address public drawAddress;
    address public token712Address;
    
    mapping(address => uint) public winnersMoney;  // winnerAddress => money amount
    mapping(uint => uint) public winnersCount; // drawId => countOfwinners
    mapping(uint => uint) public moneyForEachWinner; // drawId => moneyForEachWinner
    mapping(uint => address[]) public winnersList; // drawId => approvedWinners array список победителей с одобренных заявок на текущем розыгрыше
    mapping(uint => mapping(address => bool)) public isGivenShare; // drawId => [ winner address => bool] начислена ли доля выигрыша текущему победилетю
   
    bool initComplete = false; // закончена инициализация контракта
    
    event RequestAppoved(uint ticketNumber); // заявка одобрена
    
    function Kassa() public {
   // constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner
        //, "Only owner of contract can call this"
        );
        _;
    }
    
      modifier onlyDraw() {
        require(msg.sender == drawAddress
        //, "Only Draw Contract can call this"
        );
        _;
    }

    modifier inited() {
        require(initComplete
        //, "Init is not completed, please contact the admin"
        );
        _;
    }

    function setPrizePoolAddress(address _address) public onlyOwner {
        require(prizePoolAddress == address(0)
        , "prizePoolAddress is already set"
        );
        prizePoolAddress = _address;
        
        checkAndSetInitComplete();
    }
    
    function setDrawAddress(address _address) public onlyOwner {
        require(drawAddress == address(0)
        , "LotteryDraw contract has already set"
        );
        drawAddress = _address;
        
        checkAndSetInitComplete();
    }
    
    function setToken712Address(address _address) public onlyOwner {
        require(token712Address == address(0)
        , "token712Address has already set"
        );
        token712Address = _address;

        checkAndSetInitComplete();
    }

    function checkAndSetInitComplete(){
         if(drawAddress != address(0)
         && token712Address !=  address(0)
         && prizePoolAddress != address(0)
        ){
            initComplete = true;
        }
    }

    function addNewRequest(uint ticketNumber, uint8[] numbers, uint256 salt) public inited{
        require(Draw(drawAddress).isAcceptRequestPeriod()
        , "You add winning request duting this period"
        );
        require(TokenERC721(token712Address).tokenExists(ticketNumber)
        , 'This ticket does not exists'
        )
        require(TokenERC721(token712Address).ownerOf(ticketNumber) == msg.sender
        , 'You are not the owner of this ticket'
        )
        
        (uint ticketDrawId,  bytes32[3] combinationOfTicket, ) = TokenERC721(token712Address).dataOfTicket(ticketNumber);
        require( ticketDrawId == Draw(drawAddress).currentDrawId() 
        , 'This ticket is not from current Draw'
        )
    
        require(numbers.length == 3
        , 'Count of winning numbers must be 3'
        );
        
        for (uint8 index = 0; index < numbers.length; index++) {
            require(combinationOfTicket[index] == keccak256(numbers[index], salt)
            , 'Your numbers does not matсhes saved hash'
            )
        }
        
        winnersCount[ticketDrawId]++; 
        winnersList[ticketDrawId].push(msg.sender);
        
        emit RequestAppoved(ticketNumber);
    }

    function startWithdraws(uint fromIndex, uint count) public inited onlyDraw{
        uint currentDrawId = Draw(drawAddress).currentDrawId();
        uint countOfWinners = winnersCount[currentDrawId];
        if(moneyForEachWinner[currentDrawId]==0){
            moneyForEachWinner[currentDrawId] = PrizePool(prizePoolAddress).determineWinners(countOfWinners);
        }
        for(uint index=fromIndex; index< fromIndex+count; index++){
            // mapping(uint => mapping(address => bool)) public isGivenShare; // drawId => [ winner address => bool] начислена ли доля выигрыша текущему победилетю
            
            if(isGivenShare[currentDrawId]){
              //  winnersList
            }
        }
    }
    
    function withdrawPrize(uint value) public inited{
       uint currentDrawId = Draw(drawAddress).currentDrawId();
    }

    function() payable public {

    }

}

