var LotteryIncomeWallet = artifacts.require('./LotteryIncomeWallet.sol')

module.exports = async function(deployer) {
  try {
    deployer.deploy(LotteryIncomeWallet).then(function (i) {
      console.log('LotteryIncomeWallet deployed success, address: ', i.address)
    })
  } catch (e) {
    console.log('Not deployed' + e.message)
  }
}
