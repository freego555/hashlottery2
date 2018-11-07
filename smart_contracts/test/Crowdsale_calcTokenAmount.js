var Crowdsale = artifacts.require('./Crowdsale.sol')

const helper = require('./helpers/truffleTestHelper')

contract('Crowdsale > calcTokenAmount', async (accounts) => {

  var price = web3.toWei(0.25)
  var tokens_buyed, tokens_bonus, change
  var crowdsale
  var money
  var maxAmountForSale

  describe('Pre Calc for interface', async () => {

    before(async () => {

      crowdsale = await Crowdsale.deployed()
      maxAmountForSale = await crowdsale.amountTokensForSale()
      // let money = Math.floor(20 * price)
      // console.log('money', money);
      // [tokens_buyed, tokens_bonus, change] = await crowdsale.calcTokenAmount(money, true)
    })

    describe('general', async () => {
      it('maxAmountForSale>0', async () => {
        assert.isTrue(maxAmountForSale > 0)
      })
    })

    describe('not enought money for 1 token', async () => {

      before(async () => {
        money = Math.floor(price / 2);
        [tokens_buyed, tokens_bonus, change, ] = await crowdsale.calcTokenAmount(money, true)
        //todo: check that countOfFirstBuyers is 0
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 0)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10), 0)
      })

      it('change', async () => {
        assert.equal(change.toString(10), money)
      })

      //todo: check that countOfFirstBuyers is not changed

    })

    describe('first 20 tokens: no bonus program', async () => {

      before(async () => {
        money = Math.floor(20 * price);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, true)
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 20)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10), 0)
      })

      it('change', async () => {
        assert.equal(change.toString(10), 0)
      })

    })

    describe('110 tokens : bonus #3', async () => {

      before(async () => {
        money = Math.floor(110 * price);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, true)
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 110)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10), 1)
      })

      it('change', async () => {
        assert.equal(change.toString(10), 0)
      })

    })

    describe('too much tokens: over amountTokensForSale : only bonus #3', async () => {

      var expected_bonus3,
        expected_buyed,
        expected_change

      before(async () => {

        money = Math.floor(maxAmountForSale * price);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, true)

        expected_bonus3 = Math.floor(maxAmountForSale / 100)
        expected_buyed = maxAmountForSale - expected_bonus3
        expected_bonus3 = Math.floor(expected_buyed / 100)
        expected_change = money - price * expected_buyed

      })

      it('buyed equals amountTokensForSale', async () => {
        // let sum=add(tokens_buyed ,tokens_bonus);
        let sum = (+tokens_buyed) + (+tokens_bonus)
        console.log('sum', sum)
        console.log('maxAmountForSale', maxAmountForSale.toString(10))
        assert.isTrue(sum.toString(10) <= maxAmountForSale)
      })

      it('tokens buyed', async () => {
        console.log('expected_buyed', tokens_buyed.toString(10))
        assert.equal(tokens_buyed.toString(10), expected_buyed)
      })

      // todo: fix the bug
      // it('tokens_bonus', async () => {
      //   assert.equal(tokens_bonus.toString(10), expected_bonus3)
      // })
      //
      // todo: fix the bug
      // it('change', async () => {
      //   assert.equal(change.toString(10), expected_change)
      // })

    })

  })

  describe('Payable mode', async () => {

    before(async () => {

      crowdsale = await Crowdsale.deployed()
      maxAmountForSale = await crowdsale.amountTokensForSale()
      // let money = Math.floor(20 * price)
      // console.log('money', money);
      // [tokens_buyed, tokens_bonus, change] = await crowdsale.calcTokenAmount(money, false)
    })


    describe('not enought money for 1 token, even with discount', async () => {

      before(async () => {
        money = Math.floor(price / 2);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, false)
        //todo: check that countOfFirstBuyers is 0
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 0)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10), 0)
      })

      it('change', async () => {
        assert.equal(change.toString(10), money)
      })

      //todo: check that countOfFirstBuyers is not changed

    })

    describe('not enought money for 1 token, but ok with discount of bonus #1', async () => {

      before(async () => {
        money = price - 10;
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, false)
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 1)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10), 0)
      })

      it('change', async () => {
        assert.equal(change.toString(10), money-Math.floor(price*9/10))
      })

    })


    describe('first 20 tokens: bonus #1+2 ', async () => {

      before(async () => {
        money = Math.floor(20 * price);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, false);
        console.log('money:',money);
        console.log('tokens_buyed',tokens_buyed.toString(10));
        console.log('tokens_bonus', tokens_bonus.toString(10));
        console.log('change', change.toString(10));
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 22)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10), 4)
      })

      it('change', async () => {

        assert.equal(change.toString(10), 50000000000000000)
      })

    })

    describe('110 tokens : bonus #1+2+3', async () => {

      before(async () => {
        money = Math.floor(110 * price);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, false)
        console.log('money:',money);
        console.log('tokens_buyed',tokens_buyed.toString(10));
        console.log('tokens_bonus', tokens_bonus.toString(10));
        console.log('change', change.toString(10));
      })

      it('tokens buyed', async () => {
        assert.equal(tokens_buyed.toString(10), 122)
      })

      it('tokens_bonus', async () => {
        assert.equal(tokens_bonus.toString(10),25)
      })

      it('change', async () => {
        assert.equal(change.toString(10), 50000000000000000)
      })

    })
    
    describe('too much tokens: over amountTokensForSale : only bonus #3', async () => {

      var expected_bonus3,
        expected_buyed,
        expected_change

      before(async () => {

        money = Math.floor(maxAmountForSale * price);
        [tokens_buyed, tokens_bonus, change,] = await crowdsale.calcTokenAmount(money, false)

        expected_bonus3 = Math.floor(maxAmountForSale / 100)
        expected_buyed = maxAmountForSale - expected_bonus3
        expected_bonus3 = Math.floor(expected_buyed / 100)
        expected_change = money - price * expected_buyed

      })

      it('buyed equals amountTokensForSale', async () => {
        // let sum=add(tokens_buyed ,tokens_bonus);
        let sum = (+tokens_buyed) + (+tokens_bonus)
        console.log('sum', sum)
        console.log('maxAmountForSale', maxAmountForSale.toString(10))
        assert.isTrue(sum.toString(10) <= maxAmountForSale)
      })

      //todo: fix the bug
      // it('tokens buyed', async () => {
      //   console.log('expected_buyed', tokens_buyed.toString(10))
      //   assert.equal(tokens_buyed.toString(10), expected_buyed)
      // })

      // todo: fix the bug
      // it('tokens_bonus', async () => {
      //   assert.equal(tokens_bonus.toString(10), expected_bonus3)
      // })
      //
      // todo: fix the bug
      // it('change', async () => {
      //   assert.equal(change.toString(10), expected_change)
      // })

    })

  })
})
