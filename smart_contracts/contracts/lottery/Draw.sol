pragma solidity ^0.4.19;

contract Draw {

    uint currentDrawId = 0; // текущий номер розыгрыша

    address public cronAddress; // контракт кассы

    address public owner; // владелец контракта
    bool public initComplete = false;

    //statuses
    // cron  1, // продажа и заполнение билетов
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

    modifier onlyVacationPeriod() {

        (, uint8 drawStage) = lotteryDrawContract.getStageOfCurrentDraw();

        require(drawStage == 40
        , "Only vacation period is allowed for this action"
        );
        _;
    }

    modifier onlyWaitForDrawPeriod() {

        (, uint8 drawStage) = lotteryDrawContract.getStageOfCurrentDraw();

        require(drawStage == 20
        , "Only 'wait for draw' period is allowed for this action"
        );
        _;
    }

    function setCronAddress(address _address) public onlyOwner {
        require(cronAddress == address(0)
        , "cronAddress is already set"
        );
        cronAddress = _address;
        initComplete = true;
    }

    function getStageOfCurrentDraw() view external returns (uint256 drawId, uint8 drawStage){

        // перерыв между розыгрышами
        // todo: добавить условие что призы розданы по текущемму розыгрышу
        if (startSelling == 0) {
            return (currentDrawId, 3);
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
        // период перерыва 40
        return (currentDrawId, 40);
    }

    //cron 1
    function startSelling() onlyCron onlyVacationPeriod {
        currentDrawId++;
        startSelling = now;
        stopSelling = startSelling + 47 hours;
        stopAcceptingTickets = stopSelling + 1 hours;

        // set others timestamps to 0
        startRequests = 0;

    }

    //cron 2
    function startDraw(uint8[] numbers) onlyCron onlyWaitForDrawPeriod {

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

    }

}
