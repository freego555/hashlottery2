
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
