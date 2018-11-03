import Web3 from 'web3'
import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'

const tokenAbi = TokenERC20JSON.abi

/**
 * connect
 */
if (typeof window.web3 !== 'undefined') {
  window.web3 = new Web3(web3.currentProvider)
} else {
  // Set the provider you want from Web3.providers
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
}

/** Identification Page */

function invest () {
  console.log('invest')
}

$(document).ready(function () {

  // console.log('ready', reader)

  // var privateKeySaved = sessionStorage.getItem('privateKey');
  // var addressSaved = sessionStorage.getItem('address');
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
    passwordInput = document.getElementById('keystore_password')

  if (investButton) {
    investButton.addEventListener('click', function (e) {
      e.preventDefault()
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
