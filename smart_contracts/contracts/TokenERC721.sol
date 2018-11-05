pragma solidity ^0.4.24;

contract TokenERC721 {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint16 public allowedToMintInOneTransaction = 1000;
    mapping(uint256 => uint256) public totalTicketsInDraw; // [draw] = amount of tickets
    mapping(address => uint256) public balanceOf; // [owner] = tokenId
    mapping(uint256 => address) public ownerOf; // [tokenId] = owner of token
    mapping(address => mapping(uint256 => uint256)) public tokenOfOwnerByIndex; //[owner][index] = tokenId
    mapping(uint256 => uint256) public indexOfTokenForOwner; // [tokenId] = position in user's wallet
    mapping(address => mapping(uint256 => address)) public allowance; // [owner][tokenId] = reciever
    mapping(uint256 => bool) public tokenExists; // [tokenId] = token is exist
    mapping(address => mapping(uint256 => uint8[3])) public combinationOfLotteryTicketOfOwner; // [owner][tokenId] = combination of lottery ticket

    address public admin;
    address public addressOfContractTicketsSale;
    bool public isSetAddressOfContractTicketsSale;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    event Mint(address _owner, uint16 _amountOfTokens);

    constructor() public {
        name = "hashlottery2";
        symbol = "HL2";
        admin = msg.sender;
    }

    function setAddressOfContractTicketsSale(address _address) public {
        require(msg.sender == admin, "Only admin of contract can call this.");
        require(!isSetAddressOfContractTicketsSale, "Address of contract TicketsSale already set.");

        addressOfContractTicketsSale = _address;
        isSetAddressOfContractTicketsSale = true;
    }

    function mint(address _owner, uint256 _amountOfTokens, uint256 _numberOfDraw) public {
        require(isSetAddressOfContractTicketsSale, "Address of the contract TicketsSale doesn't set yet.");
        require(msg.sender == addressOfContractTicketsSale, "Sender should be the contract TicketsSale.");
        require(_owner != address(0), "Owner cannot be 0.");
        require(_amountOfTokens <= allowedToMintInOneTransaction, "Owner cannot mint more than 1000 tickets in one transaction.");

        uint256 indexOfNextToken = balanceOf[_owner]; // index to put to tokenOfOwnerByIndex, indexOfTokenForOwner
        uint256 idOfNextToken = totalSupply + 1; // id to use as current tokenId
        uint256 idOfEndToken = idOfNextToken + _amountOfTokens - 1;

        // release specified amount of tickets
        for (; idOfNextToken <= idOfEndToken; idOfNextToken++) {
            tokenExists[idOfNextToken] = true;
            ownerOf[idOfNextToken] = _owner;

            tokenOfOwnerByIndex[_owner][indexOfNextToken] = idOfNextToken;
            indexOfTokenForOwner[idOfNextToken] = indexOfNextToken;
            indexOfNextToken++;
        }

        totalSupply += _amountOfTokens;
        totalTicketsInDraw[_numberOfDraw] += _amountOfTokens;
        balanceOf[_owner] += _amountOfTokens;

        emit Mint(_owner, _amountOfTokens);
    }

    function transfer(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        require(msg.sender == ownerOf[_tokenId], "Sender isn't an owner of token by id.");
        require(msg.sender != _to, "Sender cannot be reciever.");
        require(tokenExists[_tokenId], "Token doesn't exist.");

        allowance[msg.sender][_tokenId] = _to;

        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        address ownerOfToken = ownerOf[_tokenId];

        require(tokenExists[_tokenId], "Token doesn't exist.");
        require(allowance[ownerOfToken][_tokenId] == msg.sender, "Sender doesn't have approve to get token by id.");

        _transfer(ownerOfToken, msg.sender, _tokenId); // transfer token to reciever and clear allowance
    }

    //=========+++ Additional functions +++==========//
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        require(tokenExists[_tokenId], "Token by id would be exist." );
        require(ownerOf[_tokenId] == _from, "Sender isn't owner of token by id.");
        require(_from != _to, "Sender cannot be reciever of token");
        require(_to != address(0), "Reciever cannot be 0");

        uint256 indexOfLastTokenOfOwner = balanceOf[_from]-1;
        uint256 indexOfCurrentTokenOfOwner = indexOfTokenForOwner[_tokenId];
        uint256 indexOfNextTokenForReciever = balanceOf[_to];

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
