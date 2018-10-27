const TokenERC20 = artifacts.require("./TokenERC20.sol");
const newTokenERC20 = artifacts.require("./newTokenERC20.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");
const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");
const Migrations = artifacts.require("./Migrations.sol");
const MigrationAgent = artifacts.require("./MigrationAgent.sol");

module.exports = async (deployer) => {
    try {
        const TokenERC20DAddress = await deployer.deploy(TokenERC20);
        await console.log("TokenERC20 deployed success", TokenERC20DAddress);

        const newTokenERC20DAddress = await deployer.deploy(newTokenERC20);
        await console.log("newTokenERC20D deployed success", newTokenERC20DAddress);

        const CrowdsaleAddress = await deployer.deploy(Crowdsale);
        await console.log("Crowdsale deployed success", CrowdsaleAddress);

        const MultiSigWalletDAddress = await deployer.deploy(MultiSigWallet);
        await console.log("MultiSigWallet deployed success", MultiSigWalletDAddress);

        const MigrationsAddress = await deployer.deploy(Migrations);
        await console.log("Migrations deployed success", MigrationsAddress);

        const MigrationAgentAddress = await deployer.deploy(MigrationAgent);
        await console.log("MigrationAgent deployed success", MigrationAgentAddress);

        const tokenSet = await CrowdsaleAddress.setTokenUsedAsReward(TokenERC20DAddress.address)
        await console.log("TokenERC20 set to Crowdsale success", tokenSet);

        const multisigSet = await CrowdsaleAddress.setMultisig(MultiSigWalletDAddress.address)
        await console.log("MultiSigWallet set to Crowdsale success", multisigSet);

        const crowdAddressSet = await MultiSigWalletDAddress.setCrowdSaleContractAddress(CrowdsaleAddress.address)
        await console.log("Crowdsale set to MultiSigWallet success", crowdAddressSet);

        const crowdSaleInited = await CrowdsaleAddress.init()
        await console.log("Crowdsale init success", crowdSaleInited);

        await console.log("DONE -- !!!!!!!!!!!!!!!!!!!1 -- DONE");
        return true;

    } catch (e) {
        console.log("Not deployed" + e.message);
    }
};
