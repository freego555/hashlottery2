pragma solidity ^0.4.24;
import "./TokenERC20.sol";
import "./newTokenERC20.sol";

contract MigrationAgent {
    address owner;
    address oldToken;
    address newToken;
    uint totalSupply;
    bool finalizeMigrationStatus = false;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier isNotSetNewToken(){
        require(newToken == address(0), "New token wasn't set");
        _;
    }

    modifier isSetOldToken(){
        require(oldToken != address(0), "Old token wasn't set");
        _;
    }

    modifier isNotSetOldToken(){
        require(oldToken == address(0), "Old token was set");
        _;
    }

    modifier isSetNewToken(){
        require(newToken != address(0), "New token wasn't set");
        _;
    }

    modifier isCallFromOldToken(address _sender){
        require(oldToken == _sender, "Call from not allow token");
        _;
    }

    modifier isNotFinalizeMigration(){
        require(finalizeMigrationStatus != true, "Migration was finalize");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function startMigrationFrom(address _oldToken) public onlyOwner() isNotSetOldToken(){
        oldToken = _oldToken;
        totalSupply = TokenERC20(_oldToken).totalSupply();

        TokenERC20(_oldToken).setMigrationStatus();
    }

    function setNewToken(address _newToken) public onlyOwner() isNotSetNewToken() isNotFinalizeMigration(){
        newToken = _newToken;
    }

    function isTotalSumValid(uint _value) private view{
        require(TokenERC20(oldToken).totalSupply() + newTokenERC20(newToken).totalSupply() != totalSupply - _value, "");
    }

    function migrateFrom(address _from, uint256 _value) public 
        isNotFinalizeMigration()
        isCallFromOldToken(msg.sender)
        isSetOldToken()
        isSetNewToken(){

        isTotalSumValid(_value);
        newTokenERC20(newToken).createTokens(_from, _value);
        isTotalSumValid(0);
    }

    function finalizeMigration() public onlyOwner() isNotFinalizeMigration() {
        newTokenERC20(newToken).finalizeMigration();
        finalizeMigrationStatus = true;
        oldToken = address(0);
        newToken = address(0);
        totalSupply = 0;
    }
}