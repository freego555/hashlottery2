import DrawJSON from '../../smart_contracts/build/contracts/Draw'
import KassaJSON from '../../smart_contracts/build/contracts/Kassa'
import PrizePoolJSON from '../../smart_contracts/build/contracts/PrizePool'
import TicketSaleJSON from '../../smart_contracts/build/contracts/TicketSale'
import LotteryIncomeWalletJSON from '../../smart_contracts/build/contracts/LotteryIncomeWallet'
import TokenERC721JSON from '../../smart_contracts/build/contracts/TokenERC721'

Date.prototype.hhmm = function () {
  var hh = this.getHours()
  var mm = this.getMinutes()

  return [
    (hh > 9 ? '' : '0') + hh,
    (mm > 9 ? '' : '0') + mm
  ].join('-')
}

class Lottery {

  constructor (thisWeb3, addresses, walletAccountSaved) {
    this.web3 = thisWeb3
    this.addresses = addresses
    this.wallet = walletAccountSaved
  }

//------------------------------------------------------------------------------------------------------------------//
  async initContracts () {

    this.Draw = await new this.web3.eth.Contract(DrawJSON.abi, this.addresses.draw)
    this.Kassa = await new this.web3.eth.Contract(KassaJSON.abi, this.addresses.kassa)
    this.PrizePool = await new this.web3.eth.Contract(PrizePoolJSON.abi, this.addresses.prizePool)
    this.TicketSale = await new this.web3.eth.Contract(TicketSaleJSON.abi, this.addresses.ticketSale)
    this.LotteryIncomeWallet = await new this.web3.eth.Contract(LotteryIncomeWalletJSON.abi, this.addresses.incomeWallet)
    this.TokenERC721 = await new this.web3.eth.Contract(TokenERC721JSON.abi, this.addresses.tokenERC721)

  }

//------------------------------------------------------------------------------------------------------------------//
  async router (path) {
    await this.initContracts()
    var routes = new Array()

    routes['/lottery/mainPage.html'] = 'mainPage'
    routes['/lottery/identification-page.html'] = 'identificationPage'
    routes['/lottery/list-tickets.html'] = 'listTickets'

    routes['/lottery/buy-ticket.html'] = 'buyTicket'
    routes['/lottery/success-buy-ticket.html'] = 'successBuyTicket'

    routes['/lottery/fill-ticket.html'] = 'fillTicket'
    routes['/lottery/success-screen.html'] = 'successScreen'

    routes['/lottery/getting-winnings.html'] = 'gettingWinnings'
    routes['/lottery/confirmation-winning.html'] = 'confirmationWinning'

    routes['/lottery/history.html'] = 'historyList'
    routes['/lottery/confirmation-application.html'] = 'confirmationApplication'

    routes['/lottery/make-request.html'] = 'makeRequest'

    routes['/lottery/error.html'] = 'error'

    try {
      this[routes[path]]()
    } catch (e) {
      console.log('error: route not found')
    }
  }

//------------------------------------------------------------------------------------------------------------------//
  async mainPage () {
    try {

      document.getElementById('draw_address').innerHTML = this.addresses.draw

      let stageCode = await this.Draw.methods.getStageOfCurrentDraw().call()
      let statuses = new Array()
      statuses[10] = 'ждем cron#1 для начала продаж'
      statuses[11] = 'продажа билетов 47 часов'
      statuses[12] = 'дозаполнение билетов, продавать уже нельзя, акции перемещать нельзя'

      statuses[20] = 'ждем cron#2 для розыгрыша'
      statuses[21] = 'начали прием заявок, акции перемещать нельзя'
      statuses[22] = 'продолжение приема заявок'

      statuses[30] = 'ждем cron#3 для подведения итогов и подсчета победителей'
      statuses[40] = 'перерыв между розыгрышами'

      let status
      try {
        status = statuses[stageCode]
      } catch (e) {
        status = 'error'
      }
      document.getElementById('current_draw_period').innerHTML = status

      // До следующего розыгрыша осталось
      if (stageCode == 10) {
        document.getElementById('next_draw_start_date').innerHTML = '?'
      } else {
        let nextDrawTimestamp = await this.Draw.methods.stopVacation().call()
        let next = new Date(parseInt(nextDrawTimestamp) * 1000)
        document.getElementById('next_draw_start_date').innerHTML = next.yyyymmdd()
      }

    } catch (e) {
      console.log('error: ' + e.message)
    }
  }

//------------------------------------------------------------------------------------------------------------------//
  async buyTicket () {
    // todo: fix jquery + countdown
    try {

      let isSelling = await this.Draw.methods.isSellingTicketPeriod().call()
      if (!isSelling) {
        alert('Сейчас не период продаж')
      }

      // окончание продаж
      let stopTimestamp = await this.Draw.methods.stopSelling().call()
      if (stopTimestamp > 0) {
        let stop = new Date(parseInt(stopTimestamp) * 1000)
        document.getElementById('clock').innerHTML = stop.yyyymmdd() + ' ' + stop.hhmm()
      } else {
        document.getElementById('clock').innerHTML = 'не определено'
      }

      //стоимость билета
      let priceWei = await this.TicketSale.methods.price().call()
      let priceEth = await this.web3.utils.fromWei(priceWei)
      document.getElementById('price_of_ticket').innerHTML = priceEth

      if (this.wallet) {
        document.getElementById('current_user_account').value = this.wallet.address
      } else {
        alert('please log in')
      }

      // подсчет
      let moneyInput = document.getElementById('money_amount')
      let ticketCountOutput = document.getElementById('ticket_count')
      let moneyEth
      moneyInput.addEventListener('change', e => {
        console.log('moneyInput change')
        moneyEth = parseInt(moneyInput.value)
        moneyInput.value = moneyEth
        ticketCountOutput.innerHTML = moneyEth / priceEth
      })

      //купить

      document.getElementById('buy_ticket').addEventListener('click', async function (e) {
        e.preventDefault()

        if (!isSelling) {
          alert('Сейчас не период продаж')
          return
        }

        if (moneyEth <= 0) {
          alert('moneyEth not set')
          return
        }

        const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
        let decrypted = await this.web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))

        let nonce = await this.web3.eth.getTransactionCount(decrypted.address),
          moneyWei = await  this.web3.utils.toWei(moneyEth)

        const transactionObj = {
          nonce: nonce,
          from: decrypted.address,
          gas: 900000,
          to: this.addresses.ticketSale,
          value: moneyWei,
        }

        var transaction = await decrypted.signTransaction(transactionObj)
        console.log('transaction,', transaction)

        this.web3.eth.sendSignedTransaction(transaction.rawTransaction)
          .on('transactionHash', (hash) => {
            console.log('transactionHash', hash)
          })
          .on('receipt', (receipt) => {
            console.log('receipt', receipt)
            sessionStorage.setItem('ticket_count', moneyEth / priceEth)
            window.location.href = '/lottery/success-buy-ticket.html'
          })

        return false

        //todo: alert the message if error
      })

    } catch (e) {
      console.log('error: ' + e.message)
    }
  }

