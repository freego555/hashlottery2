pragma solidity ^0.4.24;
import "./Crowdsale.sol";

contract MultiSigWallet {
    
    mapping(address => bool) public owners;
    mapping(address => bool) public ownersGetCoins;
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
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier isIcoEnd(bool status) {
        require(Crowdsale(crowdSaleContract).isIcoEnd() == status, "ICO isn't end");
        _;
    }
    
    modifier isIcoFail(bool status) {
        require(Crowdsale(crowdSaleContract).isIcoFail() == status, "ICO isn't fail");
        _;
    }
    
    // Must isIcoEnd => true && isIcoFail => true
    // Call from Crowdsale.sol
    function getCoinsAfterNegativeIco(address _investor, uint value) public isIcoEnd(true) isIcoFail(true) {
        address(_investor).transfer(value);
    }
    
    // Must isIcoEnd => true && isIcoFail => false
    // Call from terminal
    function getCoinsByOwners() isIcoEnd(true) public isIcoFail(false) {
        if(owners[msg.sender] == true && ownersGetCoins[msg.sender] == false){
            // Pay dividends for owner
            if(setOwnerCoinsPartStatus == false){
                setOwnerCoinsPart();
            }
            msg.sender.transfer(ownerPart);
            ownersGetCoins[msg.sender] == true;
        }
    }
    
    // Call from terminal
    function setCrowdSaleContractAddress(address _crowdSaleContract) public onlyOwner() {
        if(crowdSaleContract != address(0)){
            crowdSaleContract = _crowdSaleContract;
        }
    }
    
    function setOwnerCoinsPart() internal isIcoEnd(true) {
        ownerPart = this.balance/5;
        setOwnerCoinsPartStatus = true;
    }
}