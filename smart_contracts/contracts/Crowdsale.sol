pragma solidity ^0.4.24;
import './MultiSigWallet.sol';
import './TokenERC20.sol';

contract Crowdsale {
    address public multisigContractAddress; // куда перечисляются средства
    address public owner; // владелец контракта
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
    mapping(address => uint256) public balanceOfTokenBonus; // total balance of bonus tokens
    mapping(address => uint256) public balanceOfTokenBuyed; // total balance of buyed tokens
    mapping(address => bool) public owners;
    mapping(address => bool) public ownerGetTokens;
    bool isFirstOwnerGetRestTokens; // один из владельцев ICO уже забрал вероятный остаток от деления на 3
    bool public isInit;
    bool isSetTokenReward;
    bool isSetMultisig;
    
    event FundTransfer(address backer, uint256 amount, bool isContribution);
    
    constructor() public {
        owner = msg.sender;
        
        // Заполним список владельцев ICO
        owners[0x896ab7b50d7bce2961072fef0a7225376e88ba7e] = true; // Игорь
        owners[0x94bb857c3a550130120b5bfc1b7de3d478104705] = true; // Маша
        owners[0x42cf7f102aeb2d387c083548990e3bcc03d33d12] = true; // Костя
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }
    
    function setTokenUsedAsReward(address _addressOfTokenUsedAsReward) public onlyOwner {
        require(!isSetTokenReward, "Token reward contract has already set");
            
        tokenReward = TokenERC20(_addressOfTokenUsedAsReward);
        isSetTokenReward = true;
    }
    
    function setMultisig(address _multisigAddress) public onlyOwner {
        require(!isSetMultisig, "Multisig contract has already set");
            
        multisigContractAddress = _multisigAddress;
        multisigContract = MultiSigWallet(multisigContractAddress);
        isSetMultisig = true;
    }
    
    function init() public onlyOwner {
        require(!isInit, "Crowdsale contract already init");
        require(isSetTokenReward, "Token isn't set");
        require(isSetMultisig, "Multisig isn't set");
        uint256 totalSupply = tokenReward.totalSupply();
        require(totalSupply > 0, "Supply tokens is not done yet");
        
        isInit = true;
        startICO = now;
        startICOPlus2Days = startICO + 2 days;
        deadline = startICO + 7 days;
        price = 250000000000000000; // Цена в wei = 0.25ETH 
        amountTokensForSale = totalSupply * 40 / 100; // Отправим указанный процент токенов для продажи на crowdsale
        amountTokensForOwners = totalSupply - amountTokensForSale; // Остаток токенов равномерно распределим среди владельцев ICO при успешном окончании
        limitOfFirstBuyers = 5; // фиксируем кол-во первых покупателей
    }
    
    function distributeTokensAmongOwners() public {
        // Определим принадлежит ли отправитель транзакции к владельцам ICO
        bool isOwnerOfICO = owners[msg.sender];
        bool isOwnerGetTokens = ownerGetTokens[msg.sender];
        require(isOwnerOfICO, "Only owner of ICO can call this");
        require(!isOwnerGetTokens, "Owner has already get tokens");
        require(isIcoEnd(), "ICO isn't ended");
        require(!isIcoFail(), "ICO is failed");

        ownerGetTokens[msg.sender] = true;

        // Распределим остаток токенов среди владельцев ICO. Даем остаток от деления на 3 первому владельцу ICO, который забирает токены.
        uint amountForOneOwner = amountTokensForOwners / 3;
        if (!isFirstOwnerGetRestTokens) {
            // Одному из владельцев ICO начисляем также остаток от деления на 3, чтобы точно распределить все токены
            isFirstOwnerGetRestTokens = true;
            tokenReward.transfer(msg.sender, amountForOneOwner + amountTokensForOwners % 3);
        } else {
            tokenReward.transfer(msg.sender, amountForOneOwner);
        }
    }
    
    function isIcoEnd() public view returns(bool) {
        return isInit && (now > deadline || amountOfSoldTokens >= amountTokensForSale);
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
    function calcTokenAmount(uint256 _wei_amount, bool _pre_calc)
    public view returns (uint256 token_count_buyed, uint256 token_count_bonus, uint256 _wei_change, uint8 bonuses){

        require(isInit, "Crowdsale contract must be init");

        uint256 newPrice = price;
        bool reachedLimit = false;
        uint256 max_allowed = amountTokensForSale - amountOfSoldTokens;
        uint256 tokenExistsLeftWithoutBonus;
        uint256 fixTotal;
        // for bonus3

        // BONUS 1 //- Те инвесторы, которые приобретут токены в первые 2 дня должны получить скидку в 10%
        if ((now < startICOPlus2Days) && !_pre_calc) {
            // предполагается что скидка сохраняется только на покупки в указанный период
            newPrice = newPrice * 9 / 10;
            bonuses += 100;
        }

        if(_wei_amount < newPrice){ // если не хватает денег на даже один токен
            return (0, 0, _wei_amount, 0);
        }

        token_count_buyed = _wei_amount / newPrice;
        if (token_count_buyed >  max_allowed) {// if reached limit
            reachedLimit = true;
            token_count_buyed = max_allowed;
        }

        // BONUS 2 //- Первые 5 покупателей получат 20% бонус в токенах как ранние инвесторы.
        uint256 bonus2;
        if (balanceOf[msg.sender] == 0) {
            // new buyer
            if ((countOfFirstBuyers < limitOfFirstBuyers) && !_pre_calc) {
                bonus2 = calcBonus2(token_count_buyed);
                if (token_count_buyed + bonus2 > max_allowed) {// recalc
                    fixTotal = token_count_buyed + bonus2 - max_allowed;
                    (bonus2, token_count_buyed) = fixBonus2(fixTotal, bonus2, token_count_buyed);
                }
                bonuses += 20;
            }
        } else {
            tokenExistsLeftWithoutBonus = balanceOfTokenBuyed[msg.sender] % 100;
            //for bonus3
        }

        // end BONUS 2

        // BONUS 3 //- Также необходимо предусмотреть начисление одного бонусного токена за каждые 100 купленных токенов.
        //предполагается что подаренные по п2 считаются подарочными и в подсчете не учитываются
        uint256 bonus3 = calcBonus3(tokenExistsLeftWithoutBonus, token_count_buyed);
        if (token_count_buyed + bonus2 + bonus3 > max_allowed) {
            // if reached limit
            fixTotal = token_count_buyed + bonus2 + bonus3 - max_allowed;
            (bonus2, token_count_buyed) = fixBonus2(fixTotal, bonus2, token_count_buyed);
            bonus3 = calcBonus3(tokenExistsLeftWithoutBonus, token_count_buyed);
        }
        if (bonus3 > 0) {
            bonuses += 3;
        }
        // end BONUS 3
        token_count_bonus = bonus2 + bonus3;

        _wei_change = _wei_amount - (token_count_buyed * newPrice);
        return (token_count_buyed, token_count_bonus, _wei_change, bonuses);
    }

    function calcBonus2(uint256 buyed) private pure returns (uint256){
        return buyed / 5;
    }

    function fixBonus2(uint256 fixTotal, uint256 bonus, uint256 buyed) private pure returns (uint256 bonusFixed, uint256 buyedFixed){
        if (fixTotal > 0) {// recalc
            uint256 bonusFix = calcBonus2(fixTotal);
            bonusFixed = bonus - bonusFix;
            buyedFixed = buyed - fixTotal;
            return (bonusFixed, buyedFixed);
        }
        return (bonus, buyed);
    }

    function calcBonus3(uint256 buyedWithoutBonus, uint256 buyed) private pure returns (uint256 bonus3){
        return (buyedWithoutBonus + buyed) / 100;
    }

    function() payable public {
        invest();
    }

    function invest() payable public {
        require(!isIcoEnd(), "You can't invest because ICO is ended"); // Триває ICO
        require(msg.value > 0, "You can't invest because value is 0");  // Отримані кошти?
        uint256 buyer_wei = msg.value;             // Кількість відправлених коштів Покупцем
        uint256 actually_wei;                      // Кількість фактично отриманих коштів
        uint256 token_count;                    // Порахована кількість токенів
        uint256 token_count_bonus;
        uint256 wei_change;                     // Решта від відправлених коштів Покупця та фактичної вартості токенів
        (token_count, token_count_bonus, wei_change, ) = calcTokenAmount(buyer_wei, false); // Порахуй кількість токенів та решту коштів

        require(token_count > 0, "You can't invest because wei_amount less than price of one token");

        balanceOfTokenBonus[msg.sender] += token_count_bonus;
        balanceOfTokenBuyed[msg.sender] += token_count;
        token_count+=token_count_bonus;
        if (balanceOf[msg.sender] == 0) {
            countOfFirstBuyers++;
        }

        actually_wei = buyer_wei - wei_change;

        amountOfSoldTokens += token_count;             // Додай кількість зібраних коштів
        balanceOf[msg.sender] += actually_wei;         // Додай кількість до вкладених коштів Покупцем
        tokenReward.transfer(msg.sender, token_count); // Перерахуй кількість токенів на рахунок покупця
        emit FundTransfer (msg.sender, actually_wei, true);

        multisigContractAddress.transfer(actually_wei); // Відправ кошти на Контракт MultiSig

        if (wei_change != 0) {
            msg.sender.transfer(wei_change);    // Відправ решту Покупцю
        }
    }

    function refund() public {
        uint valueToRefund = balanceOf[msg.sender]; // Sum for refund to investor
        require(isIcoFail(), "ICO isn't failed");
        require(valueToRefund != 0, "Balance is 0");

        balanceOf[msg.sender] = 0;

        multisigContract.getCoinsAfterNegativeIco(msg.sender, valueToRefund); // Инициируем возврат средств инвестору c multisig-контракта
        emit FundTransfer(msg.sender, valueToRefund, false);
    }

}

