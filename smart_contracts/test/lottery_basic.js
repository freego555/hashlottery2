var Draw = artifacts.require('./lottery/Draw.sol')
var Kassa = artifacts.require('./lottery/Kassa.sol')
var PrizePool = artifacts.require('./lottery/PrizePool.sol')
var TicketSale = artifacts.require('./lottery/TicketSale.sol')

var LotteryIncomeWallet = artifacts.require('./LotteryIncomeWallet.sol')
var TokenERC721 = artifacts.require('./TokenERC721.sol')

const helper = require('./helpers/truffleTestHelper')

contract('Lottery basic', async (accounts) => {
  var draw, kassa, pool, sale, income, ticket

  var cronAddress = accounts[1];


  describe('lottery general', async () => {

    before(async () => {

      draw = await Draw.deployed()
      kassa = await Kassa.deployed()
      pool = await PrizePool.deployed()
      sale = await TicketSale.deployed()
      income = await LotteryIncomeWallet.deployed()
      ticket = await TokenERC721.deployed()

      // for init
      await draw.setCronAddress(cronAddress)

    })

    describe('Is init complete', async () => {
      it('draw', async () => {
          assert.isTrue(await draw.initComplete())
      })
      it('kassa', async () => {
        assert.isTrue(await kassa.initComplete())
      })
      it('prize pool', async () => {
        assert.isTrue(await pool.initComplete())
      })
      it('sale', async () => {

        await sale.setInitIfComplete();
        let complete = await sale.initComplete();
        console.log('complete', complete);
        if(!complete){
          console.log('tokenERC721Address:', await sale.tokenERC721Address() )
          console.log('prizePoolAddress:', await sale.prizePoolAddress() )
          console.log('lotteryIncomeWalletAddress:', await sale.lotteryIncomeWalletAddress() )
          console.log('lotteryDrawAddress:', await sale.lotteryDrawAddress() )
        }
        assert.isTrue(complete)
      })
      //todo: LotteryIncomeWallet

    })

  })




})
