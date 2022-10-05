pragma solidity ^0.4.24;

interface ITokenERC20 {
    function totalSupply() external returns (uint256);
    function setMigrationStatus() external;
}

interface INewTokenERC20 {
    function totalSupply() external returns (uint256);
    function createTokens(address _from, uint256 _value) external;
    function finalizeMigration() external;
}

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

    function startMigrationFrom(address _oldToken, address _newToken) public
    onlyOwner()
    isNotSetOldToken()
    isNotSetNewToken()
    isNotFinalizeMigration(){
        oldToken = _oldToken;
        totalSupply = ITokenERC20(_oldToken).totalSupply();

        newToken = _newToken;

        ITokenERC20(_oldToken).setMigrationStatus();
    }

    function isTotalSumValid(uint _value) private view{
        require(ITokenERC20(oldToken).totalSupply() + INewTokenERC20(newToken).totalSupply() == totalSupply - _value, "");
    }

    function migrateFrom(address _from, uint256 _value) public
    isNotFinalizeMigration()
    isCallFromOldToken(msg.sender)
    isSetOldToken()
    isSetNewToken(){

        isTotalSumValid(_value);
        INewTokenERC20(newToken).createTokens(_from, _value);
        isTotalSumValid(0);
    }

    function finalizeMigration() public onlyOwner() isNotFinalizeMigration() {
        INewTokenERC20(newToken).finalizeMigration();
        finalizeMigrationStatus = true;
        oldToken = address(0);
        newToken = address(0);
        totalSupply = 0;
    }
}