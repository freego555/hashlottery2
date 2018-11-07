import TokenERC20JSON from '../../smart_contracts/build/contracts/TokenERC20'
import CrowdSaleJSON from '../../smart_contracts/build/contracts/Crowdsale'
import MultiSigWalletJSON from '../../smart_contracts/build/contracts/MultiSigWallet'
import {getWeb3, getNonce} from './service'
import addresses from '../../smart_contracts/conract_addresses'

const tokenAbi = TokenERC20JSON.abi
const crowdsaleAbi = CrowdSaleJSON.abi
const multysigAbi = MultiSigWalletJSON.abi

const web3 = getWeb3();

const TokenERC20 = new web3.eth.Contract(tokenAbi, addresses.tokenERC20);
const CrowdSale = new web3.eth.Contract(crowdsaleAbi, addresses.crowdSale);
const MultiSigWallet = new web3.eth.Contract(multysigAbi, addresses.multiSig);

export const transfer = (_from, _to, _value, decrypted) => {
  const data = TokenERC20.methods.transfer(_to, _value).encodeABI()



  const pr = new Promise((resolve, reject) => {
    const createTransaction = (nonceGot) => {
      const transactionObj = {
        nonce: nonceGot,
        from: _from,
        gas: 53000,
        to: addresses.tokenERC20,
        data
      }


      return decrypted.signTransaction(transactionObj).then(transaction => {
        resolve(web3.eth.sendSignedTransaction(transaction.rawTransaction))
      })
    }

    getNonce(_from, createTransaction)
  });

  return pr;
}

export const balanceOf = (_address) => {
  return TokenERC20.methods.balanceOf(_address).call()
}

export const getOwnership = (_address) => {
  return TokenERC20.methods.getOwnership(_address).call()
}
