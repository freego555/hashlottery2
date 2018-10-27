var Crowdsale = artifacts.require("./Crowdsale.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");
var TokenERC20 = artifacts.require("./TokenERC20.sol");

const helper = require("./helpers/truffleTestHelper");

contract('Crowdsale (initialized and ICO is continuing)', function(accounts) {
    //var crowdsale;

    var owner = accounts[0];
    var investor = accounts[1];

    //beforeEach(async function() {
        //crowdsale = await Crowdsale.deployed();
//        try {
//            await crowdsale.init();
//        } catch(e) {
//            console.log('!!! Already INIT() !!!');
//        }
        //numBeforeEach++;
    //})

    describe('Check init()', function() {
        it('startICO() should be more than 0', async function(){
            let crowdsale = await Crowdsale.deployed();

            let startICO = await crowdsale.startICO();
            //console.log(numBeforeEach);
            assert.isTrue(startICO > 0, 'startICO() isn\'t more than 0');
        })

        it('startICOPlus2Days() should be startICO() + 2 days', async function(){
            let crowdsale = await Crowdsale.deployed();

            let startICO = await crowdsale.startICO();
            let startICOPlus2Days = await crowdsale.startICOPlus2Days();
            let twoDaysInSeconds = 24 * 2 * 60 * 60;
            //console.log(numBeforeEach);

            startICO = startICO.plus(twoDaysInSeconds);

            assert.isTrue(startICO.comparedTo(startICOPlus2Days) == 0, 'startICOPlus2Days() isn\'t startICO() + 2 days');
        })

        it('deadline() should be startICO() + 7 days', async function(){
            let crowdsale = await Crowdsale.deployed();

            let startICO = await crowdsale.startICO();
            let deadline = await crowdsale.deadline();
            let sevenDaysInSeconds = 24 * 7 * 60 * 60;
            //console.log(numBeforeEach);

            startICO = startICO.plus(sevenDaysInSeconds);

            assert.isTrue(startICO.comparedTo(deadline) == 0, 'deadline() isn\'t startICO() + 7 days');
        })

        it('price() should be 0.25 Ether', async function(){
            let crowdsale = await Crowdsale.deployed();

            let price = await crowdsale.price();
            //console.log(numBeforeEach);

//            console.log(price);
//            console.log(web3.toWei(0.25));

            assert.isTrue(price == web3.toWei(0.25), 'price() isn\'t 0.25 Ether');
        })

        it('amountTokensForSale() should be 40% of total supply of tokens', async function() {
            let crowdsale = await Crowdsale.deployed();
            token     = await TokenERC20.deployed();
            //console.log(numBeforeEach);

            let amountTokensForSale = await crowdsale.amountTokensForSale();
            let totalSupply = await token.totalSupply();
            let checkAmountTokensForSale = Math.floor(totalSupply * 40 / 100);

            try {
                        await crowdsale.init();
                    } catch(e) {
                        console.log('!!! Already INIT() !!!');
                    }

            console.log(amountTokensForSale);
            console.log(totalSupply);
            console.log(checkAmountTokensForSale);

            assert.isTrue(amountTokensForSale == checkAmountTokensForSale, 'amountTokensForSale() isn\'t 40% of total supply of tokens');
        })

        it('amountTokensForOwners() should be the rest of total supply of tokens after sale for investors', async function(){
            let crowdsale = await Crowdsale.deployed();
            token     = await TokenERC20.deployed();
            //console.log(numBeforeEach);

            let amountTokensForOwners = await crowdsale.amountTokensForOwners();
            let totalSupply = await token.totalSupply();
            let checkAmountTokensForOwners = totalSupply - Math.floor(totalSupply * 40 / 100);

            console.log(amountTokensForOwners);
            console.log(totalSupply);
            console.log(checkAmountTokensForOwners);

            assert.isTrue(amountTokensForOwners == checkAmountTokensForOwners, 'amountTokensForOwners() isn\'t the rest of total supply of tokens after sale for investors');
        })

        it('limitOfFirstBuyers() should be 5', async function(){
            let crowdsale = await Crowdsale.deployed();
            let limitOfFirstBuyers = await crowdsale.limitOfFirstBuyers();

            //console.log(limitOfFirstBuyers);

            assert.isTrue(limitOfFirstBuyers == 5, 'limitOfFirstBuyers() isn\'t 5');
        })
    })

    describe('Check isIcoEnd()', function() {
        it('When tokens was NOT sold isIcoEnd() should be false', async function(){
            let crowdsale = await Crowdsale.deployed();

            let isICOEnd = await crowdsale.isIcoEnd();
            let amountOfSoldTokens = await crowdsale.amountOfSoldTokens();

            if (amountOfSoldTokens != 0) {
                throw Error('Amount of sold tokens isn\'t equal 0');
            }

            assert.isTrue(isICOEnd == false, 'When tokens was NOT sold isIcoEnd() isn\'t false');
        })

        it('When some amount of tokens was sold isIcoEnd() should be false', async function(){
            let crowdsale = await Crowdsale.deployed();

            let priceOfOneToken = web3.toWei(0.25);
            await crowdsale.send(20 * priceOfOneToken, {from: investor});

            console.log('test');
            let isICOEnd = await crowdsale.isIcoEnd();
            let amountOfSoldTokens = await crowdsale.amountOfSoldTokens();
            console.log(isICOEnd);
            console.log(amountOfSoldTokens);
            if (amountOfSoldTokens == 0) {
                throw Error('Amount of sold tokens is equal 0');
            }

            assert.isTrue(isICOEnd == false, 'When some amount of tokens was sold isIcoEnd() isn\'t false');
        })

        it('When tokens was sold isIcoEnd() should be true', async function(){
            let crowdsale = await Crowdsale.deployed();
            //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
        })
    })

    describe('Check isIcoFail()', function() {
        it(' should be ', async function(){
                //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
        })
    })

    describe('Check invest()', function() {
        it(' should be ', async function(){
                //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
        })
    })

    describe('Check distributeTokensAmongOwners()', function() {
        it(' should be ', async function(){
            //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
        })
    })

    describe('Check refund()', function() {
        it(' should be ', async function(){
                //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
        })
    })
});

//contract('Crowdsale (initialized and ICO is ended by time)', function(accounts) {
//    var crowdsale;
//
//    beforeEach(async function() {
//        crowdsale = await Crowdsale.deployed();
//    })
//});