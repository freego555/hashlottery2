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
        owners[0x896ab7b50d7bce2961072fef0a7225376e88ba7e] = true;
        owners[0x2dbc56b412ef3f70bee2ef3662e850f49c831052] = true;
        owners[0xf7a67efba2a97f86228a7e36b996b34e0a417763] = true;
        owners[0x94bb857c3a550130120b5bfc1b7de3d478104705] = true;
        owners[0x44f8fb0c0425471e23cdcc819827aa32cab607a9] = true;
        
        ownersGetCoins[0x896ab7b50d7bce2961072fef0a7225376e88ba7e] = false;
        ownersGetCoins[0x2dbc56b412ef3f70bee2ef3662e850f49c831052] = false;
        ownersGetCoins[0xf7a67efba2a97f86228a7e36b996b34e0a417763] = false;
        ownersGetCoins[0x94bb857c3a550130120b5bfc1b7de3d478104705] = false;
        ownersGetCoins[0x44f8fb0c0425471e23cdcc819827aa32cab607a9] = false;
        
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