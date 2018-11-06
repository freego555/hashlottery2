import addresses from '../../smart_contracts/conract_addresses'
import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'
import CrowdSaleJSON from '../../smart_contracts/build/contracts/Crowdsale'
import MultiSigWalletJSON from '../../smart_contracts/build/contracts/MultiSigWallet'
import {getWeb3, getNonce} from './service'
import {getOwnership, balanceOf, transfer} from './transactions'

const tokenAbi = TokenERC20JSON.abi
const crowdsaleAbi = CrowdSaleJSON.abi
const multysigAbi = MultiSigWalletJSON.abi

/**
 *
 * Cabinet Page start
 *
 * */

const web3 = getWeb3();
let decrypted = null

const TokenERC20 = new web3.eth.Contract(tokenAbi, addresses.tokenERC20);
const CrowdSale = new web3.eth.Contract(crowdsaleAbi, addresses.crowdSale);
const MultiSigWallet = new web3.eth.Contract(multysigAbi, addresses.multiSig);

// get account address from session storage or set it to null
let walletAccountSaved = localStorage.getItem('privateKey') ? JSON.parse(localStorage.getItem('privateKey')) : null


/** Authorization */

if (window.location.pathname !== '/cabinet/identification-page.html' && window.location.pathname !== '/ico/form-acquisition.html') {
// decrypt account
  if (localStorage.getItem('keyStoreFormatted') && localStorage.getItem('passwordInput')) {
    const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
    decrypted = web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))
  } else {
    confirm('NOT AUTHORIZED')
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
    }).catch(err => console.log('Error getting balanceOf: ', err))
    getOwnership(walletAccountSaved.address).then(receipt => {
      ownership.textContent = `${receipt / 100}%`
    }).catch(err => console.log('Error getting ownership: ', err))
    console.log('transferred walletAccountSaved', walletAccountSaved.address)
    console.log('addresses.crowdSale', addresses.crowdSale)

  } else {
    confirm('NOT AUTHORIZED')
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
        }).catch(err => {
        console.log('Error', err)
        })
    })
    console.log('transferred walletAccountSaved', walletAccountSaved.address)
    console.log('addresses.crowdSale', addresses.crowdSale)

  } else {
    confirm('NOT AUTHORIZED')
    window.location.pathname = '/'
  }
}


/** Identification Pages */

$(document).ready(function () {

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
      const loader = $(".loader")[0]
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

      if (investButton) {
        investButton.addEventListener('click', function (e) {
          e.preventDefault()
          if (!keyStoreFormatted) {
            alert('keystore file not set')
            return false
          }

          if (passwordInput.value === '') {
            alert('password is empty')
            return false
          }
          $.when()
            .then(function () {
              let privateKey = web3.eth.accounts.decrypt(keyStoreFormatted, passwordInput.value)
              // save to session storage
              console.log('privateKey', privateKey)

              localStorage.setItem('privateKey', JSON.stringify(privateKey))
              localStorage.setItem('keyStoreFormatted', keyStoreFormatted)
              localStorage.setItem('passwordInput', passwordInput.value)
              localStorage.setItem('signTransaction', privateKey.signTransaction)
              return true
            }).then(function () {
            $(loader).removeClass('active')
            // alert('your password was get')
            // invest();
            console.log('invest try here', moneyInput)

            if (!!localStorage.getItem('privateKey') && !!moneyInput) {

              $.when()
                .then(function () {
                  let ethAmount = moneyInput.value
                  //invest(ethAmount)
                  console.log('start invest function', ethAmount)
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
