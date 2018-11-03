import Web3 from 'web3'
// import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'
// const tokenAbi = TokenERC20JSON.abi
//
// import CrowdsaleJSON from '../../smart_contracts/build/contracts/Crowdsale'
// const CrowdsaleAbi = CrowdsaleJSON.abi

var Crowdsale_address = '0x8cdb757f8eadac1dbe5062240cd8c920d8e4303a' // from test local

/**
 * connect
 */
if (typeof window.web3 !== 'undefined') {
  console.log('Using web3 detected from external source like Metamask')
  window.web3 = new Web3(window.web3.currentProvider)
} else {
  console.log('Using localhost')
  // Set the provider you want from Web3.providers
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
}

/** Identification Page */

function invest (moneyEth) {
  console.log('invest inside')

  // var privateKeySaved = sessionStorage.getItem('privateKey');
  // var privateKeySaved = '0xa95fcd0643446b359ef39e35a22316380c4a9fe52201fceba095e33677efddbc' // from local
  // var privateKeySaved = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109' // from local
  // var addressSaved = sessionStorage.getItem('address')

  var Tx = require('ethereumjs-tx')
  var privateKey = new Buffer('a95fcd0643446b359ef39e35a22316380c4a9fe52201fceba095e33677efddbc', 'hex')

  window.web3.eth.getTransactionCount(Crowdsale_address)
    .then(console.log);

  let value = window.web3.utils.toWei(moneyEth)
  console.log('money value Wei', value)

  var rawTx = {
    nonce: '0x17',
    gasPrice: '0x09184e72a000',
    gasLimit: '0x2710',
    to: Crowdsale_address,
    value: '0x' + value,
    // data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
  }

  var tx = new Tx(rawTx)
  tx.sign(privateKey)

  var serializedTx = tx.serialize()

  window.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', console.log)

  // see eth.getTransactionReceipt() for details

}

$(document).ready(function () {


  // console.log('ready', reader)

  var privateKeySaved = sessionStorage.getItem('privateKey')
  var addressSaved = sessionStorage.getItem('address')
  //
  // if(typeof privateKeySaved != 'undefined' && typeof addressSaved != 'undefined'){
  //
  // }

  var keyStoreFormatted
  var loader = document.getElementsByClassName('loader')[0]

  /**
   * upload / change file
   */
  var myFile = document.getElementById('uploaded-file-ico'),
    displayFileName = document.getElementById('file-name')
  if (myFile) {

    myFile.addEventListener('change', e => {
      console.log('change')
      const files = myFile.files
      if (files.length <= 0) {
        return false
      }

      // display filename
      var file = myFile.value
      file = file.replace(/\\/g, '/').split('/').pop()
      displayFileName.innerHTML = 'Имя файла: ' + file

      //read content
      const reader = new FileReader()
      reader.onload = function (e) {
        var result = JSON.parse(e.target.result)
        keyStoreFormatted = JSON.stringify(result, null, 2)
      }
      reader.readAsText(files.item(0))
    })

  }// end of myFile

  /**
   * invest button
   */
  var investButton = document.getElementById('authorize'),
    passwordInput = document.getElementById('keystore_password'),
    moneyInput = document.getElementById('eth_amount')

  if (investButton) {
    investButton.addEventListener('click', function (e) {
      e.preventDefault()

      if (typeof privateKeySaved != 'undefined') {

        $.when()
          .then(function () {
            let ethAmount = moneyInput.value
            invest(ethAmount)
          })

        return
      }

      if (typeof keyStoreFormatted == 'undefined') {
        alert('keystore file not set')
        return
      }

      let password = passwordInput.value
      if (password.length <= 0) {
        alert('password is empty')
        return
      }

      // set loader on here
      loader.style.display = 'flex'
      $.when()
        .then(function () {
          let privateKey = window.web3.eth.accounts.decrypt(keyStoreFormatted, password)
          // save to session storage
          console.log(privateKey)
          sessionStorage.setItem('privateKey', privateKey.privateKey)
          sessionStorage.setItem('address', privateKey.address)

        }).then(function () {

        // alert('your password was get')
        loader.style.display = 'none'
        // invest();
        console.log('invest try')

      }).then(function () {

        invest()

      }).catch(function (e) {

        alert(e.toString())
        loader.style.display = 'none'

      })
      //   .then(function () {
      //   alert('your password was get')
      //   loader.style.display = 'none'
      //   // invest();
      //   console.log('invest');
      // });

    })

  }// end of investButton

})