//------------------------------------------------------------------------------------------------------------------//
  async successBuyTicket () {

    try {
      // выводим сколько было куплено билетов
      let count = sessionStorage.getItem('ticket_count')
      document.getElementById('tickets_count').innerHTML = count
    } catch (e) {
      console.log('error: ' + e.message)
    }
  }

//------------------------------------------------------------------------------------------------------------------//
  async confirmationApplication () {
    try {
      // выводим номер билета
      let ticketNumber = sessionStorage.getItem('ticket_number')
      document.getElementById('ticket_number').innerHTML = ticketNumber
    } catch (e) {
      console.log('error: ' + e.message)
    }

  }

//------------------------------------------------------------------------------------------------------------------//
  async fillTicket () {

    let isFilling = await this.Draw.methods.isFillingTicketPeriod().call()
    if (!isFilling) {
      alert('Сейчас не период заполнения билетов')
    }

    let num1 = document.getElementById('num1')
    let num2 = document.getElementById('num2')
    let num3 = document.getElementById('num3')
    let salt = document.getElementById('salt')

    // ввод чисел и соли
    num1.addEventListener('change', e => {
      num1.value = parseInt(num1.value)
    })
    num2.addEventListener('change', e => {
      num2.value = parseInt(num2.value)
    })
    num3.addEventListener('change', e => {
      num3.value = parseInt(num3.value)
    })
    //todo: salt min 10 символов
    salt.addEventListener('change', e => {
      salt.value = parseInt(salt.value)
    })

    document.getElementById('confirm').addEventListener('click', async function (e) {
      e.preventDefault()

      // if (!isSelling) {
      //   alert('Сейчас не период продаж')
      //   return
      // }
      let n1 = parseInt(num1.value)
      let n2 = parseInt(num2.value)
      let n3 = parseInt(num3.value)

      if (!(1 <= n1 && n1 <= 99
          && 1 <= n2 && n2 <= 99
          && 1 <= n3 && n3 <= 99)) {

        alert('Числа должны быть в промежутке 1..99')
      }

      if (salt.value.length < 10) {
        alert('Длина секретного ключа должна не менее 10 символов')
        return
      }

      // сортировка по ASC
      let salty = parseInt(salt.value)
      let numbers = [n1, n2, n3]
      numbers.sort(function (a, b) {return a - b})
      let hashed = new Array()
      for (let i = 0; i <= 2; i++) {
        hashed[i] = await this.Draw.methods.hashVal(numbers[i] + salty).call()
      }

      // send
      await this.Draw.methods.isSellingTicketPeriod().call()
      let token_id = 1

      const data = this.TokenERC721.methods.fillCombinationOfTicket(token_id, numbers).encodeABI()

      const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
      let decrypted = await this.web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))

      let nonce = await this.web3.eth.getTransactionCount(decrypted.address)

      const transactionObj = {
        nonce: nonce,
        from: decrypted.address,
        gas: 900000,
        to: this.addresses.tokenERC721,
        data: data
      }

      var transaction = await decrypted.signTransaction(transactionObj)
      console.log('transaction,', transaction)

      this.web3.eth.sendSignedTransaction(transaction.rawTransaction)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
        })
        .on('receipt', (receipt) => {
          console.log('receipt', receipt)
          //todo: set numbersOfTicketInDraw to local storage
          // window.location.href = '/lottery/success-screen.html'
        })

      return false

    })

  }

