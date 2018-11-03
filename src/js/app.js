import Web3 from 'web3'
import adresses from '../../smart_contracts/conract_addresses'
import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'

const tokenAbi = TokenERC20JSON.abi

/**
 *
 * Cabinet Page start
 *
 * */

/** Main Page */

if (typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
} else {
    // Set the provider you want from Web3.providers
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var TokenERC20 = new window.web3.eth.Contract(tokenAbi, adresses.tokenERC20, {
    from: '0xf7a67efba2a97f86228a7e36b996b34e0a417763', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

console.log('web3v', window.web3.version)
console.log('TokenERC20', TokenERC20)

TokenERC20.methods.balanceOf(adresses.crowdSale).call().then(receipt => console.log('Result:', receipt))

window.accountObject = window.web3.eth.accounts.decrypt({"address":"f7a67efba2a97f86228a7e36b996b34e0a417763","crypto":{"cipher":"aes-128-ctr","ciphertext":"782e36ba5fb3d13f33ed34bf6afb5c3f280fa04397970123f34dc709faa6567f","cipherparams":{"iv":"b3f097c743863cb249b2add8409cb5c9"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"66ce03a42a37b9d9bd6b6570bf04b76c7113b506eadcc413277b70749cc70c9b"},"mac":"8a7ef8c6f525454c11dd4219217664c97f8aee6f7e2a4d7000812775de642f95"},"id":"1eee9865-47bc-46c3-87d6-9c0f2f265f13","version":3}, 'kos542910')

console.log('account', window.accountObject)


/** Identification Page */


$(document).ready(function() {
    const reader = new FileReader()
    console.log('ready', reader)

    document.getElementById('uploaded-file').addEventListener('change', e => {
        const val = document.getElementById('uploaded-file').file
        console.log('val', val)
    })

})



/**
 * Cabinet Page end
 * */
