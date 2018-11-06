import Web3 from 'web3'

let web3;

export function getWeb3() {
    if(web3) {
        return web3;
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
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
          console.log('txnsCount result', txnsCount)
          callback(txnsCount);
        } else {
          console.log('txnsCount result', txnsCount)
          callback(txnsCount);
        }
      } else {
        console.log('txnsCount result', txnsCount)
        callback(txnsCount);
      }
    })
  })
}
