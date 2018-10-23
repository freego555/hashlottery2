var Crowdsale = artifacts.require("./Crowdsale.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract('Crowdsale (NOT init)', function(accounts) {
    //let numBefore = 0;
    //let numBeforeEach = 0;
    var crowdsaleWithoutInit;
    //var crowdsaleInitialized;

    var creator = accounts[0];
    var owner = accounts[0];
    var stranger = accounts[9];

    before(async function() {
        crowdsaleWithoutInit = await Crowdsale.new();
        //crowdsaleInitialized = await Crowdsale.deployed();
        //var multisig = await MultiSigWallet.deployed();
        //numBefore++;
    });

    beforeEach(async function() {
        //numBeforeEach++;
    });

    describe('Check first init in constructor', function() {
        it('Owner should be set', async function() {
            //console.log("!!!!!!!!Number of before(): " + numBefore);
            //console.log("!!!!!!!!Number of beforeEach(): " + numBeforeEach);
            //await crowdsaleInitialized.setMultisig("0x2dbc56b412ef3f70bee2ef3662e850f49c831052");
            //console.log(multisig.address);
            //await crowdsaleInitialized.setMultisig(multisig.address);
            //console.log(await crowdsaleInitialized.multisigContractAddress());

            let owner = await crowdsaleWithoutInit.owner();
            assert.isTrue(owner != 0x0, 'Owner is NOT set');
        });

        it('Owner should be the account that create contract', async function() { // ???
            //console.log("!!!!!!!!Number of beforeEach(): " + numBeforeEach);
            //console.log(await crowdsaleInitialized.multisigContractAddress());
            let owner = await crowdsaleWithoutInit.owner();
            assert.isTrue(owner == creator, 'Owner is NOT creator of contract');
        });

        describe('Check owners of ICO', function() {
            it('Owner Ihor is present', async function() {
                let isOwnerOfICO = await crowdsaleWithoutInit.owners("0x896ab7b50d7bce2961072fef0a7225376e88ba7e");
                assert.isTrue(isOwnerOfICO, 'Ihor is NOT owner of ICO');
            });

            it('Owner Oleh is present', async function() {
                let isOwnerOfICO = await crowdsaleWithoutInit.owners("0x2dbc56b412ef3f70bee2ef3662e850f49c831052");
                assert.isTrue(isOwnerOfICO, 'Oleh is NOT owner of ICO');
            });

            it('Owner Konstiantyn is present', async function() {
                let isOwnerOfICO = await crowdsaleWithoutInit.owners("0xf7a67efba2a97f86228a7e36b996b34e0a417763");
                assert.isTrue(isOwnerOfICO, 'Konstiantyn is NOT owner of ICO');
            });

            it('Owner Mary is present', async function() {
                let isOwnerOfICO = await crowdsaleWithoutInit.owners("0x94bb857c3a550130120b5bfc1b7de3d478104705");
                assert.isTrue(isOwnerOfICO, 'Mary is NOT owner of ICO');
            });

            it('Owner Dmytro is present', async function() {
                let isOwnerOfICO = await crowdsaleWithoutInit.owners("0x44f8fb0c0425471e23cdcc819827aa32cab607a9");
                assert.isTrue(isOwnerOfICO, 'Dmytro is NOT owner of ICO');
            });
        });

        it('Function isIcoEnd() should return false', async function() {
            let isIcoEnd = await crowdsaleWithoutInit.isIcoEnd();
            assert.isTrue(isIcoEnd == false);
        });

        it('Function isIcoFail() should return false', async function() {
            let isIcoFail = await crowdsaleWithoutInit.isIcoFail();
            assert.isTrue(isIcoFail == false);
        });
    });

    describe('Check init()', function() {
        it('Check init() is available only for owner', async function() {
            //console.log("!!!!!!!!Number of before(): " + numBefore);
            //console.log("!!!!!!!!Number of beforeEach(): " + numBeforeEach);
            //console.log(await crowdsaleInitialized.multisigContractAddress());

            try {
                await crowdsaleWithoutInit.init({from: stranger});
            }
            catch(e) {
                return;
            }
            throw Error('init() is available NOT only for owner.');
        });
    });
});