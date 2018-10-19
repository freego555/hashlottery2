pragma solidity ^0.4.23;
import "./MigrationAgent.sol";

contract TokenERC20 {
    string public name; // Migrate ??
    string public symbol; // Migrate ??
    uint8 public decimals = 0; // Migrate ?
    uint256 public totalSupply; // Migrate
    mapping(address => uint256) public balanceOf; // Migrate
    mapping(address => mapping(address => uint256)) public allowance;
    address public owner;
    bool firstSupplyTokens = false;

    modifier isSetFirstSupplyTokens(){
        require(firstSupplyTokens == true, "Tokens was supply");
        _;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event TokensEmitted(uint256 tokensSupplyed, uint256 totalTokens);

    // For migration ERC20
    event Migrate(address indexed _from, address indexed _to, uint256 _value);
    address public migrationAgent;
    uint256 public totalMigrated;
    bool migrationStatus = false;

    modifier isNotSetMigrationAgent(){
        require(migrationAgent != address(0), "Migration Agent was set earlly");
        _;
    }

    modifier isMigrationAgent(){
        require(migrationAgent == address(0), "Migration Agent wasn't set earlly");
        _;
    }

    modifier isValue(uint _value){
        require(_value > 0, "Value can't should be grate than 0");
        _;
    }

    modifier isValueGTBalance(uint _value, address _sender){
        require(_value <= balanceOf[_sender], "Value can't be less than 0");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner of contract can call this");
        _;
    }

    modifier isMigrationNotRun(){
        require(migrationStatus != true, "Sorry, but we detect migration to new token. You must miggrate all your tokens to new ERC20 token");
        _;
    }

    function setMigrationAgent(address _agent) external isNotSetMigrationAgent() onlyOwner() {
        migrationAgent = _agent;
    }

    // User calls function for migrate his tokens to new ERC20 token
    function migrateTokens(uint _value) external 
        isMigrationAgent() 
        isValue(_value) 
        isValueGTBalance(_value, msg.sender){

        if(!migrationStatus){
            migrationStatus = true;
        }

        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        totalMigrated += _value;
        MigrationAgent(migrationAgent).migrateFrom(msg.sender, _value);
        emit Migrate(msg.sender, migrationAgent, _value);
    }

    constructor() public {
        name = "LotStock";
        symbol = "L$";
        owner = msg.sender;
    }

    function supplyTokens() public isSetFirstSupplyTokens() returns (bool success) {
        require(owner == msg.sender, "Not Authorized");
        totalSupply = 100000;
        balanceOf[msg.sender] = totalSupply;
        emit TokensEmitted(totalSupply, totalSupply);
        firstSupplyTokens = true;
        return true;
    }

    function emitMoreTokens(uint256 tokens, address receiver) public isMigrationNotRun() returns (bool success) {
        require(owner == msg.sender, "Not Authorized");
        totalSupply += tokens;
        balanceOf[receiver] += tokens;
        emit TokensEmitted(tokens, totalSupply);
        return true;
    }

    function _transfer(address _from, address _to, uint _value) internal isMigrationNotRun() {
        require(balanceOf[_from] >= _value, "Not enough funds");
        require(_to == address(0), "Try send funds to 0-address");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public
    returns (bool success) {
        require(_value <= allowance[_from][msg.sender], "User is not allowed to perform action");
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public
    returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function getOwnership(address account) public view returns (uint256 percentageMultiplied100) {
        return balanceOf[account] * 10000 / totalSupply;
    }
}