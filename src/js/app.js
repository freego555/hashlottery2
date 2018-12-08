import {getWeb3} from './service'
import {getOwnership, balanceOf, transfer, approve, allowance} from './transactions'
import addresses from '../../smart_contracts/conract_addresses'
import IcoClass from './icoClass'
import Lottery from './lottery'

/**
 *
 * Cabinet Page start
 *
 * */

const web3 = getWeb3();
let decrypted = null

const loader = $(".loader")[0]

// get account address from session storage or set it to null
let walletAccountSaved = localStorage.getItem('privateKey') ? JSON.parse(localStorage.getItem('privateKey')) : null


/** Authorization */

if (window.location.pathname !== '/cabinet/identification-page.html'
  && window.location.pathname !== '/ico/form-acquisition.html'
  && window.location.pathname !== '/'
) {
// decrypt account
  if (localStorage.getItem('keyStoreFormatted') && localStorage.getItem('passwordInput')) {
    const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
    decrypted = web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))
  } else if (
      window.location.pathname === '/cabinet/identification-page.html'
      && window.location.pathname === '/ico/form-acquisition.html'
  ) {
    confirm('NOT AUTHORIZED main page')
    window.location.pathname = '/'
  }
}


/** Main Page */

if (window.location.pathname === '/cabinet/main-page.html') {
  console.log('main-page')
  if (walletAccountSaved) {
    const walletAddress = document.querySelector('#wallet_address');
    const tokensBalance = document.querySelector('#tokens_balance');
    const ownership = document.querySelector('#ownership');
    walletAddress.textContent = walletAccountSaved.address
    balanceOf(walletAccountSaved.address).then(receipt => {
      tokensBalance.textContent = receipt
    }).catch(err => {
      console.log('Error getting balanceOf: ', err)
      alert('Ошибка получения данных баланса')
    })
    getOwnership(walletAccountSaved.address).then(receipt => {
      ownership.textContent = `${receipt / 100}%`
    }).catch(err => {
      console.log('Error getting ownership: ', err)
      alert('Ошибка получения данных процента владения')
    })
  } else {
    confirm('NOT AUTHORIZED page main-page')
    window.location.pathname = '/'
  }
}


/** Form Shipment Page*/

else if (window.location.pathname === '/cabinet/form-shipment.html') {
  console.log('form-shipment')
  if (walletAccountSaved) {
    const walletAddress = document.querySelector('#wallet_address');
    const shipmentForm = document.querySelector('#shipment_form');
    //const walletAddress = document.querySelector('#wallet_address');
    walletAddress.textContent = walletAccountSaved.address;
    $(shipmentForm).on('submit', e => {
      e.preventDefault()
      console.log('submitted', e)

      transfer(walletAccountSaved.address, e.target[0].value, e.target[1].value, decrypted)
        .then(receipt => {
          console.log('Success', receipt)
          alert('Акции успешно переведены')
          window.location.pathname = '/cabinet/main-page.html'
        }).catch(err => {
        console.log('Error', err)
        alert('Ошибка! Транзакция не выполнена!')
        })
    })
    $(shipmentForm).on('reset', () => {
      if(confirm('Вернуться на главную?')) {
        window.location.pathname = '/cabinet/main-page.html'
      }
    })
  } else {
    confirm('NOT AUTHORIZED form shipment')
    window.location.pathname = '/'
  }
}


/** Access shares Page*/

else if (window.location.pathname === '/cabinet/acces-shares.html') {
  console.log('acces-shares')
  if (walletAccountSaved) {
    const walletAddress = document.querySelector('#wallet_address');
    const accessForm = document.querySelector('#access_form');
    //const spenderAddressInput = document.querySelector('#spender_address');
    const allowedTokens = document.querySelector('#token_allowed');
    walletAddress.textContent = walletAccountSaved.address;
    $(loader).removeClass('active')
    $('#access_form #spender_address').bind('input', e => {
      if(/^0x([A-Fa-f0-9]{40})$/.test(e.target.value)) {
        $(loader).addClass('active')
        allowance(walletAccountSaved.address, e.target.value).then(res => {
          $(loader).removeClass('active')
          allowedTokens.textContent = res
        }).catch((err => {
          console.log('Error getting allowance', err)
          alert('Ошибка получения доступных акций')
          $(loader).removeClass('active')
        }))
      }
    })
    $(accessForm).on('submit', e => {
      e.preventDefault()
      console.log('submitted', e)
      $(loader).addClass('active')
      approve(walletAccountSaved.address, e.target[0].value, e.target[1].value, decrypted)
        .then(receipt => {
          console.log('Success', receipt)
          $(loader).removeClass('active')
          alert('Права на распоряжение вашими акциями переданы')
          window.location.pathname = '/cabinet/main-page.html'
        }).catch(err => {
        console.log('Error', err)
        $(loader).removeClass('active')
        alert('Ошибка! Транзакция не выполнена!')
      })
    })
    $(accessForm).on('reset', () => {
      if(confirm('Вернуться на главную?')) {
        window.location.pathname = '/cabinet/main-page.html'
      }
    })
  } else {
    confirm('NOT AUTHORIZED access shares')
    window.location.pathname = '/'
  }
}

