pragma solidity ^0.4.24;

import "./TokenERC20.sol";

interface Draw {
    function isBlockedTranferPeriod() external view returns (bool);
}

contract TokenERC20_v2 is TokenERC20 {
    address public addressOfContractDraw;

    modifier onlyIfAllowedTransferInDraw {
        require(!Draw(addressOfContractDraw).isBlockedTranferPeriod(), "Transfer of tokens is blocked for an hour before draw and for an hour after draw.");
        _;
    }

    modifier onlyIfSetAddressOfContractDraw {
        require(addressOfContractDraw != address(0), "Address of contract Draw should be set.");
        _;
    }

    function setAddressOfContractDraw(address _address) public
            onlyOwner {
        require(addressOfContractDraw == address(0), "Address of contract Draw already set.");
        addressOfContractDraw = _address;
    }

    function _transfer(address _from, address _to, uint _value) internal
            onlyIfSetAddressOfContractDraw
            onlyIfAllowedTransferInDraw {
        super._transfer(_from, _to, _value);
    }

    /******** FOR MIGRATION ********/
    constructor() {
        migrationStatus = true;
    }

    modifier isMigrationRun(){
        require(migrationStatus == true, "Sorry, but we not detect migration to new token.");
        _;
    }
    modifier isCallFromMigrationAgent(){
        require(msg.sender == migrationAgent, "Call from NOT MigrationAgent Contract");
        _;
    }
    function createTokens(address _to, uint _value) public isMigrationRun() isSetMigrationAgent() isItCallFormMigrationAgent(){
        balanceOf[_to] += _value;
        totalSupply += _value;
        emit Transfer(migrationAgent, _to, _value);
    }
    // Set contract from here we get tokens and check it!
    function finalizeMigration() public isCallFromMigrationAgent() {
        migrationAgent = address(0);
        migrationStatus = false;
    }
    /******** FOR MIGRATION ********/
}
