pragma solidity ^0.4.24;

contract TokenERC721 {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf; // [owner] = tokenId
    mapping(uint256 => address) public ownerOf; // [tokenId] = owner of token
    mapping(address => mapping(uint256 => uint256)) public tokenOfOwnerByIndex; //[owner][index] = tokenId
    mapping(uint256 => uint256) public indexOfTokenForOwner; // [tokenId] = position in user's wallet
    mapping(address => mapping(uint256 => address)) public allowance; // [owner][tokenId] = reciever
    mapping(uint256 => bool) public tokenExists; // [tokenId] = token is exist
    mapping(address => mapping(uint256 => uint16[3])) public combinationOfLotteryTicketOfOwner; // [owner][tokenId] = combination of lottery ticket

    address public admin;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    constructor() public {
        admin = msg.sender;
        name = "hashlottery2";
        symbol = "HL2";
    }

    function mint(address _owner, uint256 _tokenId) public {
        require(msg.sender == admin, "Only admin of contract can call this.");
        require(!tokenExists[_tokenId], "Token by id has already exist."); //require(!tokenExists[_tokenId], "Token by id " + _tokenId + "has already exist.");
        require(_owner != address(0), "Owner cannot be 0");

        uint256 indexOfNextToken = balanceOf[_owner];

        totalSupply += 1;
        tokenExists[_tokenId] = true;
        ownerOf[_tokenId] = _owner;
        tokenOfOwnerByIndex[_owner][indexOfNextToken] = _tokenId;
        indexOfTokenForOwner[_tokenId] = indexOfNextToken;
        balanceOf[_owner] += 1;
    }

    function transfer(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        require(msg.sender == ownerOf[_tokenId], "Sender isn't an owner of token by id "); // require(msg.sender == ownerOf[_tokenId], "Sender isn't an owner of token by id " + _tokenId);
        require(msg.sender != _to, "Sender cannot be reciever.");
        require(tokenExists[_tokenId], "Token doesn't exist.");

        allowance[msg.sender][_tokenId] = _to;

        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        address ownerOfToken = ownerOf[_tokenId];

        require(tokenExists[_tokenId], "Token doesn't exist.");
        require(allowance[ownerOfToken][_tokenId] == msg.sender, "Sender doesn't have approve to get token by id"); // require(allowance[ownerOfToken][msg.sender] == _tokenId, "Sender doesn't have approve to get token by id " + _tokenId);

        _transfer(ownerOfToken, msg.sender, _tokenId); // transfer token to reciever and clear allowance
    }

    // function () public { // ??? Фолбэк-функция ведь сейчас не сможет принимать на себя валюту? Или её в таком случае можно было и не объявлять?
    // }

    //=========+++ Additional functions +++==========//
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        require(tokenExists[_tokenId], "Token by id would be exist." ); //require(tokenExists[_tokenId], "Token by id " + _tokenId + "would be existed." );
        require(ownerOf[_tokenId] == _from, "Sender isn't owner of token by id "); //require(ownerOf[_tokenId] == _from, "Sender isn't owner of token by id " + _tokenId);
        require(_from != _to, "Sender cannot be reciever of token");
        require(_to != address(0), "Reciever cannot be 0");

        uint256 indexOfLastTokenOfOwner = balanceOf[_from]-1;
        uint256 indexOfCurrentTokenOfOwner = indexOfTokenForOwner[_tokenId];
        uint256 indexOfNextTokenForReciever = balanceOf[_to];

        //uint256 currentTokenOfOwner = tokenOfOwnerByIndex[_from][indexOfCurrentTokenOfOwner]; // ??? Как поместить туда ссылку, чтобы далее по ней записать туда значение?
        uint256 lastTokenOfOwner = tokenOfOwnerByIndex[_from][indexOfLastTokenOfOwner];

        ownerOf[_tokenId] = _to;

        // Set index of token
        indexOfTokenForOwner[_tokenId] = indexOfNextTokenForReciever;

        // Delete tokenId for owner from tokenOfOwnerByIndex
        if (indexOfCurrentTokenOfOwner != indexOfLastTokenOfOwner) {
            tokenOfOwnerByIndex[_from][indexOfCurrentTokenOfOwner] = tokenOfOwnerByIndex[_from][indexOfLastTokenOfOwner];
            indexOfTokenForOwner[lastTokenOfOwner] = indexOfCurrentTokenOfOwner; // Set new index for last token
        }

        // Move tokenId from owner to reciever
        tokenOfOwnerByIndex[_from][indexOfLastTokenOfOwner] = 0;
        tokenOfOwnerByIndex[_to][indexOfNextTokenForReciever] = _tokenId;

        balanceOf[_from] -= 1;
        balanceOf[_to] += 1;

        allowance[_from][_tokenId] = address(0);

        emit Transfer(_from, _to, _tokenId);
    }
    //=========--- Additional functions ---==========//
}
