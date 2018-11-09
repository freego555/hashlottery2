pragma solidity ^0.4.24;

interface Draw {
    function getStageOfCurrentDraw() view external returns(uint256 drawId, uint8 drawStage);
}

contract TokenERC721 {
    enum Status {
        NotFilled,
        Filled,
        Winning
    }

    struct DataOfTicket {
        uint256 drawId;
        bytes32[3] combinationOfTicket;
        Status status;
    }

    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint16 public allowedToMintInOneTransaction = 1000;
    mapping(uint256 => uint256) public totalTicketsInDraw; // [draw] = amount of tickets
    mapping(address => uint256) public balanceOf; // [owner] = amount of tokens
    mapping(uint256 => address) public ownerOf; // [tokenId] = owner of token
    mapping(address => mapping(uint256 => uint256)) public tokenOfOwnerByIndex; //[owner][index] = tokenId
    mapping(uint256 => uint256) public indexOfTokenForOwner; // [tokenId] = position in user's wallet
    mapping(address => mapping(uint256 => address)) public allowance; // [owner][tokenId] = reciever
    mapping(uint256 => bool) public tokenExists; // [tokenId] = token is exist
    mapping(uint256 => DataOfTicket) public dataOfTicket; // [tokenId] = data of ticket

    address public admin;
    address public addressOfContractTicketsSale;
    address public addressOfContractDraw;
    bool public isSetAddressOfContractTicketsSale;
    bool public isSetAddressOfContractDraw;

    Draw public contractDraw;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    event Mint(address indexed _owner, uint16 _amountOfTokens);
    event FillingTicket(uint256 _tokenId);
    //event TestCombination(bytes32[3] _numbers);

    constructor() public {
        name = "hashlottery2";
        symbol = "HL2";
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin of contract can call this.");
        _;
    }

    modifier onlyOwnerOfToken(address _from, uint256 _tokenId) {
        require(_from == ownerOf[_tokenId], "Sender isn't an owner of token by id.");
        _;
    }

    modifier onlyNotFilledTicket(uint256 _tokenId) {
        require(dataOfTicket[_tokenId].status == Status.NotFilled, "Filled ticket cannot be transfer or fill.");
        _;
    }

    function setAddressOfContractTicketsSale(address _address) public onlyAdmin {
        require(msg.sender == admin, "Only admin of contract can call this.");
        require(!isSetAddressOfContractTicketsSale, "Address of contract TicketsSale already set.");

        addressOfContractTicketsSale = _address;
        isSetAddressOfContractTicketsSale = true;
    }

    function setAddressOfContractDraw(address _address) public onlyAdmin {
        require(msg.sender == admin, "Only admin of contract can call this.");
        require(!isSetAddressOfContractDraw, "Address of contract Draw already set.");

        addressOfContractDraw = _address;
        contractDraw = Draw(_address);
        isSetAddressOfContractDraw = true;
    }

    function mint(address _owner, uint16 _amountOfTokens) public {
        require(msg.sender == addressOfContractTicketsSale, "Sender should be the contract TicketsSale.");
        require(_owner != address(0), "Owner cannot be 0.");
        require(_amountOfTokens <= allowedToMintInOneTransaction, "Owner cannot mint more than 1000 tickets in one transaction.");
        require(isSetAddressOfContractDraw, "Address of contract Draw should be set.");

        (uint256 drawId, uint8 drawStage) = contractDraw.getStageOfCurrentDraw();
        require(drawStage == 1, "Stage of current draw should be 'Sale of tickets'");

        uint256 indexOfNextToken = balanceOf[_owner]; // index to put to tokenOfOwnerByIndex, indexOfTokenForOwner
        uint256 idOfNextToken = totalSupply + 1; // id to use as current tokenId
        uint256 idOfEndToken = idOfNextToken + _amountOfTokens - 1;

        // release specified amount of tickets
        for (; idOfNextToken <= idOfEndToken; idOfNextToken++) {
            tokenExists[idOfNextToken] = true;
            ownerOf[idOfNextToken] = _owner;
            dataOfTicket[idOfNextToken].drawId = drawId;

            tokenOfOwnerByIndex[_owner][indexOfNextToken] = idOfNextToken;
            indexOfTokenForOwner[idOfNextToken] = indexOfNextToken;
            indexOfNextToken++;
        }

        totalSupply += _amountOfTokens;
        totalTicketsInDraw[drawId] += _amountOfTokens;
        balanceOf[_owner] += _amountOfTokens;

        emit Mint(_owner, _amountOfTokens);
    }

    function transfer(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwnerOfToken(msg.sender, _tokenId) onlyNotFilledTicket(_tokenId) {
        require(msg.sender != _to, "Sender cannot be reciever.");
        require(tokenExists[_tokenId], "Token doesn't exist.");

        allowance[msg.sender][_tokenId] = _to;

        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        address ownerOfToken = ownerOf[_tokenId];

        require(allowance[ownerOfToken][_tokenId] == msg.sender, "Sender doesn't have approve to get token by id.");

        _transfer(ownerOfToken, msg.sender, _tokenId); // transfer token to reciever and clear allowance
    }

    function fillCombinationOfTicket(uint256 _tokenId, bytes32[3] _numbers) public onlyOwnerOfToken(msg.sender, _tokenId) onlyNotFilledTicket(_tokenId) {
        require(_numbers[0] != _numbers[1] && _numbers[0] != _numbers[2] && _numbers[1] != _numbers[2], "Numbers cannot repeat.");
        require(allowance[msg.sender][_tokenId] == address(0), "Sender cannot fill promised token.");

        (uint256 drawIdCurrent, uint8 drawStage) = contractDraw.getStageOfCurrentDraw();
        uint256 drawIdOfTicket = dataOfTicket[_tokenId].drawId;
        require(drawIdCurrent == drawIdOfTicket, "Filling of ticket is available only for current draw.");
        require(drawStage == 1 || drawStage == 2, "Stage of current draw should be 'Sale of tickets' or 'Filling tickets without sale'");

        dataOfTicket[_tokenId].combinationOfTicket = _numbers;
        dataOfTicket[_tokenId].status = Status.Filled;

        emit FillingTicket(_tokenId);
        //emit TestCombination(dataOfTicket[_tokenId].combinationOfTicket);
    }

    //=========+++ Additional functions +++==========//
    function _transfer(address _from, address _to, uint256 _tokenId) internal onlyOwnerOfToken(_from, _tokenId) onlyNotFilledTicket(_tokenId) {
        require(tokenExists[_tokenId], "Token by id would be exist." );
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
            tokenOfOwnerByIndex[_from][indexOfCurrentTokenOfOwner] = lastTokenOfOwner;
            indexOfTokenForOwner[lastTokenOfOwner] = indexOfCurrentTokenOfOwner; // Set new index for last token
        }

        // Move tokenId from owner to reciever
        tokenOfOwnerByIndex[_from][indexOfLastTokenOfOwner] = 0;
        tokenOfOwnerByIndex[_to][indexOfNextTokenForReciever] = _tokenId;

        balanceOf[_from] -= 1;
        balanceOf[_to] += 1;

        // Clear allowance only if it's not zero
        address zeroAddress = address(0);
        if (allowance[_from][_tokenId] != zeroAddress) {
            allowance[_from][_tokenId] = zeroAddress;
        }

        emit Transfer(_from, _to, _tokenId);
    }
    //=========--- Additional functions ---==========//
}
