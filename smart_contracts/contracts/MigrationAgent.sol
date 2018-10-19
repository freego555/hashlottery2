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
        require(oldToken == address(0), "New token wasn't setted");
        _;
    }

    modifier isSetOldToken(){
        require(oldToken != address(0), "New token wasn't setted");
        _;
    }

    modifier isSetNewToken(){
        require(newToken != address(0), "New token wasn't setted");
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

    constructor(address _oldToken) public {
        owner = msg.sender;
        oldToken = _oldToken;
        totalSupply = TokenERC20(_oldToken).totalSupply();
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
        isSetNewToken(){

        isTotalSumValid(_value);
        newTokenERC20(newToken).createTokens(_from, _value);
        isTotalSumValid(0);
    }

    function finalizeMigration() public onlyOwner() isNotFinalizeMigration() {
        finalizeMigrationStatus = true;
        oldToken = address(0);
        newToken = address(0);
        totalSupply = 0;
    }
}