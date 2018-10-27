
var Crowdsale = artifacts.require("./Crowdsale.sol");

contract('Crowdsale', async function() {

    var crowd;
    var price=250000000000000000;

    beforeEach(async function() {
        crowd = await Crowdsale.deployed();
    });

    describe('calcTokenAmount', function() {
        
        it("buy 100 tokens", async () => {
            assert.isTrue( await crowd.amountTokensForSale > 0, 'amountTokensForSale not set correctly' );
              
            let money = 100 * price;
            let tokens_buyed,tokens_bonus, change; 
            [tokens_buyed ,tokens_bonus, change] = await crowd.calcTokenAmount(money, false);

        //    assert.equal( tokens_buyed.toNumber() , 100);
          //  assert.equal( tokens_bonus.toNumber() , 34);
            
           // assert.equal( change.toNumber() , money);
          
            
        });

    });
});
