pragma solidity ^0.4.24;

contract MigrationAgent {
    function migrateFrom( address sender, uint256 _value);
}

contract TokenERC20 {
    string public name; // Migrate ??
    string public symbol; // Migrate ??
    uint8 public decimals = 0; // Migrate ?
    uint256 public totalSupply; // Migrate
    mapping(address => uint256) public balanceOf; // Migrate
    mapping(address => mapping(address => uint256)) public allowance;
    address public owner;
    bool private isTokensSupplied = false;

    // ownership definition
    mapping(address => uint256) public ownersIndex;
    address[] public ownerAddressesLists;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event TokensEmitted(uint256 tokensSupplyed);

    // For migration ERC20
    event Migrate(address indexed _from, address indexed _to, uint256 _value);
    address public migrationAgent;
    uint256 public totalMigrated;
    bool migrationStatus = false;

    modifier isNotSetMigrationAgent(){
        require(migrationAgent == address(0), "Migration Agent was set earlly");
        _;
    }

    modifier isSetMigrationAgent(){
        require(migrationAgent != address(0), "Migration Agent wasn't set earlly");
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

    modifier isItCallFormMigrationAgent(){
        require(msg.sender == migrationAgent, "Sorry, its calls only from migrationAgent");
        _;
    }

    function setMigrationAgent(address _agent) external isNotSetMigrationAgent() onlyOwner() {
        migrationAgent = _agent;
    }

    function setMigrationStatus() public isSetMigrationAgent() isItCallFormMigrationAgent(){
        if(!migrationStatus){
            migrationStatus = true;
        }
    }

    // User calls function for migrate his tokens to new ERC20 token
    function migrateTokens(uint _value) external
    isSetMigrationAgent()
    isValue(_value)
    isValueGTBalance(_value, msg.sender){

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

    function supplyTokens(address contract_address) public returns (bool success) {
        require(owner == msg.sender, "Not Authorized");
        require(isTokensSupplied == false, "Tokens already supplied");
        totalSupply = 100000;
        balanceOf[contract_address] = totalSupply;
        isTokensSupplied = true;
        ownersIndex[contract_address] = 0;
        ownerAddressesLists.push(contract_address);
        emit TokensEmitted(totalSupply);
        return true;
    }

    function emitMoreTokens(uint256 tokens, address receiver) public isMigrationNotRun() returns (bool success) {
        require(owner == msg.sender, "Not Authorized");
        totalSupply += tokens;
        balanceOf[receiver] += tokens;
        if(ownersIndex[receiver] == 0) {
            ownerAddressesLists.push(receiver);
            ownersIndex[receiver] = ownerAddressesLists.length - 1;
        }
        emit TokensEmitted(tokens);
        return true;
    }

    function _transfer(address _from, address _to, uint _value) internal isMigrationNotRun() {
        require(isTokensSupplied == true, "Tokens are not supplied");
        require(balanceOf[_from] >= _value, "Not enough funds");
        require(_to != address(0), "Try send funds to 0-address");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        if (balanceOf[_from] == 0) {
            uint256 lastElemIndex = ownerAddressesLists.length - 1;
            address lastElem = ownerAddressesLists[lastElemIndex];
            if (lastElem != _from) {
                uint256 senderIndex = ownersIndex[_from];
                ownerAddressesLists[senderIndex] = lastElem;
                ownersIndex[lastElem] = senderIndex;
                ownerAddressesLists.length = lastElemIndex;
            } else {
                ownerAddressesLists.length = lastElemIndex;
            }
        }

        if (ownersIndex[_to] == 0) {
            ownersIndex[_to] = ownerAddressesLists.length;
            ownerAddressesLists.push(_to);
        }

        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public
    returns (bool success) {
        require(_value <= allowance[_from][msg.sender], "User is not allowed to perform action");
        allowance[_from][msg.sender] = _value;
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

    function getOwnerAddressesList() public view returns (address[] ownerAddressesListPart) {
        return ownerAddressesLists;
    }

    function getOwnerAddressesListElement(uint256 userIndex) public view returns (address ownerAddress) {
        return ownerAddressesLists[userIndex];
    }
}