import Web3 from 'web3'
import contractAddresses from '../../smart_contracts/conract_addresses'

let web3;

export function getWeb3() {
    if(web3) {
        return web3;
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider(contractAddresses.host));
        return web3;
    }
}

export function getNonce(address, callback) {
  web3.eth.getTransactionCount(address, function(error, result) {
    let txnsCount = result;
    web3.currentProvider.send({
      method: "txpool_content",
      params: [],
      jsonrpc: "2.0",
      id: new Date().getTime()
    }, function(error, result) {
      if (result.result.pending) {
        if (result.result.pending[address]) {
          txnsCount = txnsCount + Object.keys(result.result.pending[address]).length
          callback(txnsCount);
        } else {
          callback(txnsCount);
        }
      } else {
        callback(txnsCount);
      }
    })
  })
}
