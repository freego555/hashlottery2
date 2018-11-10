import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'
import CrowdSaleJSON from '../../smart_contracts/build/contracts/Crowdsale'

class IcoClass {

  constructor (thisWeb3, addresses) {
    this.web3 = thisWeb3;
    this.addresses = addresses
    this.tokenAbi = TokenERC20JSON.abi
    this.crowdsaleAbi = CrowdSaleJSON.abi

  }

  async interfaceInit () {
    this.price_per_token_el = document.getElementById('price_per_token')
    this.token_address_el = document.getElementById('token_address')
    this.crowdsale_address_el = document.getElementById('crowdsale_address')
    this.pre_count_el = document.getElementById('token_pre_count')

    this.total_token_count = document.getElementById('total_token_count')
    this.count_of_sold_tokens = document.getElementById('count_of_sold_tokens')
    this.total_investor_count = document.getElementById('total_investor_count')
  }

  async init () {

    this.TokenERC20 = await new this.web3.eth.Contract(this.tokenAbi, this.addresses.tokenERC20)
    this.CrowdSale = await new this.web3.eth.Contract(this.crowdsaleAbi, this.addresses.crowdSale)

    await this.interfaceInit()
    await this.getAndShowPrice()
    await this.getAndShowAddresses()
    await this.getAndShowIcoDetails()
  }

  // show price for token
  async getAndShowPrice () {

    if (!this.price_per_token_el) {
      return false
    }

    try {
      let price = await this.CrowdSale.methods.price().call()

      this.price_per_token_el.innerHTML = price + ' Wei'
    } catch (error) {
      console.log('error#2', error.toString())
    }

  }

  async getAndShowAddresses () {

    if (this.token_address_el) {
      this.token_address_el.innerHTML = this.addresses.tokenERC20
    }

    if (this.crowdsale_address_el) {
      this.crowdsale_address_el.innerHTML = this.addresses.crowdSale
    }
  }

  async getAndShowIcoDetails () {

    if (this.total_token_count) {
      try {
        let amountTokensForSale = await this.CrowdSale.methods.amountTokensForSale().call()
      //  let totalSupply = await this.TokenERC20.methods.totalSupply().call()

         this.total_token_count.innerHTML = amountTokensForSale;
      } catch (error) {
        console.log('error#3', error.toString())
      }
    } // end of total_token_count

    if (this.count_of_sold_tokens) {
      try {
        let count_sold = await this.CrowdSale.methods.amountOfSoldTokens().call()
        // console.log('count_of_sold_tokens:', count_sold)
        this.count_of_sold_tokens.innerHTML = count_sold;
      } catch (error) {
        console.log('error#4', error.toString())
      }
    }

    if (this.total_investor_count) {
      try {
        let countOfFirstBuyers = await this.CrowdSale.methods.countOfFirstBuyers().call()
        // console.log('countOfFirstBuyers:', countOfFirstBuyers)
        this.total_investor_count.innerHTML = countOfFirstBuyers;
      } catch (error) {
        console.log('error#5', error.toString())
      }
    }

  }

  async invest (moneyEth, decrypted) {

    let nonce = await this.web3.eth.getTransactionCount(decrypted.address),
      moneyWei = await  this.web3.utils.toWei(moneyEth)

    const transactionObj = {
      nonce: nonce,
      from: decrypted.address,
      gas: 900000,
      //gasPrice: 1000000000,
      to: this.addresses.crowdSale,
      value: moneyWei,
      // data
    }
    //console.log('transactionObj,', transactionObj)

    var transaction = await decrypted.signTransaction(transactionObj)
    console.log('transaction,', transaction)

    var precalc = await this.CrowdSale.methods.calcTokenAmount(moneyWei, false).call()
    console.log('precalc', precalc);

    this.web3.eth.sendSignedTransaction(transaction.rawTransaction)
        .on('transactionHash', (hash) => {
            console.log('transactionHash', hash)
        })
        .on('receipt', (receipt) =>{
            console.log('receipt', receipt)
            this.getRedirectionUrl(precalc)
        })
      console.log('result,', result)
    // if (result.blockHash) {
    //   await this.getRedirectionUrl(precalc)
    // } else {
    //   console.log('result,', result)
    // }

    return false

  }

  async rememberMe (keyStoreFormatted) {
    sessionStorage.setItem('privateKey', keyStoreFormatted.privateKey)
    sessionStorage.setItem('address', keyStoreFormatted.address)
  }

  isAuth () {
    var privateKeySaved = sessionStorage.getItem('privateKey')
    var addressSaved = sessionStorage.getItem('address')

    if (typeof privateKeySaved != 'undefined' && typeof addressSaved != 'undefined') {
      return true
    }
    return false
  }

  async preCalc (moneyEth) {
    if (!this.pre_count_el) {
      console.log('error#31: pre_count_el does not exists')
      return false
    }

    try {
      let moneyWei = await  this.web3.utils.toWei(moneyEth)
      var result = await this.CrowdSale.methods.calcTokenAmount(moneyWei, true).call()

      var token_count = this.calcTokens(result)

      this.pre_count_el.innerHTML = 'Вы получите <span>' + token_count + '</span> акций'
      this.pre_count_el.style.display = 'block'

    } catch (error) {
      console.log('error#3', error.toString())
    }
  }

  calcTokens(preCalcResult){
    var token_count = 0
    if (typeof preCalcResult._token_count != 'undefined') {
      token_count = preCalcResult._token_count // for old version of contract
    } else if (typeof preCalcResult.token_count_buyed != 'undefined') {
      token_count = (+preCalcResult.token_count_buyed) + (+preCalcResult.token_count_bonus)
    }
    return token_count
  }

  getRedirectionUrl(precalc){
    let buyed =  this.calcTokens(precalc);

    sessionStorage.setItem('last_buyed_count', buyed )
    console.log('success, go to redirect', buyed)

    // precalc.bonus=
    if(typeof precalc.bonus != 'undefined') {

      var links = new Array();
      links[100] = '/ico/notification-acquisition2.html';
      links[20] = '/ico/notification-acquisition3.html';
      links[3] = '/ico/notification-acquisition4.html';
      links[123] = '/ico/notification-acquisition5.html';
      links[120] = '/ico/notification-acquisition6.html';
      links[103] = '/ico/notification-acquisition7.html';
      links[23] = '/ico/notification-acquisition8.html';

      if (links[precalc.bonus]) {
        console.log('redirect to: ', precalc.bonus)
        // return links[precalc.bonus]
        window.location.href = links[precalc.bonus];

      }
    }

    window.location.href ='/ico/notification-acquisition1.html';
    // return

  }


}

export default IcoClass
