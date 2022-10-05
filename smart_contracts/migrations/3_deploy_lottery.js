var Draw = artifacts.require('./lottery/Draw.sol')
var Kassa = artifacts.require('./lottery/Kassa.sol')
var PrizePool = artifacts.require('./lottery/PrizePool.sol')
var TicketSale = artifacts.require('./lottery/TicketSale.sol')

var LotteryIncomeWallet = artifacts.require('./LotteryIncomeWallet.sol')
var TokenERC721 = artifacts.require('./TokenERC721.sol')

module.exports = async function(deployer) {
  try {

    var draw, kassa, pool, sale, income, ticket

    deployer.deploy(TokenERC721).then(function (i) {
      ticket = i // get instance of TokenERC721
      console.log('TokenERC721 deployed success, address: ', ticket.address)

      return deployer.deploy(LotteryIncomeWallet).then(function (i) {
        income = i // get instance of LotteryIncomeWallet
        console.log('LotteryIncomeWallet deployed success, address: ', income.address)

        return deployer.deploy(TicketSale).then(function (i) {
          sale = i // get instance of TicketSale
          console.log('TicketSale deployed success, address: ', sale.address)

          return deployer.deploy(PrizePool).then(function (i) {
            pool = i // get instance of PrizePool
            console.log('PrizePool deployed success, address: ', pool.address)

            return deployer.deploy(Kassa).then(function (i) {
              kassa = i // get instance of Kassa
              console.log('Kassa deployed success, address: ', kassa.address)

              return deployer.deploy(Draw).then(function (i) {
                draw = i // get instance of Draw
                console.log('Draw deployed success, address:', draw.address)

                // draw
                // return draw.setCronAddress(cron).then(function (i) {
                //   console.log('Draw setCronAddress')

                return draw.setKassaAddress(kassa.address).then(function (i) {
                  console.log('Draw setKassaAddress')

                return draw.setWalletAddress(income.address).then(function (i) {
                  console.log('Draw setWalletAddress')

                  //kassa
                  return kassa.setPrizePoolAddress(pool.address).then(function (i) {
                    console.log('kassa setPrizePoolAddress')

                    return kassa.setDrawAddress(draw.address).then(function (i) {
                      console.log('kassa setDrawAddress')

                      return kassa.setToken712Address(ticket.address).then(function (i) {
                        console.log('kassa setToken712Address')

                        //pool
                        return pool.setKassaContractAddress(kassa.address).then(function (i) {
                          console.log('pool setKassaContractAddress')

                          return pool.setLotteryDrawContractAddress(draw.address).then(function (i) {
                            console.log('pool setLotteryDrawContractAddress')

                            //sale
                            return sale.setTicket(ticket.address).then(function (i) {
                              console.log('sale setTicket')

                              return sale.setPrizePool(pool.address).then(function (i) {
                                console.log('sale setPrizePool')

                                return sale.setIncomeWallet(income.address).then(function (i) {
                                  console.log('sale setIncomeWallet')

                                  return sale.setLotteryDraw(draw.address).then(function (i) {
                                    console.log('sale setLotteryDraw')

                                    // todo: set price
                                    var price = web3.utils.toWei('0.5'); // 0.5 ETH
                                    return sale.setPrice(price).then(function (i) {
                                      console.log('sale setPrice')

                                      //ticket
                                      return ticket.setAddressOfContractTicketsSale(sale.address).then(function (i) {
                                        console.log('ticket setAddressOfContractTicketsSale')

                                        return ticket.setAddressOfContractDraw(draw.address).then(function (i) {
                                          console.log('ticket setAddressOfContractDraw')

                                            return ticket.setAddressOfContractKassa(kassa.address).then(function (i) {
                                                console.log('ticket setAddressOfContractKassa')

                                                //income
                                              return income.setToken(ticket.address).then(function (i) {
                                                console.log('income setToken')

                                                return income.setDraw(draw.address).then(function (i) {
                                                    console.log('income setDraw')

                                                    /*return income.setToken(draw.address).then(function (i) {
                                                    console.log('income setDraw')*/

                                                    console.log('DONE -- DEPLOY lottery -- DONE')
                                                    console.log('please add this to smart_contracts/conract_addresses.js file')

                                                    console.log( "draw: '" + draw.address + "',");
                                                    console.log( "kassa: '" + kassa.address + "',");
                                                    console.log( "prizePool: '" + pool.address + "',");
                                                    console.log( "ticketSale: '" + sale.address + "',");
                                                    console.log( "incomeWallet: '" + income.address + "',");
                                                    console.log( "tokenERC721: '" + ticket.address + "',");
                                                })
                                                })
                                            })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })

              })

            })
          })
        })
      })
    })
    // })

  } catch (e) {
    console.log('Not deployed', e.message)
  }
}
