pragma solidity ^0.4.24;

/*<<<<<<< HEAD
interface Draw {
    function isSellingTicketPeriod() external view returns (bool);
    function isFillingTicketPeriod() external view returns (bool);
    function isAcceptRequestPeriod() external view returns (bool);
    function isVacationPeriod() external view returns (bool);
    function isWaitingWithdrawsPeriod() external view returns (bool);
    function currentDrawId() external view returns(uint256 _drawId);
}*/

interface MigrationAgent {
    function migrateOneTokenFrom(address _from, uint256 _tokenId, uint256 _drawId, bytes32[3] _combinationOfTicket, uint8 _status) external;
}
/*=======*/
import './Draw.sol';
/*import './MigrationAgentTokenERC721.sol';
>>>>>>> temp-mary*/

contract TokenERC721 {
    enum Status {
        NotFilled,
        Filled,
        Winning,
        Payed
    }

    struct DataOfTicket {
        uint256 drawId;
        bytes32[3] combinationOfTicket;
        Status status;
    }

    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public lastIdOfToken;
    uint8 public allowedToMintInOneTransaction = 20;
    uint8 public allowedToMigrateInOneTransaction = 10;
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
    address public addressOfMigrationAgent; // For migration
    address public addressOfContractKassa;
    bool public isSetAddressOfContractTicketsSale;
    bool public isSetAddressOfContractDraw;

    Draw public contractDraw;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    event Mint(address indexed _owner, uint256 _amountOfTokens);
    event FillingTicket(uint256 _tokenId);
    event MigrateOneToken(uint256 _tokenId); // For migration
    event MigrateChunkOfTokens(uint256 _indexOfFirstTokenFromTheEnd, uint8 _sizeOfChunk, bool _needContinue); // For migration
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

    modifier onlyIfTokenExists(uint256 _tokenId) {
        require(tokenExists[_tokenId], "Token doesn't exist.");
        _;
    }

    modifier onlyIfSenderNotEqualReciever(address _from, address _to) {
        require(_from != _to, "Sender cannot be reciever.");
        _;
    }

    modifier onlyKassa() {
        require(msg.sender == addressOfContractKassa, "Only contract Kassa can call this.");
        _;
    }

    modifier onlyFilledTicket(uint256 _tokenId) {
        require(dataOfTicket[_tokenId].status == Status.Filled, "Ticket should have status Filled.");
        _;
    }

    modifier onlyWinningTicket(uint256 _tokenId) {
        require(dataOfTicket[_tokenId].status == Status.Winning, "Ticket should have status Winning.");
        _;
    }

    modifier onlyIfSetAddressOfContractDraw() {
        require(isSetAddressOfContractDraw, "Address of contract Draw should be set.");
        _;
    }

    // For migration
    modifier onlyIfNotSetMigrationAgent() {
        require(addressOfMigrationAgent == address(0), "Migration agent already set.");
        _;
    }

    // For migration
    modifier onlyIfSetMigrationAgent() {
        require(addressOfMigrationAgent != address(0), "Migration agent isn't set.");
        _;
    }

    function setAddressOfContractTicketsSale(address _address) public
            onlyAdmin {
        require(!isSetAddressOfContractTicketsSale, "Address of contract TicketsSale already set.");

        addressOfContractTicketsSale = _address;
        isSetAddressOfContractTicketsSale = true;
    }

    function setAddressOfContractDraw(address _address) public
            onlyAdmin {
        require(!isSetAddressOfContractDraw, "Address of contract Draw already set.");

        addressOfContractDraw = _address;
        contractDraw = Draw(_address);
        isSetAddressOfContractDraw = true;
    }

    function setAddressOfContractKassa(address _address) public
            onlyAdmin {
        require(addressOfContractKassa == address(0), "Address of contract Kassa already set.");
        addressOfContractKassa = _address;
    }

    function setTicketStatusWinning(uint256 _tokenId) public
            onlyIfSetAddressOfContractDraw
            onlyKassa
            onlyFilledTicket(_tokenId) {
        require(contractDraw.isAcceptRequestPeriod(), "Stage of current draw should be 'Accepting request on winning'");
        dataOfTicket[_tokenId].status = Status.Winning;
    }

    function setTicketStatusPayed(uint256 _tokenId) public
            onlyKassa
            onlyWinningTicket(_tokenId) {
        dataOfTicket[_tokenId].status = Status.Payed;
    }

    function getDataOfTicket(uint256 _tokenId) view public returns(uint256 _drawId, bytes32[3] _combinationOfTicket, Status _status) {
        DataOfTicket memory _dataOfTicket = dataOfTicket[_tokenId];
        return (_dataOfTicket.drawId, _dataOfTicket.combinationOfTicket, _dataOfTicket.status);
    }

    function mint(address _owner, uint256 _amountOfTokens) public
            onlyIfNotSetMigrationAgent
            onlyIfSetAddressOfContractDraw {
        require(msg.sender == addressOfContractTicketsSale, "Sender should be the contract TicketsSale.");
        require(_owner != address(0), "Owner cannot be 0.");
        require(_amountOfTokens <= allowedToMintInOneTransaction, "Owner cannot mint more than 20 tickets in one transaction.");

        uint256 drawId = contractDraw.currentDrawId();
        require(contractDraw.isSellingTicketPeriod(), "Stage of current draw should be 'Sale of tickets'");

        uint256 indexOfNextToken = balanceOf[_owner]; // index to put to tokenOfOwnerByIndex, indexOfTokenForOwner
        uint256 idOfNextToken = lastIdOfToken + 1; // id to use as current tokenId
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

        lastIdOfToken += _amountOfTokens;
        totalSupply += _amountOfTokens;
        totalTicketsInDraw[drawId] += _amountOfTokens;
        balanceOf[_owner] += _amountOfTokens;

        emit Mint(_owner, _amountOfTokens);
    }

    function transfer(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public
            onlyOwnerOfToken(msg.sender, _tokenId)
            onlyNotFilledTicket(_tokenId)
            onlyIfTokenExists(_tokenId)
            onlyIfSenderNotEqualReciever(msg.sender, _to) {
        allowance[msg.sender][_tokenId] = _to;

        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        address ownerOfToken = ownerOf[_tokenId];

        require(allowance[ownerOfToken][_tokenId] == msg.sender, "Sender doesn't have approve to get token by id.");

        _transfer(ownerOfToken, msg.sender, _tokenId); // transfer token to reciever and clear allowance
    }

    function fillCombinationOfTicket(uint256 _tokenId, bytes32[3] _numbers) public
            onlyOwnerOfToken(msg.sender, _tokenId)
            onlyNotFilledTicket(_tokenId) {
        require(_numbers[0] != _numbers[1] && _numbers[0] != _numbers[2] && _numbers[1] != _numbers[2], "Numbers cannot repeat.");
        require(allowance[msg.sender][_tokenId] == address(0), "Sender cannot fill promised token.");

        uint256 drawIdCurrent = contractDraw.currentDrawId();
        uint256 drawIdOfTicket = dataOfTicket[_tokenId].drawId;
        require(drawIdCurrent == drawIdOfTicket, "Filling of ticket is available only for current draw.");
        require(contractDraw.isFillingTicketPeriod(), "Stage of current draw should be 'Sale of tickets' or 'Filling tickets without sale'");

        dataOfTicket[_tokenId].combinationOfTicket = _numbers;
        dataOfTicket[_tokenId].status = Status.Filled;

        emit FillingTicket(_tokenId);
        //emit TestCombination(dataOfTicket[_tokenId].combinationOfTicket);
    }

    // For migration
    function startOutcomingMigration(address _addressOfMigrationAgent) public
            onlyAdmin
            onlyIfNotSetMigrationAgent {
        addressOfMigrationAgent = _addressOfMigrationAgent;
    }

    // For migration
    function migrateOneToken(uint256 _tokenId) public
            onlyIfSetMigrationAgent
            onlyOwnerOfToken(msg.sender, _tokenId)
            onlyIfTokenExists(_tokenId) {
        DataOfTicket memory _dataOfTicket = dataOfTicket[_tokenId];

        changeOwnerDataOfToken(msg.sender, address(0), _tokenId); // delete owner data of token without sending to anybody
        ownerOf[_tokenId] = address(0);
        tokenExists[_tokenId] = false;
        totalSupply--;
        totalTicketsInDraw[_dataOfTicket.drawId]--;

        MigrationAgent(addressOfMigrationAgent).migrateOneTokenFrom(msg.sender, _tokenId, _dataOfTicket.drawId, _dataOfTicket.combinationOfTicket, uint8(_dataOfTicket.status));

        emit MigrateOneToken(_tokenId);
    }

    // For migration
    function migrateChunkOfTokens(uint256 _indexOfFirstTokenFromTheEnd, uint8 _sizeOfChunk) public
            onlyIfSetMigrationAgent {
        uint256 balanceOfSender = balanceOf[msg.sender];
        bool needContinue = true;
        uint256 tokenId;

        require(allowedToMigrateInOneTransaction >= _sizeOfChunk, "Sender cannot migrate more tokens than 10 in one transaction.");
        require(balanceOfSender >= _sizeOfChunk, "Sender cannot migrate more tokens than he has.");
        require(_indexOfFirstTokenFromTheEnd == balanceOfSender-1, "Index of first token from the end should be the last index of token of owner.");

        uint256 currentDrawId = contractDraw.currentDrawId();

        uint256 indexOfLastMigratedToken = balanceOfSender - _sizeOfChunk;
        for(uint256 i = _indexOfFirstTokenFromTheEnd; i >= indexOfLastMigratedToken; i--) {
            tokenId = tokenOfOwnerByIndex[msg.sender][i];
            if (dataOfTicket[tokenId].drawId != currentDrawId) {
                needContinue = false;
                break;
            }
            migrateOneToken(tokenId);
            if (i == 0) {
                needContinue = false;
                break;
            }
        }

        emit MigrateChunkOfTokens(_indexOfFirstTokenFromTheEnd, _sizeOfChunk, needContinue);
    }

    //=========+++ Additional functions +++==========//
    function _transfer(address _from, address _to, uint256 _tokenId) internal
            onlyOwnerOfToken(_from, _tokenId)
            onlyNotFilledTicket(_tokenId)
            onlyIfTokenExists(_tokenId)
            onlyIfSenderNotEqualReciever(_from, _to)
            onlyIfSetAddressOfContractDraw {
        uint256 currentDrawId = contractDraw.currentDrawId();

        require(_to != address(0), "Reciever cannot be 0");
        require(dataOfTicket[_tokenId].drawId == currentDrawId, "Sender can transfer tickets only from current draw.");

        changeOwnerDataOfToken(_from, _to, _tokenId);

        emit Transfer(_from, _to, _tokenId);
    }

    function changeOwnerDataOfToken(address _from, address _to, uint256 _tokenId) internal {
        uint256 indexOfLastTokenOfOwner = balanceOf[_from]-1;
        uint256 indexOfCurrentTokenOfOwner = indexOfTokenForOwner[_tokenId];

        // Delete tokenId for owner from tokenOfOwnerByIndex
        uint256 lastTokenOfOwner = tokenOfOwnerByIndex[_from][indexOfLastTokenOfOwner];
        if (indexOfCurrentTokenOfOwner != indexOfLastTokenOfOwner) {
            tokenOfOwnerByIndex[_from][indexOfCurrentTokenOfOwner] = lastTokenOfOwner;
            indexOfTokenForOwner[lastTokenOfOwner] = indexOfCurrentTokenOfOwner; // Set new index for last token
        }
        if (_to == address(0)) {
            indexOfTokenForOwner[_tokenId] = 0; // Delete index of token
        }
        tokenOfOwnerByIndex[_from][indexOfLastTokenOfOwner] = 0;
        balanceOf[_from] -= 1;

        // Clear allowance only if it's not zero
        if (allowance[_from][_tokenId] != address(0)) {
            allowance[_from][_tokenId] = address(0);
        }

        if (_to != address(0)) {
            // Set new index of token
            uint256 indexOfNextTokenForReciever = balanceOf[_to];
            indexOfTokenForOwner[_tokenId] = indexOfNextTokenForReciever;

            // Move tokenId to reciever
            ownerOf[_tokenId] = _to;
            tokenOfOwnerByIndex[_to][indexOfNextTokenForReciever] = _tokenId;
            balanceOf[_to] += 1;
        }
    }
    //=========--- Additional functions ---==========//

    function getTicketCombination(uint256 ticketId) public view returns (bytes32[3]){
        return dataOfTicket[ticketId].combinationOfTicket;
    }

    function getTicketDrawId(uint256 ticketId) public view returns (uint256){
        return dataOfTicket[ticketId].drawId;
    }

    function getTicketStatus(uint256 ticketId) public view returns (Status){
        return dataOfTicket[ticketId].status;
    }
}
