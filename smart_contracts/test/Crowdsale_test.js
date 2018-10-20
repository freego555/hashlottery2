
var Crowdsale = artifacts.require("./Crowdsale.sol");

contract('Crowdsale', async function() {

    var crowdsale;
    var price=250000000000000000;

    beforeEach(async function() {
        crowdsale = await Crowdsale.deployed();
        // crowdsale.init.call();
    });

    describe('calcTokenAmount', function() {

        it("buy 100 tokens", async () => {
            let expectedCount = 100;
            [tokens , change] =  await crowdsale.calcTokenAmount.call(expectedCount*price, false);
            assert.equal( tokens.toString() , 134, 'token count not matches');
            // assert.equal( change.toString() , 100, 'change not matches');
        });



        it("buy 40000 tokens", async () => {

            let expectedCount=40000;

            [tokens , change] =  await crowdsale.calcTokenAmount.call(expectedCount*price, false);
            assert.equal( tokens.toString() , 38720, 'token count not matches');
            // assert.equal( change.toString() , 0, 'change not matches');

        });

    });
});
