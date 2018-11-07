pragma solidity ^0.4.24;

import './Crowdsale.sol';

contract MultiSigWallet {
    
    mapping(address => bool) public owners;
    mapping(address => bool) public ownersGetCoins;
    address public crowdSaleContract;
    address public owner;
    uint ownerPart;
    bool setOwnerCoinsPartStatus  = false;
    
    constructor() public {
        owners[0x896ab7b50d7bce2961072fef0a7225376e88ba7e] = true; // Игорь
        owners[0x94bb857c3a550130120b5bfc1b7de3d478104705] = true; // Маша
        owners[0x42cf7f102aeb2d387c083548990e3bcc03d33d12] = true; // Костя

        ownersGetCoins[0x896ab7b50d7bce2961072fef0a7225376e88ba7e] = false;
        ownersGetCoins[0x94bb857c3a550130120b5bfc1b7de3d478104705] = false;
        ownersGetCoins[0x42cf7f102aeb2d387c083548990e3bcc03d33d12] = false;
        
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
            ownersGetCoins[msg.sender] = true;
        }
    }
    
    // Call from terminal
    function setCrowdSaleContractAddress(address _crowdSaleContract) public onlyOwner() {
        if(crowdSaleContract == address(0)){
            crowdSaleContract = _crowdSaleContract;
        }
    }
    
    function setOwnerCoinsPart() private isIcoEnd(true) {
        ownerPart = this.balance/3;
        setOwnerCoinsPartStatus = true;
    }

    function() payable public {

    }
}