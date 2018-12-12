pragma solidity ^0.4.24;

import './Draw.sol';
import './PrizePool.sol';
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
    mapping(uint => mapping(address => bool)) public winnersListExists; // drawId => [ winner address => bool] существет ли такой победитель в этом выиграше
    mapping(uint => mapping(address => uint)) public winnersListIndex; // drawId => [ winner address => uint] index of winner in the array
    mapping(uint => mapping(address => bool)) public isGivenShare; // drawId => [ winner address => bool] начислена ли доля выигрыша текущему победилетю
    mapping(uint => bool) public fullyDistributedPrize; // draw Id => completed prize distribution
    mapping(uint => uint) public prizeDistributionProgress; // draw Id => count of winners with gives share

    mapping(uint => uint) public poolSizes; // drawId => poolsize  - размер выигрыша на текущем розыгрыше
   
    bool public initComplete = false; // закончена инициализация контракта

    event RequestApproved(uint ticketNumber); // заявка одобрена
    event DistributionOfWithdraws(uint indexed currentDrawId, uint fromIndex, uint count, bool needMoreShoot); // распределена часть розыгрыша
    event TransferredPrize(address indexed winner, uint moneyValue); // перевод выигрыша
    event TicketPaid(uint ticketNumber); // перевод выигрыша для конкретного билета

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner
        , "Only owner of contract can call this"
        );
        _;
    }

    modifier onlyDraw() {
        require(msg.sender == drawAddress
        , "Only Draw Contract can call this"
        );
        _;
    }

    modifier inited() {
        require(initComplete
        , "Init is not completed, please contact the admin"
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

    function checkAndSetInitComplete() public {
        if (drawAddress != address(0)
        && token712Address != address(0)
        && prizePoolAddress != address(0)
        ) {
            initComplete = true;
        }
    }

    function addNewRequest(uint ticketNumber, uint8[] numbers, uint256 salt) public inited {
        require(Draw(drawAddress).isAcceptRequestPeriod()
        , "You add winning request during this period"
        );
        require(TokenERC721(token712Address).tokenExists(ticketNumber)
        , 'This ticket does not exists'
        );
        require(TokenERC721(token712Address).ownerOf(ticketNumber) == msg.sender
        , 'You are not the owner of this ticket'
        );


        uint ticketDrawId = TokenERC721(token712Address).getTicketDrawId(ticketNumber);
        bytes32[3] memory combinationOfTicket = TokenERC721(token712Address).getTicketCombination(ticketNumber);

        require(ticketDrawId == Draw(drawAddress).currentDrawId()
        , 'This ticket is not from current Draw'
        );

        require(numbers.length == 3
        , 'Count of winning numbers must be 3'
        );

        for (uint i = 0; i <= numbers.length - 1; i++) {
            require(1 <= numbers[1] && numbers[1] <= 99
            , 'Numbers must be in 1..99 range'
            );
        }

        require(numbers[0] < numbers[1] && numbers[1] < numbers[2]
        , 'Numbers must be sorted ASC'
        );

        for (uint8 index = 0; index < numbers.length; index++) {
            require(combinationOfTicket[index] == hashVal(numbers[index], salt)
            , 'Your numbers does not matches saved hash'
            );
        }

        uint currentDrawId = Draw(drawAddress).currentDrawId();
        uint8[] memory winning = Draw(drawAddress).getWinnersNumbers(currentDrawId);
        require(winning[0] == numbers[0] && winning[1] == numbers[1] && winning[2] == numbers[2]
        , 'Your numbers does not matches winning numbers'
        );

        winnersList[ticketDrawId].push(msg.sender);
        winnersListExists[ticketDrawId][msg.sender] = true;
        winnersListIndex[ticketDrawId][msg.sender] = winnersCount[ticketDrawId];
        winnersCount[ticketDrawId]++;

        TokenERC721(token712Address).setTicketStatusWinning(ticketNumber);

        emit RequestApproved(ticketNumber);
    }

    // начать распределять выигрыш между победителями // cron > draw > kassa
    function startWithdraws(uint fromIndex, uint count) public inited onlyDraw {
        uint currentDrawId = Draw(drawAddress).currentDrawId();
        require(!fullyDistributedPrize[currentDrawId]
        , 'The prize pool of this draw is already fully distributed'
        );

        uint countOfWinners = winnersCount[currentDrawId];
        if (moneyForEachWinner[currentDrawId] == 0) {
            // узнать размер выигрыша одного победителя
            moneyForEachWinner[currentDrawId] = PrizePool(prizePoolAddress).determineWinners(countOfWinners);
            poolSizes[currentDrawId] = PrizePool(prizePoolAddress).prizePool();
        }
        if (countOfWinners == 0) {
            // нет победителей
            fullyDistributedPrize[currentDrawId] = true;
            emit DistributionOfWithdraws(currentDrawId, fromIndex, count, false);

            return;
        }

        address winnerAddress;

        uint lastIndex = fromIndex + count;
        // для послденего периода
        if (lastIndex > countOfWinners - 1) {
            lastIndex = countOfWinners - 1;
        }
        for (uint index = fromIndex; index <= lastIndex; index++) {
            winnerAddress = winnersList[currentDrawId][index];
            if (!isGivenShare[currentDrawId][winnerAddress]) {
                winnersMoney[winnerAddress] += moneyForEachWinner[currentDrawId];
                isGivenShare[currentDrawId][winnerAddress] = true;
                prizeDistributionProgress[currentDrawId]++;
            }
        }

        bool needMoreShoot;
        if (prizeDistributionProgress[currentDrawId] == countOfWinners) {
            fullyDistributedPrize[currentDrawId] = true;

        } else if (fromIndex + count < countOfWinners) {
            needMoreShoot = true;

        } else {
            //please check all periods, you missed some data
        }

        emit DistributionOfWithdraws(currentDrawId, fromIndex, count, needMoreShoot);
    }

    // запрос на получение выиграша
    function withdrawPrize(uint value) private inited {
        require(value > 0
        , "Value must be > 0"
        );

        if (winnersMoney[msg.sender] >= value) {
            // у пользователя на счету достаточно средств для вывода
            winnersMoney[msg.sender] -= value;
            PrizePool(prizePoolAddress).sendToWinner(msg.sender, value);

            emit TransferredPrize(msg.sender, value);
            return;
        }

        uint currentDrawId = Draw(drawAddress).currentDrawId();
        // есть ли пользователь в списке победителей в текущем выиграше
        // и его доля еще не распредлена
        if (winnersListExists[currentDrawId][msg.sender] && !isGivenShare[currentDrawId][msg.sender]) {

            if (Draw(drawAddress).isWaitingWithdrawsPeriod()) {
                uint currentIndex = winnersListIndex[currentDrawId][msg.sender];
                Draw(drawAddress).startWithdraws(currentIndex, 1, 10);
            }
        }

        require(winnersMoney[msg.sender] > 0
        , "You don't have any money amount"
        );

        if (winnersMoney[msg.sender] < value) {
            // если не хватате денег берем все что отсалось
            value = winnersMoney[msg.sender];
            winnersMoney[msg.sender] = 0;
        } else {
            winnersMoney[msg.sender] -= value;
        }

        PrizePool(prizePoolAddress).sendToWinner(msg.sender, value);

        emit TransferredPrize(msg.sender, value);
        return;
    }

    function hashVal(uint number, uint salt) public pure returns (bytes32) {
        return keccak256(number, salt);
    }

    function withdrawTicketPrice(uint256 ticketNumber) inited public {

        require(TokenERC721(token712Address).tokenExists(ticketNumber)
        , 'This ticket does not exists'
        );
        require(TokenERC721(token712Address).ownerOf(ticketNumber) == msg.sender
        , 'You are not the owner of this ticket'
        );

        TokenERC721(token712Address).setTicketStatusPayed(ticketNumber);

        uint ticketDrawId = TokenERC721(token712Address).getTicketDrawId(ticketNumber);
        uint value = moneyForEachWinner[ticketDrawId];
        withdrawPrize(value);

        emit TicketPaid(ticketNumber);
    }

}
