pragma solidity ^0.4.19;

import './../Draw.sol';
import './../PrizePool.sol';

contract Kassa {

    address public owner; // владелец контракта

    address public prizePoolAddress;
    address public drawAddress;
    
    mapping(address => uint) public winnersMoney;  // winnerAddress => money amount
    mapping(uint => uint) public winnersCount; // drawId => countOfwinners
    mapping(uint => address[]) public winnersList; // drawId => approvedWinners array список победителей с одобренных заявок на текущем розыгрыше
    mapping(uint => mapping(address => bool)) public isGivenShare; // drawId => [ winner address => bool] начислена ли доля выигрыша текущему победилетю
   
    bool initComplete = false; // закончена инициализация контракта
    
    enum Status { // status of request
        Pending, Approve, Denied
    }
    
    struct Request {
        uint256 drawId;
        address owner;
    //    uint8[3] combinationOfTicket;
        Status status;
    }
    
    mapping(uint => Request) public allRequestsStatus; // ticketId => Request
    
    
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

    modifier inited() {
        require(initComplete
        //, "Init is not completed, please contact the admin"
        );
        _;
    }
 

    function setPrizePoolAddress(address _address) public onlyOwner {
        require(prizePoolAddress == address(0)
      //  , "prizePoolAddress is already set"
        );
        prizePoolAddress = _address;
       // if (this.isInitComplete()) {
    //        initComplete = true;
      //  } 
    }
    
    function setDrawAddress(address _address) public onlyOwner {
        require(drawAddress == address(0)
        , "LotteryDraw contract has already set"
        );
        drawAddress = _address;

        require(lotteryDrawAddress == address(0),
            "LotteryDraw contract has already set"
        );

        drawContract = LotteryDraw(_address);

       // if (this.isInitComplete()) {
    //        initComplete = true;
      //  } 
    }


    function addNewRequest(address ticketAddress, uint8[] numbers, uint256 salt) public inited{
        // is receiving request period
        // ticket exists
        
      //  uint current_draw_id = Draw(drawAdress).currentDrawId;
        // ticket draw_id is the same as current draw_id

        (, uint8 drawStage) = lotteryDrawContract.getStageOfCurrentDraw();
        
        // hash numbers + salt and compare to ticket combinationOfTicket hash
        //keccak256()
        
        
        
    }

   

    function() payable public {

    }

}
