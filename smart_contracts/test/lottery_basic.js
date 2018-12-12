var Draw = artifacts.require('./lottery/Draw.sol')
var Kassa = artifacts.require('./lottery/Kassa.sol')
var PrizePool = artifacts.require('./lottery/PrizePool.sol')
var TicketSale = artifacts.require('./lottery/TicketSale.sol')

var LotteryIncomeWallet = artifacts.require('./LotteryIncomeWallet.sol')
var TokenERC721 = artifacts.require('./TokenERC721.sol')

var Crowdsale = artifacts.require("./Crowdsale.sol");
var TokenERC20 = artifacts.require("./TokenERC20.sol");

const helper = require('./helpers/truffleTestHelper')

contract('ICO', async (accounts) => {
    var adminAddress = accounts[0];
    var investor1Address = accounts[6];
    var investor2Address = accounts[7];
    var investor3Address = accounts[8];

    before(async () => {
          token = await TokenERC20.deployed();
    })

    describe('Mint tokens for investors', async() => {
        it('Mint tokens for investors', async() => {
            await token.emitMoreTokens(10000, investor1Address, {from: adminAddress});
            await token.emitMoreTokens(20000, investor2Address, {from: adminAddress});
            await token.emitMoreTokens(70000, investor3Address, {from: adminAddress});

            let balance1 = await token.balanceOf(investor1Address);
            //console.log('balance1 = ' + balance1);
            let balance2 = await token.balanceOf(investor2Address);
            //console.log('balance2 = ' + balance2);
            let balance3 = await token.balanceOf(investor3Address);
            //console.log('balance3 = ' + balance3);

            assert.isTrue((+balance1 + +balance2 + +balance3) == 100000);
        })
    })
})

