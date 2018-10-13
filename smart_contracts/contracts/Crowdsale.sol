pragma solidity ^0.4.25;

contract TokenERC20 {
    function transfer(address receiver, uint256 amount) external returns(bool);
    function balanceOf(address receiver) external view returns(uint256);
    function totalSupply() external returns(uint256);
}

contract MultiSigWallet {
    function getCoinsAfterNegativeIco(address _investor, uint256 value) public;
}

contract Crowdsale {
    address public multisigContractAddress; // куда перечисляются средства
    address public owner; // владелец контракта
    address[5] public ownersOfICO;
    uint public amountTokensForSale; // необходимое количество токенов
    uint public amountOfSoldTokens; // проданное количество токенов
    uint public amountTokensForOwners; // количество токенов для владельцев ICO. Будут распределены при успешном окончании ICO
    uint public countOfFirstBuyers; // количество первых покупателей, которые получили право на бонусы
    uint public limitOfFirstBuyers; // лимит количества первых покупателей, которые получат право на бонусы
    uint public deadline; // таймштамп завершения ICO
    uint public startICO; // таймштамп начала ICO
    uint public startICOPlus2Days; // таймштамп начала ICO + 2 дня
    uint public price; // цена одного токена в wei
    TokenERC20 public tokenReward; // токен, который продается на ICO
    MultiSigWallet public multisigContract; // контракт Multisig
    mapping(address => uint256) public balanceOf; // перечень кто сколько внес средств
    mapping(address => uint256) public balanceOfBonusFirstBuyers;
    mapping(address => bool) public owners;
    mapping(address => bool) public ownerGetTokens;
    bool isFirstOwnerGetRestTokens; // один из владельцев ICO уже забрал вероятный остаток от деления на 5
    bool isInit;
    bool isSetTokenReward;
    bool isSetMultisig;
    
    event FundTransfer(address backer, uint amount, bool isContribution);
    
    constructor() public {
        owner = msg.sender;
        
        // Заполним список владельцев ICO
        owners[0x896ab7b50d7bce2961072fef0a7225376e88ba7e] = true;
        owners[0x2dbc56b412ef3f70bee2ef3662e850f49c831052] = true;
        owners[0xf7a67efba2a97f86228a7e36b996b34e0a417763] = true;
        owners[0x94bb857c3a550130120b5bfc1b7de3d478104705] = true;
        owners[0x44f8fb0c0425471e23cdcc819827aa32cab607a9] = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }
    
    function setTokenUsedAsReward(address _addressOfTokenUsedAsReward) public onlyOwner {
        require(!isSetTokenReward);
            
        tokenReward = TokenERC20(_addressOfTokenUsedAsReward);
        isSetTokenReward = true;
    }
    
    function setMultisig(address _multisigAddress) public onlyOwner {
        require(!isSetMultisig);
            
        multisigContractAddress = _multisigAddress;
        multisigContract = MultiSigWallet(multisigContractAddress);
        isSetMultisig = true;
    }
    
    function init() public onlyOwner {
        require(!isInit && isSetTokenReward && isSetMultisig);
        
        isInit = true;
        startICO = now;
        startICOPlus2Days = startICO + 2 days;
        deadline = startICO + 7 days;
        price = 250000000000000000; // Цена в wei = 0.25ETH
        amountTokensForSale = tokenReward.totalSupply() * 40 / 100; // Отправим указанный процент токенов для продажи на crowdsale
        amountTokensForOwners = tokenReward.totalSupply() - amountTokensForSale; // Остаток токенов равномерно распределим среди владельцев ICO при успешном окончании
        limitOfFirstBuyers = 5; // фиксируем колво первых покупателей
    }
    
    function distributeTokensAmongOwners() public {
        // Определим принадлежит ли отправитель транзакции к владельцам ICO
        bool isOwnerOfICO = owners[msg.sender];
        require(isOwnerOfICO && isIcoEnd() && !isIcoFail());

        ownerGetTokens[msg.sender] = true;

        // Распределим остаток токенов среди владельцев ICO. Даем остаток от деления на 5 первому владельцу ICO, который забирает токены.
        uint amountForOneOwner = amountTokensForOwners / 5;
        if (isFirstOwnerGetRestTokens) {
            require(tokenReward.transfer(msg.sender, amountForOneOwner));
        } else {
            // Одному из владельцев ICO начисляем также остаток от деления на 5, чтобы точно распределить все токены
            isFirstOwnerGetRestTokens = true;
            require(tokenReward.transfer(msg.sender, amountForOneOwner + amountTokensForOwners % 5));
        }
    }
    
    function isIcoEnd() public view returns(bool) {
        return now > deadline || amountOfSoldTokens >= amountTokensForSale;
    }
    
    function isIcoFail() public view returns(bool) {
        return isIcoEnd() && amountOfSoldTokens < amountTokensForSale;
    }

    /**
     * Подсчет общего кол-ва токенов с учетом бонусов и подсчет сдачи
     * возможен запуск из:
     * -payable() для расчета реального значения
     * -из js интерфейса для предварительного подсчета без учета бонусов связанных со временем
     *
     * @param  _wei_amount : колво wei(копейки) на входе
     * @param  _pre_calc : флаг для предварительного расчета
     * @return _token_count - общее колво токенов с учетом бонусов
     * @return _wei_change - сдача в wei(копейки)
     */
    function calcTokenAmount(uint256 _wei_amount, bool _pre_calc) public returns (uint256 _token_count, uint256 _wei_change){
        // заглушка
        //return (0 , 0);

        uint256 newPrice = price;
        //- Те инвесторы, которые приобретут токены в первые 2 дня должны получить скидку в 10%
        if ((now < startICOPlus2Days) && !_pre_calc) {
            // предполагается что скидка сохраняется только на покупки в указанный период
            newPrice = newPrice * 9 / 10;
        }

        _token_count = _wei_amount / newPrice;
        _wei_change = _wei_amount % newPrice; // сохраним сдачу

        //- Первые 5 покупателей получат 20% бонус в токенах как ранние инвесторы.
        if (balanceOf[msg.sender] == 0) {// new buyer
            if ((countOfFirstBuyers < limitOfFirstBuyers) && !_pre_calc) {
                balanceOfBonusFirstBuyers[msg.sender] = _token_count * 2 / 10;
                _token_count = _token_count +  balanceOfBonusFirstBuyers[msg.sender];
                countOfFirstBuyers++;
            }
        }

        //- Также необходимо предусмотреть начисление одного бонусного токена за каждые 100 купленных токенов.
        //предполагается что подаренные по п2 считаются подарочными и в подсчете не учитываются
        if (balanceOf[msg.sender] == 0) {// new buyer
            _token_count += (_token_count - balanceOfBonusFirstBuyers[msg.sender]) / 100;
        }else{
            uint256 tokenExists = tokenReward.balanceOf(msg.sender); //balanceOfTest();
        }

        return (_token_count, _wei_change);
    }

    function() payable public {
        invest();
    }

    function invest() payable public {
        require(!isIcoEnd() && msg.value > 0);  // Триває ICO та отримані кошти?
        uint buyer_wei = msg.value;             // Кількість відправлених коштів Покупцем
        uint actually_wei;                      // Кількість фактично отриманих коштів
        uint256 token_count;                    // Порахована кількість токенів
        uint256 wei_change;                     // Решта від відправлених коштів Покупця та фактичної вартості токенів
        (token_count, wei_change) = calcTokenAmount(buyer_wei, false); // Порахуй кількість токенів та решту коштів
        actually_wei = buyer_wei - wei_change;

        amountOfSoldTokens += token_count;             // Додай кількість зібраних коштів
        balanceOf[msg.sender] += actually_wei;         // Додай кількість до вкладених коштів Покупцем
        tokenReward.transfer(msg.sender, token_count); // Перерахуй кількість токенів на рахунок покупця
        emit FundTransfer (msg.sender, actually_wei, true);

        multisigContractAddress.transfer(actually_wei); // Відправ кошти на Контракт MultiSig
        msg.sender.transfer(wei_change);    // Відправ решту Покупцю
    }

    function refund() payable public { //???
        require(isIcoFail());

        uint valueToRefund = balanceOf[msg.sender]; // Сумма для возврата инвестору
        balanceOf[msg.sender] = 0;

        multisigContract.getCoinsAfterNegativeIco(msg.sender, valueToRefund); // Инициируем возврат средств инвестору c multisig-контракта
        emit FundTransfer(msg.sender, valueToRefund, false);
    }

}

