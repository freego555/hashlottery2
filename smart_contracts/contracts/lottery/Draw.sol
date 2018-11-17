pragma solidity ^0.4.19;

import './Kassa.sol';

contract Draw {

    uint currentDrawId = 0; // текущий номер розыгрыша

    address public cronAddress; // контракт крона
    address public kassaAddress; // контракт кассы

    address public owner; // владелец контракта
    bool public initComplete = false;

    //statuses
    // cron  1, // продажа и заполнение билетов
    //         10 // ждем крон 1 для начала продаж
    //         11, //- продажа билетов 47 часов
    //         12, // дозаполнение билетов, продавать уже нельзя, акции перемещать нельзя
    // cron  2, // розыгрыш
    //         20, // ждем cron для розыгрыша
    //         21, // начали прием заявок, акции перемещать нельзя
    //         22, // продолжение приема заявок
    // cron 3 - перерыв
    //         30, // ждем cron для подведения итогов и подсета победителей
    //         40 // перерыв
    //
    uint public startSelling; // таймштамп начала продаж
    uint public stopSelling; // таймштамп конца продаж
    uint public stopAcceptingTickets; // таймштамп конца продаж

    uint public startRequests; // начало приема заявок на выигрыш
    uint public stopBlockingTokens; // конец блокировки токенов для инвесторов // startRequests+1h
    uint public stopRequests;  // конец приема заявок на выигрыш

    uint public startVacation; // начало перевыва
    uint public stopVacation;  // конец перевыва
        
    mapping(uint => uint8[]) public winnersNumbers; // drawId => numbers array список выиграшных номеров

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner
        , "Only owner of contract can call this"
        );
        _;
    }

    modifier onlyCron() {
        require(initComplete
        , "init not complete"
        );
        require(msg.sender == cronAddress
        , "Only owner of contract can call this"
        );
        _;
    }
    
     modifier onlyCron() {
        require(initComplete
        , "init not complete"
        );
        require(msg.sender == cronAddress
        , "Only owner of contract can call this"
        );
        _;
    }

    modifier onlyWaitCron1() {
        (, uint8 drawStage) = lotteryDrawContract.getStageOfCurrentDraw();

        require(drawStage == 10
        , "Only 'onlyWaitCron1' period is allowed for this action"
        );
        _;
    }

    modifier onlyWaitCron2() {
        (, uint8 drawStage) = lotteryDrawContract.getStageOfCurrentDraw();

        require(drawStage == 20
        , "Only 'onlyWaitCron2' period is allowed for this action"
        );
        _;
    }
    
    modifier onlyWaitCron3() {
        (, uint8 drawStage) = lotteryDrawContract.getStageOfCurrentDraw();

        require(drawStage == 30
        , "Only 'wait for withdraw' period is allowed for this action"
        );
        _;
    }

    function setCronAddress(address _address) public onlyOwner {
        require(cronAddress == address(0)
        , "cronAddress is already set"
        );
        cronAddress = _address;
        
        if(kassaAddress!== address(0)){
            initComplete = true;
        }
    }

    function setKassaAddress(address _address) public onlyOwner {
        require(kassaAddress == address(0)
        , "kassaAddress is already set"
        );
        kassaAddress = _address;
        
        if(cronAddress!== address(0)){
            initComplete = true;
        }
    }
    
    function calcVacationPeriod() public view return(uint vacationPeriod){
        // посчитаем период ожидания крона#1
        uint period10 = 0;
        if(stoptVacation != 0){
             uint period10 = stoptVacation - startSelling;
        }
        // посчитаем период ожидания крона#2
        uint period20 = startRequests - stopAcceptingTickets;
        // посчитаем период ожидания крона#3
        uint period30 = startVacation - stopRequests;
         
        uint fix = (period10 + period20 + period30) % 24 hours;
        uint vacationPeriod = 24 hours
        if(fix>0){
            vacationPeriod-=fix;
        }
        returns vacationPeriod;
    }

    function getStageOfCurrentDraw() view external returns (uint256 drawId, uint8 drawStage){
        // todo: узнать по поводу now и возможно вынести его в переменную
        
        // первая лотерея
        if (startSelling == 0 ){
            return (currentDrawId, 10);
        }

        require(startSelling > 0
        , 'startSelling period is not init'
        );

        // период продаж и заявок 11-12
        if (now >= startSelling
        && now <= stopAcceptingTickets) {

            if (now < stopSelling) {
                drawStage = 11;
            } else {
                // акции перемещать нельзя
                drawStage = 12;
            }

            return (currentDrawId, drawStage);
        }

        // период ожидания крона#2 20
        if (startRequests == 0) {
            return (currentDrawId, 20);
        }

        // период обработки заявок 21-22
        if (now >= startRequests
        && now <= stopRequests) {
            // начали прием заявок, акции перемещать нельзя
            if (now < stopBlockingTokens) {
                drawStage = 21;
            } else {
                // продолжение приема заявок
                drawStage = 22;
            }
            return (currentDrawId, drawStage);
        }

        // период ожидания крона#3 30
        if (startVacation == 0) {
            return (currentDrawId, 30);
        }
        
        // todo: добавить условие что призы розданы по текущемму розыгрышу и только тогда начинается отпуск
    
        // период перерыва 40
           if (now >= startVacation
        && now <= stopVacation) {
            return (currentDrawId, 40);
        }
      
        // wait for new draw
        return (currentDrawId, 10);
    }

    //cron 1
    function startSelling() public onlyCron onlyWaitCron1 {
        currentDrawId++;
        startSelling = now;
        stopSelling = startSelling + 47 hours;
        stopAcceptingTickets = stopSelling + 1 hours;

        // set others timestamps to 0
        startRequests = 0;
    }

    //cron 2
    function startDraw(uint8[] numbers) public onlyCron onlyWaitCron2 {

        require(numbers.length == 3
        , 'Count of winning numbers must be 3'
        );

        require(winnersNumbers[currentDrawId].length == 0
        , 'Numbers for current draw already set, please contact the admin'
        );

        startRequests = now;
        stopRequests = startRequests + 24 hours;
        stopBlockingTokens = startRequests + 1 hours;

        winnersNumbers[currentDrawId] = numbers;
      
       // set others timestamps to 0
        startVacation = 0;

    }
    
    // cron 3
    function startWithdraws() public onlyCronOrKassa onlyWaitCron3 {
        
        startVacation = now;
        stopVacation = startVacation + calcVacationPeriod();
        
        // вызвать кассу на начало раздачи выиграша
        Kassa(kassaAddress).startWithdraws();
    }
    

}

