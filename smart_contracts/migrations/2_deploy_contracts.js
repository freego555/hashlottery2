var TokenERC20 = artifacts.require("./TokenERC20.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

module.exports = function (deployer) {
    //return;
    try {

        var token, crowd, sig;

        deployer.deploy(TokenERC20).then(function (i) {
            token = i; // get instance of TokenERC20
            console.log("TokenERC20 deployed success");

            return deployer.deploy(Crowdsale).then(function (i) {
                crowd = i; // get instance of Crowdsale
                console.log("Crowdsale deployed success");

                return deployer.deploy(MultiSigWallet).then(function (i) {
                    sig = i; // get instance of MultiSigWallet
                    console.log("MultiSigWallet deployed success");

                    return crowd.setTokenUsedAsReward(token.address).then(function () {
                        console.log("TokenERC20 set to Crowdsale success");

                        return crowd.setMultisig(sig.address).then(function () {
                            console.log("MultiSigWallet set to Crowdsale success");

                            return sig.setCrowdSaleContractAddress(crowd.address).then(function () {
                                console.log("Crowdsale set to MultiSigWallet success");

                                return token.supplyTokens(crowd.address).then(function () {
                                    console.log("Supply tokens is success");

                                    return crowd.init().then(function () {
                                        console.log("Crowdsale init success");
                                        console.log("DONE -- DEPLOY -- DONE");

                                      console.log('please add this to smart_contracts/conract_addresses.js file')

                                      console.log( "tokenERC20: '" + token.address +"',");
                                      console.log( "crowdSale: '" + crowd.address +"',");
                                      console.log( "multiSig: '" + sig.address +"',");

                                    });
                                });
                            });
                        })
                    });
                });
            });
        });


    } catch (e) {
        console.log("Not deployed" + e.message);
    }
};
