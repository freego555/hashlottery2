var Crowdsale = artifacts.require("./Crowdsale.sol");
var TokenERC20 = artifacts.require("./TokenERC20.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol"); // test

const helper = require("./helpers/truffleTestHelper"); // for time travelling truffle tests

contract('Crowdsale (initialized and ICO is continuing)', function(accounts) {
    var crowdsale;
    var owner = accounts[0];
    var investor = accounts[1];

    before(async function() {
        crowdsale = await Crowdsale.deployed();
    })

    describe('Check init()', function() {
        it('startICO() should be more than 0', async function(){
            let startICO = await crowdsale.startICO();

            assert.isTrue(startICO > 0, 'startICO() isn\'t more than 0');
        });

        it('startICOPlus2Days() should be startICO() + 2 days', async function(){
            let startICO          = await crowdsale.startICO();
            let startICOPlus2Days = await crowdsale.startICOPlus2Days();
            let twoDaysInSeconds  = 24 * 2 * 60 * 60;

            startICO = startICO.plus(twoDaysInSeconds); // use Bignumber API

            assert.isTrue(startICO.comparedTo(startICOPlus2Days) == 0, 'startICOPlus2Days() isn\'t startICO() + 2 days'); // use Bignumber API
        });

        it('deadline() should be startICO() + 7 days', async function(){
            let startICO = await crowdsale.startICO();
            let deadline = await crowdsale.deadline();
            let sevenDaysInSeconds = 24 * 7 * 60 * 60;

            startICO = startICO.plus(sevenDaysInSeconds); // use Bignumber API

            assert.isTrue(startICO.comparedTo(deadline) == 0, 'deadline() isn\'t startICO() + 7 days'); // use Bignumber API
        });

        it('price() should be 0.25 Ether', async function(){
            let price      = await crowdsale.price();
            let checkPrice = web3.toWei(0.25); // 0.25 Eth

            assert.isTrue(price == checkPrice, 'price() isn\'t 0.25 Ether');
        });

        it('amountTokensForSale() should be 40% of total supply of tokens', async function() {
            let token = await TokenERC20.deployed();

            let amountTokensForSale      = await crowdsale.amountTokensForSale();
            let totalSupply              = await token.totalSupply();
            let checkAmountTokensForSale = totalSupply.times(40).div(100); // use Bignumber API

            assert.isTrue(amountTokensForSale.comparedTo(checkAmountTokensForSale) == 0, 'amountTokensForSale() isn\'t 40% of total supply of tokens'); // use Bignumber API
        });

        it('amountTokensForOwners() should be the rest of total supply of tokens after sale for investors', async function(){
            let token = await TokenERC20.deployed();

            let amountTokensForOwners      = await crowdsale.amountTokensForOwners();
            let totalSupply                = await token.totalSupply();
            let checkAmountTokensForOwners = totalSupply.minus(totalSupply.times(40).div(100)); // use Bignumber API

            assert.isTrue(amountTokensForOwners.comparedTo(checkAmountTokensForOwners) == 0, 'amountTokensForOwners() isn\'t the rest of total supply of tokens after sale for investors'); // use Bignumber API
        });

        it('limitOfFirstBuyers() should be 5', async function(){
            let limitOfFirstBuyers = +(await crowdsale.limitOfFirstBuyers()).toString(10);

            assert.isTrue(limitOfFirstBuyers == 5, 'limitOfFirstBuyers() isn\'t 5');
        });
    });

    describe('Check isIcoEnd()', function() {
        it('When tokens was NOT sold isIcoEnd() should be false', async function(){
            let isICOEnd           = await crowdsale.isIcoEnd();
            let amountOfSoldTokens = await crowdsale.amountOfSoldTokens();

            if (amountOfSoldTokens != 0) {
                throw Error('Amount of sold tokens isn\'t equal 0');
            }

            assert.isTrue(isICOEnd == false, 'When tokens was NOT sold isIcoEnd() isn\'t false');
        });

        it('When some amount of tokens was sold isIcoEnd() should be false', async function(){
            let priceOfOneToken = web3.toWei(0.25); // 0.25 Eth

            //console.log("balance investor: ", await web3.eth.getBalance(investor).toString(10));

            await crowdsale.invest({from: investor, value: 20 * priceOfOneToken});

            //console.log("balance multisig: ", await web3.eth.getBalance(MultiSigWallet.address).toString(10));
            //console.log("balance investor: ", await web3.eth.getBalance(investor).toString(10));

            let isICOEnd           = await crowdsale.isIcoEnd();
            let amountOfSoldTokens = await crowdsale.amountOfSoldTokens();

            // throw if invest() hadn't sold tokens
            if (amountOfSoldTokens == 0) {
                throw Error('Amount of sold tokens is equal 0');
            }

            assert.isTrue(isICOEnd == false, 'When some amount of tokens was sold isIcoEnd() isn\'t false');
        });

//        it('When tokens was sold isIcoEnd() should be true', async function(){
//            let crowdsale = await Crowdsale.deployed();
//            //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
//        });
    });

//    describe('Check isIcoFail()', function() {
//        it(' should be ', async function(){
//                //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
//        });
//    });
//
//    describe('Check invest()', function() {
//        it(' should be ', async function(){
//                //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
//        });
//    });
//
//    describe('Check distributeTokensAmongOwners()', function() {
//        it(' should be ', async function(){
//            //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
//        });
//    });
//
//    describe('Check refund()', function() {
//        it(' should be ', async function(){
//                //assert.isTrue(limitOfFirstBuyers == 5, ' isn\'t ');
//        });
//    });
});

//contract('Crowdsale (initialized and ICO is ended by time)', function(accounts) {
//    var crowdsale;
//
//    beforeEach(async function() {
//        crowdsale = await Crowdsale.deployed();
//    })
//});