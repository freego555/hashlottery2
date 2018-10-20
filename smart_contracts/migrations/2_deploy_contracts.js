var TokenERC20 = artifacts.require("./TokenERC20.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

module.exports = function (deployer) {
    try {

        var token, crowd, sig;

        deployer.deploy(TokenERC20).then(function (i) {
            token = i;
            console.log("TokenERC20 deployed success");

            return deployer.deploy(Crowdsale).then(function (i) {
                crowd = i;
                console.log("Crowdsale deployed success");

                return deployer.deploy(MultiSigWallet).then(function (i) {
                    sig = i;
                    console.log("MultiSigWallet deployed success");

                    return crowd.setTokenUsedAsReward(TokenERC20.address).then(function () {
                        console.log("TokenERC20 set to Crowdsale success");
                        //
                        return crowd.setMultisig(MultiSigWallet.address).then(function () {
                            console.log("MultiSigWallet set to Crowdsale success");

                            return crowd.init().then(function () {
                                console.log("Crowdsale init success");

                                return sig.setCrowdSaleContractAddress(Crowdsale.address).then(function () {
                                    console.log("Crowdsale set to MultiSigWallet success");

                                    console.log("DONE -- DEPLOY -- DONE");

                                    return true;
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
