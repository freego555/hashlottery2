pragma solidity ^0.4.24;

//import "./TokenERC721.sol";

contract NewTokenERC721 {
//contract NewTokenERC721 is TokenERC721 {
    /******* EXTEND **************/
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
    uint256 public lastIdOfToken;
    uint256 public lastIdOfDraw; // For migration
    uint16 public allowedToMintInOneTransaction = 100;
    mapping(uint256 => uint256) public totalTicketsInDraw; // [draw] = amount of tickets
    mapping(address => uint256) public balanceOf; // [owner] = amount of tokens
    mapping(uint256 => address) public ownerOf; // [tokenId] = owner of token
    mapping(address => mapping(uint256 => uint256)) public tokenOfOwnerByIndex; //[owner][index] = tokenId
    mapping(uint256 => uint256) public indexOfTokenForOwner; // [tokenId] = position in user's wallet
    mapping(address => mapping(uint256 => address)) public allowance; // [owner][tokenId] = reciever
    mapping(uint256 => bool) public tokenExists; // [tokenId] = token is exist
    mapping(uint256 => DataOfTicket) public dataOfTicket; // [tokenId] = data of ticket

    address public admin;
    address public addressOfMigrationAgent; // For migration

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);

    function getDataOfTicket(uint256 _tokenId) view public returns(uint256 _drawId, bytes32[3] _combinationOfTicket, Status _status) {
        DataOfTicket memory _dataOfTicket = dataOfTicket[_tokenId];
        return (_dataOfTicket.drawId, _dataOfTicket.combinationOfTicket, _dataOfTicket.status);
    }
    /******* EXTEND **************/

    uint256 public totalMigrated; // For migration
    bool public isMigrationStarted = true; // For migration
    bool public isMigrationInitiated; // For migration

    constructor(address _addressOfMigrationAgent) public {
        addressOfMigrationAgent = _addressOfMigrationAgent;
    }

    // For migration
    modifier onlyMigrationAgent() {
        require(msg.sender == addressOfMigrationAgent, "Only contract of migration agent can call this.");
        _;
    }

    // For migration
    modifier onlyIfMigrationStarted() {
        require(isMigrationStarted, "Migration should be started.");
        _;
    }

    // For migration
    modifier onlyIfMigrationInitiated() {
        require(isMigrationInitiated, "Migration should be initiated.");
        _;
    }

    // For migration
    function initiateMigration(uint256 _lastIdOfToken) public
            onlyMigrationAgent
            onlyIfMigrationStarted {
        require(!isMigrationInitiated, "Migration already initiated.");
        lastIdOfToken = _lastIdOfToken;
        isMigrationInitiated = true;
    }

    // For migration
    function createToken(address _to, uint256 _tokenId, uint256 _drawId, bytes32[3] _combinationOfTicket, uint8 _status) public
            onlyMigrationAgent
            onlyIfMigrationStarted
            onlyIfMigrationInitiated {
        uint256 indexOfNextToken = balanceOf[_to];

        tokenExists[_tokenId] = true;
        ownerOf[_tokenId] = _to;
        indexOfTokenForOwner[_tokenId] = indexOfNextToken;
        tokenOfOwnerByIndex[_to][indexOfNextToken] = _tokenId;
        balanceOf[_to]++;
        totalSupply++;
        totalMigrated++;
        totalTicketsInDraw[_drawId]++;

        dataOfTicket[_tokenId].drawId = _drawId;
        dataOfTicket[_tokenId].combinationOfTicket = _combinationOfTicket;

        dataOfTicket[_tokenId].status = Status(_status);

        emit Transfer(addressOfMigrationAgent, _to, _tokenId);
    }

    // For migration
    function finalizeMigration() public
            onlyMigrationAgent
            onlyIfMigrationStarted
            onlyIfMigrationInitiated {
        addressOfMigrationAgent = address(0);
        isMigrationStarted = false;
        isMigrationInitiated = false;
    }
}
