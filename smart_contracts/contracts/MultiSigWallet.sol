pragma solidity ^0.4.25;
import "Crowdsale.sol";

contract MultiSigWallet {
    
    mapping(address => bool) owners;
    mapping(address => bool) ownersGetCoins;
    address crowdSaleContract;
    address owner;
    uint ownerPart;
    bool setOwnerCoinsPartStatus  = false;
    
    function constructor() public {
        owners[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = true;
        owners[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = true;
        owners[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = true;
        owners[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = true;
        owners[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = true;
        
        ownersGetCoins[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = false;
        ownersGetCoins[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = false;
        ownersGetCoins[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = false;
        ownersGetCoins[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = false;
        ownersGetCoins[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = false;
        
        owner = msg.sender;
    }
    
    modifier isIcoEnd(bool status) {
        require(crowdSaleContract.isIcoEnd() == status);
        _;
    }
    
    modifier isIcoFail(bool status) {
        require(crowdSaleContract.isIcoFail() == status);
        _;
    }
    
    // Must isIcoEnd => true && isIcoFail => true
    function getCoinsAfterNegativeIco(address _investor, uint value) public isIcoEnd(true) isIcoFail(true) {
        address(_investor).transfer(value);
    }
    
    // Must isIcoEnd => true && isIcoFail => false
    function getCoinsByOwners() isIcoEnd(true) public isIcoFail(false) {
        if(owners[msg.sender] == true && ownersGetCoins[msg.sender] == false){
            // Pay dividends for owner
            address(msg.sender).transfer(ownerPart);
            ownersGetCoins[msg.sender] == true;
        }
    }
    
    function setCrowdSaleContractAddress(address _crowdSaleContract) private {
        if(msg.sender == owner){
            crowdSaleContract = Crowdsale(_crowdSaleContract);
        }
    }
    
    function setOwnerCoinsPart() private {
        if(setOwnerCoinsPartStatus == false){
            ownerPart = this.balance/5;
            setOwnerCoinsPartStatus = true;
        }
    }
}