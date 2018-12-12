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
    routes['/cron.html'] = 'cronPage'

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
      console.log('stageCode', stageCode);
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
        //
        // let currentDrawId = await this.Draw.methods.currentDrawId().call()
        // console.log('currentDrawId', currentDrawId)
        //
        // let startSelling = await this.Draw.methods.startSelling().call()
        // console.log('startSelling', startSelling)
        //
        // let stopSelling = await this.Draw.methods.stopSelling().call()
        // console.log('stopSelling', stopSelling)

        let stopAcceptingTickets = await this.Draw.methods.stopAcceptingTickets().call()
        // console.log('stopAcceptingTickets', stopAcceptingTickets)

        let next = new Date(parseInt(stopAcceptingTickets) * 1000)
        // console.log('next', next)
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
      var thisClass = this;
      document.getElementById('buy_ticket').addEventListener('click', async function (e) {
        e.preventDefault()

        console.log('buy_ticket')
        if (!isSelling) {
          alert('Сейчас не период продаж')
          return
        }

        if (moneyEth <= 0) {
          alert('moneyEth not set')
          return
        }

        const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
        console.log('keyStoreFormatted', keyStoreFormatted)

        let decrypted = await thisClass.web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))
        console.log('decrypted', decrypted)

        let nonce = await thisClass.web3.eth.getTransactionCount(decrypted.address);
        console.log('nonce', nonce)

        console.log('moneyEth', moneyInput.value)
        let  moneyWei = await  thisClass.web3.utils.toWei(moneyInput.value)
        console.log('moneyWei', moneyWei)

        const transactionObj = {
          nonce: nonce,
          from: decrypted.address,
          gas: 900000,
          to: thisClass.addresses.ticketSale,
          value: moneyWei,
        }
        console.log('transactionObj,', transactionObj)

        var transaction = await decrypted.signTransaction(transactionObj)
        console.log('transaction,', transaction)

        thisClass.web3.eth.sendSignedTransaction(transaction.rawTransaction)
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

    var url_string = window.location.href;
    var url = new URL(url_string);
    var ticketId = url.searchParams.get("ticketId");
    document.getElementById('ticketId').innerHTML = ticketId

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

    var thisClass = this;
    document.getElementById('confirm').addEventListener('click', async function (e) {
      e.preventDefault()

      let n1 = parseInt(num1.value)
      let n2 = parseInt(num2.value)
      let n3 = parseInt(num3.value)

      if (!(1 <= n1 && n1 <= 99
          && 1 <= n2 && n2 <= 99
          && 1 <= n3 && n3 <= 99)) {
        alert('Числа должны быть заполнены и быть в промежутке 1..99')
        return
      }

      if (!(n1 < n2 && n2 < n3)) {
        alert('Числа должны быть разными и отсортированы по возрастанию')
        return
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
        hashed[i] = await thisClass.Kassa.methods.hashVal(numbers[i], salty).call();
      }

      const data = thisClass.TokenERC721.methods.fillCombinationOfTicket(ticketId, hashed).encodeABI()

      const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
      let decrypted = await thisClass.web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))

      let nonce = await thisClass.web3.eth.getTransactionCount(decrypted.address)

      const transactionObj = {
        nonce: nonce,
        from: decrypted.address,
        gas: 900000,
        to: thisClass.addresses.tokenERC721,
        data: data
      }

      var transaction = await decrypted.signTransaction(transactionObj)
      console.log('transaction,', transaction)

      thisClass.web3.eth.sendSignedTransaction(transaction.rawTransaction)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
        })
        .on('receipt', (receipt) => {
          console.log('receipt', receipt)
          //todo: set numbersOfTicketInDraw to local storage

          localStorage.setItem('numbers[' + ticketId + ']', numbers.join('|'))
          window.location.href = '/lottery/success-screen.html'
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
    let choosedTicket = parseInt(ticket_number.value) //sessionStorage.getItem('ticket_number') //todo: get ticket number from session storage

    let winningNumbers = [0, 0, 0] //sessionStorage.getItem('winning_numbers') //todo: get winning numbers from session storage
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

        choosedTicket = parseInt(ticket_number.value)

        let dataOfTicket = await contractTokenERC721.methods.getDataOfTicket(choosedTicket).call()
        drawId = +dataOfTicket._drawId
        console.log('dataOfTicket = ' + dataOfTicket)

        try {
            winningNumbers = await contractDraw.methods.getWinnersNumbers(drawId).call()
            /*winningNumbers[1] = await contractDraw.methods.getWinnersNumbers(drawId).call()
            winningNumbers[2] = await contractDraw.methods.getWinnersNumbers(drawId).call()*/
            console.log('winningNumbers = ' + winningNumbers)
        } catch(e) {
            console.log('error: ' + e.message)
        }
        if (winningNumbers.length = 3) {
            winning_numbers.innerHTML = `${winningNumbers[0]}, ${winningNumbers[1]}, ${winningNumbers[2]}`
        } else {
            winning_numbers.innerHTML = '?, ?, ?'
        }

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

        const data = contractKassa.methods.addNewRequest(choosedTicket, winningNumbers, parseInt(salt.value)).encodeABI()

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

    if (this.wallet) {
      document.getElementById('current_user_account').innerHTML = this.wallet.address
    } else {
      alert('please log in')
    }

    let statuses = new Array()
    statuses[0] = 'NotFilled'
    statuses[1] = 'Filled'
    statuses[2] = 'Winning'
    statuses[3] = 'Payed'

    // #draw_id -  get current drawId and make select input options
    let draw_id = await this.Draw.methods.currentDrawId().call()
    // console.log('draw_id', draw_id)
    // document.getElementById('draw_id').innerHTML = draw_id

    var htmlOptions = ' <option>- выбрать № розыгрыша -</option>'
    for (var i = 1; i <= draw_id; i++) {
      htmlOptions += '<option value="' + i + '">' + i + '</option>'
    }

    var thisClass = this
    document.getElementById('draw_id').innerHTML = htmlOptions

    document.getElementById('draw_id').addEventListener('change', async function (e) {

      var selector = document.getElementById('draw_id')
      var selectedDraw = selector.options[selector.selectedIndex].value

      let countOfTickets = await thisClass.TokenERC721.methods.balanceOf(thisClass.wallet.address).call()
      let currentCountOfTickets = 0

      var ticket_details = '<p class="inputRow__label">Номер билета</p>'
      for (var index = 0; index < countOfTickets; index++) {
        let tokenId = await thisClass.TokenERC721.methods.tokenOfOwnerByIndex(thisClass.wallet.address, index).call()
        let tokenData = await thisClass.TokenERC721.methods.getDataOfTicket(tokenId).call()

        if (selectedDraw != tokenData._drawId) {
          continue
        }
        currentCountOfTickets++
        let currentStatus = statuses[tokenData._status]
        if (currentStatus == 'NotFilled') {
          currentStatus = '<a href="/lottery/fill-ticket.html?ticketId=' + tokenId + '" class="redLink">Заполнить билет</a>'
        } else if (currentStatus == 'Filled') {
          // вы указали 2, 14, 45
          var savedNumbers = localStorage.getItem('numbers[' + tokenId + ']') || false
          if (savedNumbers) {
            currentStatus = 'вы указали ' + savedNumbers.split('|').join(', ')
          }
        }

        ticket_details += '<p class="lotteryMain__headText">№ <span class="ticket_number">' + tokenId + '</span>' +
          ' <span class="ticket_status">' + currentStatus + '</span> </p>'

      }
      // console.log('currentCountOfTickets', currentCountOfTickets)
      if (currentCountOfTickets > 0) {
        document.getElementById('ticket_details').innerHTML = ticket_details
      }else{
        document.getElementById('ticket_details').innerHTML = '<p class="inputRow__label">Вы не покупали билеты в данном розыгрыше</p>'
      }
    })

    // template#ticket
    // .ticket_number
    // .ticket_status
    // ожидайте розыгрыша лотереи
    // вы указали 2, 14, 45
    // <a href="#" class="redLink">Заполнить билет</a>
    //todo: set ticket number, draw Id, winning numbers to session storage for makeRequest()
  }

//------------------------------------------------------------------------------------------------------------------//
  async cronPage(){

    console.log('cronPage')

    const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
    let decrypted = await this.web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))

    this.cronPageUpdateStatus()

    var thisClass = this;

    document.getElementById('cron1').addEventListener('click', async function (e) {
      console.log('cron1 clicked')

      const data = thisClass.Draw.methods.setStageTicketsSale().encodeABI()
      let nonce = await thisClass.web3.eth.getTransactionCount(decrypted.address)

      const transactionObj = {
        nonce: nonce,
        from: decrypted.address,
        gas: 900000,
        to: thisClass.addresses.draw,
        data: data
      }

      var transaction = await decrypted.signTransaction(transactionObj)
      console.log('transaction,', transaction)

      thisClass.web3.eth.sendSignedTransaction(transaction.rawTransaction)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
        })
        .on('receipt', async (receipt) => {
          console.log('receipt', receipt)
          thisClass.cronPageUpdateStatus();
        })


    });

    document.getElementById('cron2').addEventListener('click', async function (e) {
      console.log('cron2 clicked')

      let num1 = document.getElementById('num1')
      let num2 = document.getElementById('num2')
      let num3 = document.getElementById('num3')

      let n1 = parseInt(num1.value)
      let n2 = parseInt(num2.value)
      let n3 = parseInt(num3.value)

      if (!(1 <= n1 && n1 <= 99
          && 1 <= n2 && n2 <= 99
          && 1 <= n3 && n3 <= 99)) {
        alert('Числа должны быть заполнены и быть в промежутке 1..99')
        return
      }

      if (!(n1 < n2 && n2 < n3)) {
        alert('Числа должны быть разными и отсортированы по возрастанию')
        return
      }

      // сортировка по ASC
      let numbers = [n1, n2, n3]
      numbers.sort(function (a, b) {return a - b})
      //
      console.log('numbers', numbers)

      const data = thisClass.Draw.methods.setStageAcceptingRequestsWithoutTransferOfTokens(numbers).encodeABI()
      let nonce = await thisClass.web3.eth.getTransactionCount(decrypted.address)

      const transactionObj = {
        nonce: nonce,
        from: decrypted.address,
        gas: 900000,
        to: thisClass.addresses.draw,
        data: data
      }

      var transaction = await decrypted.signTransaction(transactionObj)
      console.log('transaction,', transaction)

      thisClass.web3.eth.sendSignedTransaction(transaction.rawTransaction)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
        })
        .on('receipt',  (receipt) => {
          console.log('receipt', receipt)
          thisClass.cronPageUpdateStatus();
        })



    });
  }
  //------------------------------------------------------------------------------------------------------------------//
  async cronPageUpdateStatus(){

    console.log('cronPageUpdateStatus')

    let statuses = new Array()
    statuses[10] = 'ждем cron#1 для начала продаж'
    statuses[11] = 'продажа билетов 47 часов'
    statuses[12] = 'дозаполнение билетов, продавать уже нельзя, акции перемещать нельзя'

    statuses[20] = 'ждем cron#2 для розыгрыша'
    statuses[21] = 'начали прием заявок, акции перемещать нельзя'
    statuses[22] = 'продолжение приема заявок'

    statuses[30] = 'ждем cron#3 для подведения итогов и подсчета победителей'
    statuses[40] = 'перерыв между розыгрышами'

    let stageCode = await this.Draw.methods.getStageOfCurrentDraw().call()
    console.log('stageCode', stageCode);

    try {
      status = statuses[stageCode]
    } catch (e) {
      status = 'error'
    }
    document.getElementById('current_draw_period').innerHTML = status
  }
//------------------------------------------------------------------------------------------------------------------//
}

export default Lottery