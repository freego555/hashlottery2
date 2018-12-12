var Kassa = artifacts.require('./lottery/Kassa.sol')
var PrizePool = artifacts.require('./lottery/PrizePool.sol')
var TicketSale = artifacts.require('./lottery/TicketSale.sol')
var TokenERC721 = artifacts.require('./TokenERC721.sol')

var kassa, pool, sale, ticket

module.exports = async function (deployer) {
  try {

    deployer.deploy(TokenERC721).then(function (i) {
      ticket = i // get instance of TokenERC721
      console.log('TokenERC721 deployed success')
      console.log('deployer', deployer)

      return deployer.deploy(TicketSale).then(function (i) {
        sale = i // get instance of TicketSale
        console.log('TicketSale deployed success')

        return deployer.deploy(PrizePool).then(function (i) {
          pool = i // get instance of PrizePool
          console.log('PrizePool deployed success')

          return deployer.deploy(Kassa).then(function (i) {
            kassa = i // get instance of Kassa
            console.log('Kassa deployed success')

            //kassa
            return kassa.setPrizePoolAddress(pool.address).then(function (i) {
              console.log('kassa setPrizePoolAddress')

              return kassa.setToken712Address(ticket.address).then(function (i) {
                console.log('kassa setToken712Address')

                //pool
                return pool.setKassaContractAddress(kassa.address).then(function (i) {
                  console.log('pool setKassaContractAddress')

                  //sale
                  return sale.setTicket(ticket.address).then(function (i) {
                    console.log('sale setTicket')

                    return sale.setPrizePool(pool.address).then(function (i) {
                      console.log('sale setPrizePool')

                        //ticket
                        return ticket.setAddressOfContractTicketsSale(sale.address).then(function (i) {
                          console.log('ticket setAddressOfContractTicketsSale')

                          return ticket.setAddressOfContractKassa(kassa.address).then(function (i) {
                            console.log('ticket setAddressOfContractKassa')

                            console.log('DONE -- DEPLOY lottery -- DONE')
                            console.log('please add this to smart_contracts/conract_addresses.js file')

                            console.log("kassa: '" + kassa.address + "',");
                            console.log("prizePool: '" + pool.address + "',");
                            console.log("ticketSale: '" + sale.address + "',");
                            console.log("tokenERC721: '" + ticket.address + "',");
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
  } catch (e) {
    console.log('Not deployed' + e.message)
  }
}
