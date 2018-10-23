var Crowdsale = artifacts.require('./Crowdsale.sol');
var Multisig = artifacts.require('./MultiSigWallet.sol');

contract('Crowdsale (initialized)',function() {
	var crowdsale;

	before(async function() {
		crowdsale = await Crowdsale.deployed();
	})

	describe('Check init()', function() {
		it('startICO() should be less then now', async function(){
			let startICO = await crowdsale.startICO();
			assert.isTrue(startICO == 0, 'startICO() isn\'t less then now');
		})
	})
});