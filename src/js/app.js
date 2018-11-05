//import Tx from 'ethereumjs-tx'
import addresses from '../../smart_contracts/conract_addresses'
import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'
import CrowdSaleJSON from '../../smart_contracts/build/contracts/Crowdsale'
import MultiSigWalletJSON from '../../smart_contracts/build/contracts/MultiSigWallet'
import {getWeb3} from './service'

const tokenAbi = TokenERC20JSON.abi
const crowdsaleAbi = CrowdSaleJSON.abi
const multysigAbi = MultiSigWalletJSON.abi

/**
 *
 * Cabinet Page start
 *
 * */

const web3 = getWeb3();

const TokenERC20 = new web3.eth.Contract(tokenAbi, addresses.tokenERC20);
const CrowdSale = new web3.eth.Contract(crowdsaleAbi, addresses.crowdSale);
const MultiSigWallet = new web3.eth.Contract(multysigAbi, addresses.multiSig);
// get account address from session storage or set it to null
let walletAccountSaved = localStorage.getItem('privateKey') ? JSON.parse(localStorage.getItem('privateKey')) : null

if (window.location.pathname !== '/cabinet/identification-page.html') {
// decrypt account
    let decrypted = null
    if(localStorage.getItem('keyStoreFormatted') && localStorage.getItem('passwordInput')) {
        const keyStoreFormatted = JSON.parse(localStorage.getItem('keyStoreFormatted'))
        console.log('keyStoreFormatted', keyStoreFormatted)
        decrypted = web3.eth.accounts.decrypt(keyStoreFormatted, localStorage.getItem('passwordInput'))
        console.log('decrypted', decrypted)
    }
    console.log('decrypted', decrypted)

    console.log('TokenERC20',TokenERC20)


    const data = TokenERC20.methods.emitMoreTokens(2000, walletAccountSaved.address).encodeABI()

    // web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
    //     .then(res => console.log('Transaction receipt', res)).catch(err => console.log('Transaction ERROR', err))

    web3.eth.getGasPrice().then(res => console.log('getGasPrice receipt', res)).catch(err => console.log('getGasPrice ERROR', err))

    web3.eth.getTransaction('0x2e4631d251fcd66816c1fb864cd1451517c86135b849f61519870b4cec2aed79').then(res => console.log('Transaction receipt', res)).catch(err => console.log('Transaction ERROR', err))
    web3.eth.getTransaction('0x47ca5df24eb7a62c29c3be4f654f9a9df46b52a579bb76e83b7090062041bade').then(res => console.log('Transaction receipt', res)).catch(err => console.log('Transaction ERROR', err))

    web3.eth.getTransactionCount(walletAccountSaved.address).then(count => {
        console.log('Count: ', count)
        const transactionObj = {
            nonce: count + 1,
            from: walletAccountSaved.address,
            gasPrice: "300000000000",
            gas: 5000000,
            data
        }

        web3.eth.estimateGas(transactionObj).then(res => console.log('estimateGas', res)).catch(err => console.log('estimateGas ERR', err))

        decrypted.signTransaction(transactionObj).then(transaction => {
            web3.eth.sendSignedTransaction(transaction.rawTransaction)
                .on('transactionHash', hash => console.log('transactionHash', hash))
                .on('receipt', receipt => console.log('receipt', receipt))
                .on('confirmation', (confirmationNumber, receipt) => console.log('confirmationNumber & receipt', confirmationNumber, receipt))
                .on('error', error => console.log('error', error))
        })
    })

}

/** Main Page */

console.log('main-page')
//console.log('walletAccountSaved', walletAccountSaved)
if(window.location.pathname === '/cabinet/main-page.html') {
    if (walletAccountSaved) {
        const walletAddress = document.querySelector('#wallet_address');
        const tokensBalance = document.querySelector('#tokens_balance');
        const ownership = document.querySelector('#ownership');
        walletAddress.textContent = walletAccountSaved.address
        TokenERC20.methods.balanceOf(walletAccountSaved.address).call().then(receipt => {
            tokensBalance.textContent = receipt
        }).catch(err => console.log('Error getting balanceOf: ', err))
        TokenERC20.methods.getOwnership(walletAccountSaved.address).call().then(receipt => {
            ownership.textContent = `${receipt/100}%`
        }).catch(err => console.log('Error getting ownership: ', err))
        console.log('transferred walletAccountSaved', walletAccountSaved.address)
        console.log('addresses.crowdSale', addresses.crowdSale)

    } else {
        alert('NOT AUTHORIZED')
    }
}




/** Identification Pages */


$(document).ready(function() {

    if(window.location.pathname === '/cabinet/identification-page.html' || window.location.pathname === '/ico/form-acquisition.html') {
        if(
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

                    // set loader on here
                    $.when()
                        .then(function () {
                            $(loader).addClass('active')
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
                            //window.location.pathname = '/cabinet/main-page.html'
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
