pragma solidity ^0.4.24;

contract TokenERC721 {
    string public name;
    string public symbol;
    uint256 public totalSupply; // ??? Мы увеличиваем totalSupply по мере появления новых билетов?
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public ownerOf;
    mapping(address => mapping(uint256 => uint256)) public tokenOfOwnerByIndex;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(uint256 => bool) tokenExists;

    address public admin;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    constructor() {
        admin = msg.sender;
        name = "hashlottery2";
        symbol = "HL2";
        totalSupply = 100000000;
    }

    function mint(address _owner, uint256 _tokenId) public {
        require(msg.sender == admin, "Only admin of contract can call this.");
        require(!tokenExists[_tokenId], "Token by id " + _tokenId + "has already exist.");
        require(_owner != address(0), "Owner can't be 0");

        totalSupply += 1;
        ownerOf[_tokenId] = _owner;
        tokenOfOwnerByIndex[_owner][balanceOf[_owner]] = _tokenId;
        balanceOf[_owner] += 1;
    }

    function transfer(address _to, uint256 _tokenId) public {
        //address _from = msg.sender; // ??? msg.sender ведь не нужно доставать из блокчейна? Тратится ли газ на его чтение?

        require(tokenExists[_tokenId], "Token by id " + _tokenId + "would be existed." );
        require(ownerOf[_tokenId] == _msg.sender, "Sender isn't owner of token by id " + _tokenId);
        require(_to != address(0), "Reciever cannot be 0");

        uint256 indexOfLastTokenOfOwner = balanceOf[msg.sender]-1;
        uint256 indexOfCurrentTokenOfOwner = getIndexOfToken(msg.sender, _tokenId);

        ownerOf[_tokenId] = _to;

        // !!! change tokenOfOwnerByIndex
        tokenOfOwnerByIndex[msg.sender][indexOfCurrentTokenOfOwner] = tokenOfOwnerByIndex[msg.sender][indexOfLastTokenOfOwner];
        tokenOfOwnerByIndex[msg.sender][indexOfLastTokenOfOwner] = 0;
        tokenOfOwnerByIndex[_to][balanceOf[_to]] = _tokenId;

        balanceOf[msg.sender] -= 1;
        balanceOf[_to] += 1;

        emit Transfer(msg.sender, _to, _tokenId);
    }

    function getIndexOfToken(address _owner, uint256 _tokenId) private {
        for (i = 0; tokenOfOwnerByIndex[_owner][i] == _tokenId; i++) {
            return i;
        }
    }

    function approve(address _to, uint256 _tokenId) public {

    }

    function takeOwnership(uint256 _tokenId) public {

    }

    function () public { // ??? Фолбэк-функция ведь сейчас не сможет принимать на себя валюту? Или её в таком случае можно было и не объявлять?
    }
}
