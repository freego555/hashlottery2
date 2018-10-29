const TokenERC20 = artifacts.require("./TokenERC20.sol");
const newTokenERC20 = artifacts.require("./newTokenERC20.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");
const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");
const Migrations = artifacts.require("./Migrations.sol");
const MigrationAgent = artifacts.require("./MigrationAgent.sol");

module.exports = function (deployer) {
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

                    return deployer.deploy(newTokenERC20).then(function (i) {
                        console.log("newTokenERC20 deployed success");

                        return deployer.deploy(Migrations).then(function (i) {
                            console.log("Migrations deployed success");

                            return deployer.deploy(MigrationAgent).then(function (i) {
                                console.log("MigrationAgent deployed success");

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
                                                });
								            });
                                        });
                                    })
                                });
                            });
                        });
                    });
                });
            });
        });


    } catch (e) {
        console.log("Not deployed" + e.message);
    }
};