//------------------------------------------------------------------------------------------------------------------//
  async successScreen () {
//Success filling ticket // nothing to do
  }

//------------------------------------------------------------------------------------------------------------------//
  async gettingWinnings () {
//#prize_pool_size
    // #count_of_approved_requests
    // #your_prize_share
    // #confirm click
    // if success
    //   redirect to /lottery/confirmation-winning.html
  }

//------------------------------------------------------------------------------------------------------------------//
  async confirmationWinning () {
    // #prize_amount
    // #ticket_number
  }

//------------------------------------------------------------------------------------------------------------------//
  async historyList () {

    // in the template

    // p.drawId
    //   p.dateOfDraw
    // p.winningNumbers
    // p.prizePoolSize
    // p.winningAddresses
  }

//------------------------------------------------------------------------------------------------------------------//
  async identificationPage () {
    //todo: auth and save
  }

//------------------------------------------------------------------------------------------------------------------//
  async makeRequest () {

    // #current_user_account
    // #ticket_number
    // #winning_numbers ?, ?, ? () - from storage
    // #salt input
    // #prize_pool_size
    // #count_of_approved_requests

    // #confirm click
    // if success redirect to lottery/confirmation-application.html

    let current_user_account = document.getElementById('current_user_account')
    let ticket_number = document.getElementById('ticket_number')
    let winning_numbers = document.getElementById('winning_numbers')
    let salt = document.getElementById('salt')
    let prize_pool_size = document.getElementById('prize_pool_size')
    let count_of_approved_requests = document.getElementById('count_of_approved_requests')

    let contractTokenERC721 = this.TokenERC721;
    let contractKassa = this.Kassa;
    let contractDraw = this.Draw;
    let contractPrizePool = this.PrizePool;
    let web3 = this.web3;
    let addresses = this.addresses;
    let drawId = 0 //sessionStorage.getItem('drawId') //todo: get drawId from session storage
    let choosedTicket = ticket_number.value //sessionStorage.getItem('ticket_number') //todo: get ticket number from session storage

    let winningNumbers = ['?', '?', '?'] //sessionStorage.getItem('winning_numbers') //todo: get winning numbers from session storage
    let prizePool = await contractPrizePool.methods.prizePool().call()
    let winnersCount = await contractKassa.methods.winnersCount(drawId).call()

    // Set current_user_account
    current_user_account.innerHTML = this.wallet.address

    // Set ticket_number
    /*let choosedTicket = 1
    ticket_number.innerHTML = choosedTicket*/

    // Set winning_numbers
    /*let winningNumbers = new Array()
    winningNumbers[0] = 11 //todo: delete example
    winningNumbers[1] = 22
    winningNumbers[2] = 33*/
    winning_numbers.innerHTML = `${winningNumbers[0]}, ${winningNumbers[1]}, ${winningNumbers[2]}`

    // Set prize_pool_size
    prize_pool_size.innerHTML = prizePool

    // Set count_of_approved_requests
    count_of_approved_requests.innerHTML = winnersCount

    /*let numbersOfTicketInDraw = new Array()//JSON.parse(localStorage.getItem('numbersOfTicketInDraw')); //todo: get numbersOfTicketInDraw from local storage
    //numbersOfTicketInDraw = [[[[11,22,33]]]];
    numbersOfTicketInDraw[drawId] = [];
    numbersOfTicketInDraw[drawId][choosedTicket] = [];
    numbersOfTicketInDraw[drawId][choosedTicket][0] = 11; //todo: delete example
    numbersOfTicketInDraw[drawId][choosedTicket][1] = 22;
    numbersOfTicketInDraw[drawId][choosedTicket][2] = 33;
    console.log(numbersOfTicketInDraw);
    console.log(numbersOfTicketInDraw[drawId][choosedTicket]);*/

    ticket_number.addEventListener('change', async function (e) {
        e.preventDefault();

        choosedTicket = ticket_number.value

        let dataOfTicket = await contractTokenERC721.methods.getDataOfTicket(choosedTicket).call()
        drawId = +dataOfTicket._drawId
        console.log('dataOfTicket = ' + dataOfTicket)

        try {
            winningNumbers[0] = await contractDraw.methods.winnersNumbers(drawId, 0).call()
            winningNumbers[1] = await contractDraw.methods.winnersNumbers(drawId, 1).call()
            winningNumbers[2] = await contractDraw.methods.winnersNumbers(drawId, 2).call()
            console.log('winningNumbers = ' + winningNumbers)
        } catch(e) {
            console.log('error: ' + e.message)
        }
        winning_numbers.innerHTML = `${winningNumbers[0]}, ${winningNumbers[1]}, ${winningNumbers[2]}`

        winnersCount = await contractKassa.methods.winnersCount(drawId).call()
        count_of_approved_requests.innerHTML = winnersCount

        prizePool = await contractPrizePool.methods.prizePool().call()
        prize_pool_size.innerHTML = prizePool
    })

    salt.addEventListener('change', function (e) {
        salt.value = parseInt(salt.value)
    })

    // Send request
    document.getElementById('confirm').addEventListener('click', async function (e) {
        e.preventDefault();

        const data = contractKassa.methods.addNewRequest(choosedTicket, winningNumbers, salt.value).encodeABI()

        const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
        let decrypted = await web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))

        let nonce = await web3.eth.getTransactionCount(decrypted.address)

        const transactionObj = {
            nonce: nonce,
            from: decrypted.address,
            gas: 900000,
            to: addresses.kassa,
            value: 0,
            data
        }

        var transaction = await decrypted.signTransaction(transactionObj)
        console.log('transaction,', transaction)

        web3.eth.sendSignedTransaction(transaction.rawTransaction)
            .on('transactionHash', (hash) => {
                console.log('transactionHash', hash)
            })
            .on('receipt', (receipt) => {
                console.log('receipt', receipt)
                window.location.pathname = '/lottery/confirmation-application.html'
            })
    })

    // Cancel request
    document.getElementById('reset').addEventListener('click', async function (e) {
        if(confirm('Вернуться к списку билетов?')) {
            window.location.pathname = '/lottery/list-tickets.html';
        }
    })
  }

//------------------------------------------------------------------------------------------------------------------//
  async listTickets () {
    // #current_user_account
    // #draw_id -  get current drawId and make select input options

    // template#ticket
    // .ticket_number
    // .ticket_status
    // ожидайте розыгрыша лотереи
    // вы указали 2, 14, 45
    // <a href="#" class="redLink">Заполнить билет</a>
    //todo: set ticket number, draw Id, winning numbers to session storage for makeRequest()
  }

//------------------------------------------------------------------------------------------------------------------//
}

export default Lottery