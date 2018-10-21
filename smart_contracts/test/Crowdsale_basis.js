var Crowdsale = artifacts.require("./Crowdsale.sol");

contract('Crowdsale', function(accounts) {
        beforeEach(async function() {
            crowdsale = await Crowdsale.deployed();
        });

        describe('Check initial in constructor', function() {
            it('Owner should be set', async function() {
                let owner = await crowdsale.owner();
                //console.log(owner);
                assert.isTrue(owner != 0x0);
            });

            it('Function isIcoEnd() should return false', async function() {
//				const admin = accounts[0];
//				const owner = accounts[1];
//				const stranger = accounts[9];
				
                let isIcoEnd = await crowdsale.isIcoEnd();
                assert.isTrue(isIcoEnd == false);
            });
			
			it('Function isIcoFail() should return false', async function() {
                let isIcoFail = await crowdsale.isIcoFail();
                assert.isTrue(isIcoFail == false);
            });
        });

        describe('Check init()', function() {
            it('Check init() is available only for owner', async function() {
                const stranger = accounts[9];
                //let isAvailableForStranger;
                let crowdsaleForInit = Crowdsale.new();
                try {
                    await crowdsaleForInit.init({from: stranger});
                    //isAvailableForStranger = true;
                }
                catch(e) {
                return;
                }
                //assert.isTrue(!isAvailableForStranger, 'init() is available NOT only for owner.')
                throw Error('init() is available NOT only for owner.');
            })
        });
    }
);