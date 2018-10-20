pragma solidity ^0.4.24;
import "./TokenERC20.sol";

contract newTokenERC20 is TokenERC20{

    bool finalizeMigrationStatus = false;

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
}