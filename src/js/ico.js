import IcoClass from './icoClass'

import addresses from '../../smart_contracts/conract_addresses_local'
// import addresses from '../../smart_contracts/conract_addresses'

const ico = new IcoClass(window.web3, addresses)

/** Identification Page */



$(document).ready(function () {
  console.log('ready')

  ico.init()

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

      if(moneyInput.value=='' || parseFloat(moneyInput.value)<=0){
        alert('money amount not set')
        return
      }

      if (ico.isAuth()) {
        ico.invest(moneyInput.value)
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
          ico.rememberMe(privateKey)

        }).then(function () {

        // alert('your password was get')
        loader.style.display = 'none'
        // invest();
        console.log('invest try')

      }).then(function () {

        ico.invest(moneyInput.value)

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

  if(moneyInput){
    moneyInput.addEventListener('change', e => {

      console.log('change moneyInput.value', moneyInput.value)

      moneyInput.value = moneyInput.value.replace(/[^\d]+/g,'');

      if(moneyInput.value=='' || parseFloat(moneyInput.value)<=0){
        // alert('money amount not set')
        return
      }

      ico.preCalc( moneyInput.value);

    });

  }


})
