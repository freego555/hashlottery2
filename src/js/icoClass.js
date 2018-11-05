import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'
import CrowdSaleJSON from '../../smart_contracts/build/contracts/Crowdsale'
import contractAddresses from '../../smart_contracts/conract_addresses'

class IcoClass {

  constructor (web3, addresses) {
    this.web3 = web3
    this.eth = web3.eth
    this.addresses = addresses
    this.tokenAbi = TokenERC20JSON.abi
    this.crowdsaleAbi = CrowdSaleJSON.abi

  }

  async interfaceInit () {
    this.price_per_token_el = document.getElementById('price_per_token')
    this.token_address_el = document.getElementById('token_address')
    this.crowdsale_address_el = document.getElementById('crowdsale_address')
    this.pre_count_el = document.getElementById('token_pre_count')
  }

  // static async init () {
  //   const data = await this.bar()
  //   data.key = value
  //   return data
  // }
  //
  // static async bar () {
  //   return {foo: 1, bar: 2}
  // }

  async init () {

    console.log('init start')

    this.TokenERC20 = await new this.eth.Contract(this.tokenAbi, this.addresses.tokenERC20)
    this.CrowdSale = await new this.eth.Contract(this.crowdsaleAbi, this.addresses.crowdSale)

    await this.interfaceInit()

    await this.getAndShowPrice()
    await this.getAndShowAddresses()

    // try {
    //   let balanceTokensForSale = await TokenERC20.methods.balanceOf(this.addresses.crowdSale).call()
    //   console.log('balanceTokensForSale:', balanceTokensForSale)
    // } catch (error) {
    //   console.log('error#1', error.toString())
    // }

  }

  // show price for token
  async getAndShowPrice () {

    if (!this.price_per_token_el) {
      return false
    }

    try {
      let price = await this.CrowdSale.methods.price().call()

      console.log('price of token:', price)
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

  async invest (moneyEth) {

    console.log('invest inside')

    // var privateKeySaved = sessionStorage.getItem('privateKey')
    // var addressSaved = sessionStorage.getItem('address')

    var privateKeySaved = this.addresses.account.privateKey
    var addressSaved = this.addresses.account.address

    console.log('addressSaved ', addressSaved)
    console.log('privateKeySaved ', privateKeySaved)

    var Tx = require('ethereumjs-tx')
    // var privateKey = new Buffer('a95fcd0643446b359ef39e35a22316380c4a9fe52201fceba095e33677efddbc', 'hex')

    // var nonce, moneyValue;

    let nonce = await this.eth.getTransactionCount(addressSaved),
      moneyValue = await  window.web3.utils.toWei(moneyEth)

    console.log('nonce', nonce)
    nonce++
    console.log('nonce', nonce)
    console.log('money value Wei', moneyValue)

    var rawTx = {
      nonce: '0x' + nonce,
      gasPrice: '0x09184e72a000',
      gasLimit: '0x2710',
      to: this.addresses.crowdSale,
      value: '0x' + moneyValue,
      // data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
    }

    var tx = new Tx(rawTx)

    // var str2 = str1.slice(4, -2);

    // console.log('slice test', privateKeySaved.slice(2))

    var privateKeyBuffer = new Buffer.from(privateKeySaved.slice(2), 'hex')
    // var privateKeyBuffer = ethJsUtil.ecsign(ethJsUtil.sha256(msg),ethJsUtil.toBuffer('0x...'))
    tx.sign(privateKeyBuffer)

    var serializedTx = tx.serialize()

    window.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log)

    // see eth.getTransactionReceipt() for details

  }

  async rememberMe () {
    sessionStorage.setItem('privateKey', privateKey.privateKey)
    sessionStorage.setItem('address', privateKey.address)
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
      return false
    }

    try {
      let moneyWei = await  window.web3.utils.toWei(moneyEth)
      //calcTokenAmount(uint256 _wei_amount, bool _pre_calc)
      // let token_count_buyed, token_count_bonus, wei_change, bonuses;
      let {token_count_buyed, token_count_bonus, wei_change, bonuses} = await this.CrowdSale.methods.calcTokenAmount(moneyWei, true).call()

      console.log('token_count_buyed:', token_count_buyed)
      console.log('token_count_bonus:', token_count_bonus)
      console.log('wei_change:', wei_change)
      console.log('bonuses:', bonuses)

      let total = (+token_count_buyed) + (+token_count_bonus)

      this.pre_count_el.innerHTML = 'Вы получите <span>' + total + '</span> акций'
      this.pre_count_el.style.display = 'block'

      // this.price_per_token_el.innerHTML = price + ' Wei'
    } catch (error) {
      console.log('error#3', error.toString())
    }
  }
}

export default IcoClass
// export default { IcoClass }