contract('Lottery basic', async (accounts) => {
  var draw, kassa, pool, sale, income, ticket
  var crowdsale, token

  var adminAddress = accounts[0];
  var cronAddress = accounts[1];
  var player1Address = accounts[2];
  var player2Address = accounts[3];
  var player3Address = accounts[4];
  var player4Address = accounts[5];
  var investor1Address = accounts[6];
  var investor2Address = accounts[7];
  var investor3Address = accounts[8];
  var zeroAddress = '0x0000000000000000000000000000000000000000';

  var priceOfTicket;

  describe('lottery general', async () => {

    before(async () => {

      draw = await Draw.deployed()
      kassa = await Kassa.deployed()
      pool = await PrizePool.deployed()
      sale = await TicketSale.deployed()
      income = await LotteryIncomeWallet.deployed()
      ticket = await TokenERC721.deployed()

      crowdsale = await Crowdsale.deployed();
      token = await TokenERC20.deployed();

      // for init
      await draw.setCronAddress(cronAddress)

      priceOfTicket = await sale.price();

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

    describe('Check init of LotteryIncomeWallet', async () => {
        it('Address of contract Draw should be set', async () => {
            let drawContractAddress = await income.drawContractAddress();
            assert.isTrue(drawContractAddress != zeroAddress);
        })

        it('Address of contract TokenERC20 should be set', async () => {
            let tokenERC20Address = await income.tokenERC20Address();
            assert.isTrue(tokenERC20Address != zeroAddress);
        })
    })

    describe('Check init of TokenERC721', async () => {
        it('Address of contract Draw should be set', async () => {
            let addressOfContractDraw = await ticket.addressOfContractDraw();
            assert.isTrue(addressOfContractDraw != zeroAddress);
        })

        it('Address of contract TicketSale should be set', async () => {
            let addressOfContractTicketsSale = await ticket.addressOfContractTicketsSale();
            assert.isTrue(addressOfContractTicketsSale != zeroAddress);
        })

        it('Address of contract Kassa should be set', async () => {
            let addressOfContractKassa = await ticket.addressOfContractKassa();
            assert.isTrue(addressOfContractKassa != zeroAddress);
        })
    })

    describe('Sale of tickets', async () => {
        it('Start of sale of tickets', async () => {
            await draw.startSelling({from: cronAddress});
            let currentDrawId = await draw.currentDrawId();

            assert.isTrue(currentDrawId == 1);
        })

        it('Setting stage TicketsSale', async () => {
            await draw.setStageTicketsSale({from: adminAddress});
            let currentStage = await draw.stageOfCurrentDraw();

            assert.isTrue(currentStage == 11);
        })

        describe('Player1 buy 1 ticket', async () => {
            it('Player1 buy 1 ticket', async () => {
                /*console.log('priceOfTicket = ' + priceOfTicket);
                console.log('player1Address = ' + player1Address);
                console.log('drawContractAddress = ' + await income.drawContractAddress());*/
                await sale.buy({from: player1Address, value: priceOfTicket.toString(10)});
            })

            it('balanceOf = 1', async () => {
                let amountOfTickets = await ticket.balanceOf(player1Address);
                assert.isTrue(amountOfTickets == 1);
            })

            it('ticketId = 1', async () => {
                let ticketId = await ticket.tokenOfOwnerByIndex(player1Address, 0);
                assert.isTrue(ticketId == 1);
            })

            it('balanceOfLotteryIncome is 10% from price of ticket', async () => {
                let balanceOfLotteryIncome = await web3.eth.getBalance(income.address);
                /*console.log('priceOfTicket.times(0.1) = ' + priceOfTicket.times(0.1));
                console.log('balanceOfLotteryIncome = ' + balanceOfLotteryIncome);*/
                assert.isTrue(balanceOfLotteryIncome.comparedTo(priceOfTicket.times(0.1)) == 0);
            })

            it('balanceOfPrizePool is 90% from price of ticket', async () => {
                let balanceOfPrizePool = await web3.eth.getBalance(pool.address);
                //console.log('priceOfTicket.times(0.9) = ' + priceOfTicket.times(0.9));
                assert.isTrue(balanceOfPrizePool.comparedTo(priceOfTicket.times(0.9)) == 0);
            })
        })

        describe('Player1 filled the ticket #1', async () => {
            it('Filling of ticket #1 is succesful', async () => {
                let ticketId = 1;
                let numbers = [11, 22, 33];
                let salt = 123;
                let numbersHash = [];
                for (let i = 0; i < 3; i++) {
                    numbersHash.push(await draw.hashVal(numbers[i], salt));
                }
                /*console.log('hash of 1 number = ' + numbersHash[0]);
                console.log('hash of 2 number = ' + numbersHash[1]);
                console.log('hash of 3 number = ' + numbersHash[2]);*/
                await ticket.fillCombinationOfTicket(ticketId, numbersHash, {from: player1Address});
            })

            it('combinationOfTicket is correct', async () => {
                let ticketId = 1;
                let hash1 = '0x252ac694d08d2760b5f6b3a44bb08769e3c9ac86baac29cba96f660db0abc624';
                let hash2 = '0x5b2f4ba2eb8931310f2bb5dcba03ff7d4dd4ddcfe3bd6192d4dc0f6063503087';
                let hash3 = '0xb8519ee7f06eb5e9adfc18c511ffd081b448f906ff9a2654731d425b62097841';

                let numbersHash = await ticket.getTicketCombination(ticketId);

                assert.isTrue(numbersHash[0] == hash1 && numbersHash[1] == hash2 && numbersHash[2] == hash3);
            })

            it('status of ticket is correct', async () => {
                let ticketId = 1;
                let expectedStatus = 1; // Filled

                let status = await ticket.getTicketStatus(ticketId);

                assert.isTrue(status == expectedStatus);
            })
        })

        /*describe('Player1 filled the ticket #1', async () => {
            it('Player1 filled the ticket #1', async () => {
            })
        })*/
    })

    describe('Draw, accepting requests and distributing of prize pool', async () => {
        it('Setting stage WaitingDraw', async () => {
            await draw.setStageWaitingDraw({from: adminAddress});
            let currentStage = await draw.stageOfCurrentDraw();

            assert.isTrue(currentStage == 20);
        })

        it('Start of draw', async () => {
            let randomNumbers = [11, 22, 33];
            await draw.startDraw(randomNumbers, {from: cronAddress});

            let currentDrawId = await draw.currentDrawId();
            //let winnersNumbers = await draw.winnersNumbers(currentDrawId.toString(10));
            let winnersNumbers = await draw.getWinnersNumbers(currentDrawId.toString(10));

            let isEqual = true;
            for (let i = 0; i < 3; i++) {
                if (randomNumbers.length != winnersNumbers.length || randomNumbers[i] != winnersNumbers[i]) {
                    isEqual = false;
                    break;
                }
            }

            assert.isTrue(isEqual);
        })

        it('Setting stage ContinueAcceptingRequests', async () => {
            await draw.setStageContinueAcceptingRequests({from: adminAddress});
            let currentStage = await draw.stageOfCurrentDraw();

            assert.isTrue(currentStage == 22);
        })

        describe('Player1 add new request', async () => {
            it('Player1 add new request', async () => {
                let ticketId = 1;
                let numbers = [11, 22, 33];
                let salt = 123;

                await kassa.addNewRequest(ticketId, numbers, salt, {from: player1Address});
            })

            it('winnersListExists(drawId, playerAddress) should be true', async () => {
                let currentDrawId = await draw.currentDrawId();
                isRequestExist = await kassa.winnersListExists(currentDrawId, player1Address);

                assert.isTrue(isRequestExist);
            })

            it('winnersCount(drawId) should be 1', async () => {
                let currentDrawId = await draw.currentDrawId();
                amountOfWinners = await kassa.winnersCount(currentDrawId);

                assert.isTrue(amountOfWinners == 1);
            })
        })

        describe('Setting stage WaitingDistributingOfPrizePool', async () => {
            it('Setting stage WaitingDistributingOfPrizePool', async () => {
                await draw.setStageWaitingDistributingOfPrizePool({from: adminAddress});
                let currentStage = await draw.stageOfCurrentDraw();

                assert.isTrue(currentStage == 30);
            })
        })

        describe('Distributing of prize pool', async () => {
            it('Distributing of prize pool', async () => {
                let fromIndex = 0;
                let count = 1;

                await draw.startWithdraws(fromIndex, count, {from: cronAddress});
            })

            it('fullyDistributedPrize(drawId) should be true', async () => {
                let currentDrawId = await draw.currentDrawId();
                isDistribute = await kassa.fullyDistributedPrize(currentDrawId);

                assert.isTrue(isDistribute);
            })

            it('isGivenShare(drawId, playerAddress) should be true', async () => {
                let currentDrawId = await draw.currentDrawId();
                isGiven = await kassa.isGivenShare(currentDrawId, player1Address);

                assert.isTrue(isGiven);
            })

            it('moneyForEachWinner(drawId) should more than 0', async () => {
                let currentDrawId = await draw.currentDrawId();
                moneyForEachWinner = await kassa.moneyForEachWinner(currentDrawId.toString(10));

                assert.isTrue(moneyForEachWinner.toString(10) > 0);
            })

            it('poolSizes(drawId) should more than 0', async () => {
                let currentDrawId = await draw.currentDrawId();
                poolSizes = await kassa.poolSizes(currentDrawId.toString(10));

                assert.isTrue(poolSizes.toString(10) > 0);
            })
        })

        describe('Setting stage vacation', async () => {
            it('Setting stage vacation', async () => {
                await draw.setStageVacation({from: adminAddress});
                let currentStage = await draw.stageOfCurrentDraw();

                assert.isTrue(currentStage == 40);
            })
        })

        describe('Withdraw prize', async () => {
            it('Withdraw prize', async () => {
                let currentDrawId = await draw.currentDrawId();
                let poolSize = await kassa.poolSizes(currentDrawId.toString(10));

                let beforeBalanceOfPlayer1 = await web3.eth.getBalance(player1Address);
                await kassa.withdrawPrize(poolSize.toString(10), {from: player1Address});
                let afterBalanceOfPlayer1 = await web3.eth.getBalance(player1Address);

                //assert.isTrue(afterBalanceOfPlayer1 > beforeBalanceOfPlayer1);
            })

            it('winnersMoney(player1Address) should be 0', async () => {
                amount = await kassa.winnersMoney(player1Address);
                //console.log(amount.toString(10));

                assert.isTrue(amount.toString(10) == 0);
            })

            it('reservedMoney in pool should be 0', async () => {
                reservedMoney = await pool.reservedMoney();

                assert.isTrue(reservedMoney.toString(10) == 0);
            })
        })
        /*describe('Start of draw', async () => {
            it('Start of draw', async () => {
            })
        })*/
    })

  })




})
