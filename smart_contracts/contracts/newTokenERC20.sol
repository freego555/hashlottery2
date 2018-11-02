pragma solidity ^0.4.24;
import "./TokenERC20.sol";
contract newTokenERC20 {
    /******* EXTEND **************/
    address public migrationAgent = address(0);
    address owner;
    bool migrationStatus = true;
    uint256 public totalSupply; // Migrate
    mapping(address => uint256) public balanceOf; // Migrate
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() public {
        owner = msg.sender;
    }


    modifier isSetMigrationAgent(){
        require(migrationAgent != address(0), "Migration Agent wasn't set earlly");
        _;
    }
    modifier isItCallFormMigrationAgent(){
        require(msg.sender == migrationAgent, "Sorry, its calls only from migrationAgent");
        _;
    }
    /******* EXTEND **************/

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    function setMigrationAgent(address _agent) external isNotSetMigrationAgent() onlyOwner() {
        migrationAgent = _agent;
    }

    modifier isNotSetMigrationAgent(){
        require(migrationAgent == address(0), "Migration Agent was set earlly");
        _;
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
}