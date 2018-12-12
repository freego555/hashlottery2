var Draw = artifacts.require('./lottery/Draw.sol')
var Kassa = artifacts.require('./lottery/Kassa.sol')
var PrizePool = artifacts.require('./lottery/PrizePool.sol')
var TicketSale = artifacts.require('./lottery/TicketSale.sol')
var TokenERC721 = artifacts.require('./TokenERC721.sol')
var TokenERC20 = artifacts.require('./TokenERC20.sol')
var LotteryIncomeWallet = artifacts.require('./LotteryIncomeWallet.sol')

var tokenAddress = TokenERC20.address

module.exports = async function (deployer) {
  try {
    //draw
    Draw.setKassaAddress(Kassa.address).then(function (i) {
      console.log('Draw setKassaAddress')

      //kassa
      return Kassa.setDrawAddress(draw.address).then(function (i) {
        console.log('kassa setDrawAddress')

        //pool
        return PrizePool.setLotteryDrawContractAddress(draw.address).then(function (i) {
          console.log('pool setLotteryDrawContractAddress')

          //sale
          return TicketSale.setLotteryDraw(draw.address).then(function (i) {
            console.log('sale setLotteryDraw')

            //ticket
            return TokenERC721.setAddressOfContractDraw(draw.address).then(function (i) {
              console.log('ticket setAddressOfContractDraw')

              //price
              // todo: set price
              // var price = web3.toWei(0.001)
              var price = 500000000000000000 // 0.5 ETH
              return TicketSale.setPrice(price).then(function (i) {

                //sale
                return TicketSale.setIncomeWallet(LotteryIncomeWallet.address).then(function (i) {
                  console.log('sale setIncomeWallet')

                  //income
                  return LotteryIncomeWallet.setToken(tokenAddress).then(function (i) {
                    console.log('income setToken')

                    return LotteryIncomeWallet.setDraw(Draw.address).then(function (i) {
                      console.log('income setDraw')

                      console.log('DONE -- DEPLOY lottery -- DONE')
                      console.log('please add this to smart_contracts/conract_addresses.js file')

                    })
                  })
                })
              })

            })
          })
        })
      })
    })
  } catch (e) {
    console.log('Not deployed' + e.message)
  }
}