else if (
  window.location.pathname === '/ico/notification-acquisition1.html'
  || window.location.pathname === '/ico/notification-acquisition2.html'
  || window.location.pathname === '/ico/notification-acquisition3.html'
  || window.location.pathname === '/ico/notification-acquisition4.html'
  || window.location.pathname === '/ico/notification-acquisition5.html'
  || window.location.pathname === '/ico/notification-acquisition6.html'
  || window.location.pathname === '/ico/notification-acquisition7.html'
  || window.location.pathname === '/ico/notification-acquisition8.html'

) {

  var last_buyed_count = document.getElementById('last_buyed_count')
  if (last_buyed_count) {
    try {
      let amount = sessionStorage.getItem('last_buyed_count')
      last_buyed_count.innerHTML = amount
      $(loader).removeClass('active');
    } catch (error) {
      console.log('error#4', error.toString())
    }
  } // end of total_token_count

}

/** Identification Pages */



$(document).ready(function () {
  console.log('ready');
    var ico = new IcoClass(web3, addresses)

    var lottery = new Lottery(web3, addresses, walletAccountSaved)
    lottery.router(window.location.pathname);


  ico.init()

  if (window.location.pathname === '/cabinet/identification-page.html' || window.location.pathname === '/ico/form-acquisition.html') {
    if (
      walletAccountSaved &&
      window.location.pathname === '/cabinet/identification-page.html' &&
      confirm('Вы уже авторизированы на этом устройстве. Хотите продолжить с теми же параметрами?')
    ) {
      window.location.pathname = '/cabinet/main-page.html'
    } else {
      walletAccountSaved = null
      let keyStoreFormatted
      $(loader).removeClass('active')

      /**
       * upload / change file
       */
      const myFile = document.getElementById('uploaded-file'),
        displayFileName = document.getElementById('file-name')
      if (myFile) {

        myFile.addEventListener('change', e => {
          console.log('change', e)
          const files = myFile.files
          if (files.length <= 0) {
            return false
          }

          // display filename
          let file = myFile.value
          file = file.replace(/\\/g, '/').split('/').pop()
          displayFileName.textContent = 'Имя файла: ' + file

          //read content
          const reader = new FileReader()
          reader.onload = function (e) {
            const result = JSON.parse(e.target.result)
            keyStoreFormatted = JSON.stringify(result, null, 2)
          }
          reader.readAsText(files.item(0))
        })

      }// end of myFile


      /**
       * invest button
       */
      let investButton = document.getElementById('authorize')
      let passwordInput = document.getElementById('keystore_password')
      let moneyInput = document.getElementById('eth_amount')

      if(moneyInput){
        moneyInput.addEventListener('change', e => {

          moneyInput.value = parseFloat(moneyInput.value);

          if(moneyInput.value=='' || parseFloat(moneyInput.value)<=0){
            console.log('money amount not set')
            return
          }

          ico.preCalc( moneyInput.value);

        });

      }

      if (investButton) {
        investButton.addEventListener('click', function (e) {
          e.preventDefault()
          if (!keyStoreFormatted) {
            alert('keystore file not set')
            return false
          }

          // if (passwordInput.value === '') {
          //   alert('password is empty')
          //   return false
          // }

          // if (moneyInput.value === '') {
          //   alert('eth amount is empty')
          //   return false
          // }

          $.when()
            .then(function () {
              $(loader).addClass('active');
              return true
            })
            .then(function () {
              let privateKey = web3.eth.accounts.decrypt(keyStoreFormatted, passwordInput.value)
              decrypted = privateKey;
              // save to session storage
              console.log('privateKey', privateKey)

              localStorage.setItem('privateKey', JSON.stringify(privateKey))
              localStorage.setItem('keyStoreFormatted', keyStoreFormatted)
              localStorage.setItem('passwordInput', passwordInput.value)
              localStorage.setItem('signTransaction', privateKey.signTransaction)
              return true
            }).then(function () {

            if (!!localStorage.getItem('privateKey') && !!moneyInput) {

              $.when()
                .then(function () {
                  let ethAmount = moneyInput.value
                  ico.invest(ethAmount, decrypted)

              })

              return true
            } else {
              window.location.pathname = '/cabinet/main-page.html'
            }
          })
            .catch(function (err) {
              $(loader).removeClass('active')
              alert(err.toString())
            })

        })
      }
    }
  }
})


/**
 * Cabinet Page end
 * */
