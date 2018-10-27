import Web3 from 'web3';

//подключение к ноде
var web3;
if (typeof web3 !== 'undefined') {
   web3 = new Web3(web3.currentProvider);
} else {
   //127.0.0.1:8545

  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
}


// //Просмотр баланса:
// var coinbase = web3.eth.coinbase;
// console.log('coinbase '+ coinbase);
//
// var balance = web3.eth.getBalance(coinbase);
// console.log('balance' + balance);

// test read json
const keystore = require('./../../test.json');
console.log('test read json');
console.log(keystore);
//

//work with strorade
var testObject = { 'one': 1, 'two': 2, 'three': 3 };

// Put the object into storage
localStorage.setItem('testObject', JSON.stringify(testObject));

// Retrieve the object from storage
var retrievedObject = localStorage.getItem('testObject');

console.log('retrievedObject: ', JSON.parse(retrievedObject));

//
// const decryptedAccount = web3.eth.accounts.decrypt(keystore, 'mary');
// console.log('decryptedAccount');
// console.log(decryptedAccount);



