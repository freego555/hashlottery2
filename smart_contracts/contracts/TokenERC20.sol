pragma solidity ^0.4.23;

contract TokenERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 0;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event TokensEmitted(uint256 tokensSupplyed, uint256 totalTokens);

    constructor() public {
        name = 'LotStock';
        symbol = 'L$';
        owner = 0x0;
    }

    function setOwner(address owner_address) public returns (bool success) {
        require(owner == 0x0);
        owner = owner_address;
        return true;
    }

    function supplyTokens() public returns (bool success) {
        require(owner == msg.sender);
        totalSupply = 100000;
        balanceOf[msg.sender] = totalSupply;
        emit TokensEmitted(totalSupply, totalSupply);
        return true;
    }

    function emitMoreTokens(uint256 tokens) public returns (bool success) {
        require(owner == msg.sender);
        totalSupply += tokens;
        balanceOf[owner] += tokens;
        emit TokensEmitted(tokens, totalSupply);
        return true;
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(balanceOf[_from] >= _value);
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
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public
    returns (bool success) {
        allowance[msg.sender][_spender] += _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function getOwnership(address account) public view returns (uint256 percentageMultiplied100) {
        return balanceOf[account] * 10000 / totalSupply;
    }
}