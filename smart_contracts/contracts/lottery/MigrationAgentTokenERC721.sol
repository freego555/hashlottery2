pragma solidity ^0.4.24;

interface TokenERC721 {
    function totalSupply() external returns(uint256);
    function lastIdOfToken() external returns(uint256);
}

interface NewTokenERC721 {
    function createToken(address _from, uint256 _tokenId, uint256 _drawId, bytes32[3] _combinationOfTicket, uint8 _status) external;
    function initiateMigration(uint256 _lastIdOfToken) external;
    function totalMigrated() external returns(uint256);
    function finalizeMigration() external;
}

interface Draw {
    function currentDrawId() external view returns(uint256 _drawId);
}

contract MigrationAgentTokenERC721 {
    address public addressOfNewToken;
    address public addressOfOldToken;
    address public addressOfDraw;
    address public admin;

    uint256 public migrationSupply;
    uint256 public lastIdOfDraw;
    bool public isMigrationInitiated;

    constructor(address _addressOfOldToken, address _addressOfDraw) public {
        admin = msg.sender;
        addressOfOldToken = _addressOfOldToken;
        addressOfDraw = _addressOfDraw;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this.");
        _;
    }

    modifier onlyIfMigrationInitiated() {
        require(isMigrationInitiated, "Migration should be initiated.");
        _;
    }

    modifier onlyIfSetAddressOfOldToken() {
        require(addressOfOldToken != address(0), "Address of old token should be set.");
        _;
    }

    modifier onlyIfSetAddressOfNewToken() {
        require(addressOfNewToken != address(0), "Address of new token should be set.");
        _;
    }

    modifier onlyIfSetAddressOfDraw() {
        require(addressOfDraw != address(0), "Address of contract Draw should be set.");
        _;
    }

    modifier onlyOldToken() {
        require(addressOfOldToken == msg.sender, "Sender should be old token.");
        _;
    }

    function setAddressOfNewToken(address _address) public
            onlyAdmin {
        require(addressOfNewToken == address(0), "Address of new token already set.");
        addressOfNewToken = _address;
    }

    function initiateMigration() public
            onlyAdmin
            onlyIfSetAddressOfOldToken
            onlyIfSetAddressOfNewToken
            onlyIfSetAddressOfDraw {
        require(!isMigrationInitiated, "Migration already initiated.");

        TokenERC721 contractTokenERC721 = TokenERC721(addressOfOldToken);

        isMigrationInitiated = true;
        migrationSupply = contractTokenERC721.totalSupply();
        lastIdOfDraw = Draw(addressOfDraw).currentDrawId();

        NewTokenERC721(addressOfNewToken).initiateMigration(contractTokenERC721.lastIdOfToken());
    }

    function migrateOneTokenFrom(address _from, uint256 _tokenId, uint256 _drawId, bytes32[3] memory _combinationOfTicket, uint8 _status) public
            onlyOldToken
            onlyIfMigrationInitiated
            onlyIfSetAddressOfNewToken {
        require(_drawId == lastIdOfDraw, "You can migrate tickets only from last draw.");

        safetyInvariantCheck(1);
        NewTokenERC721(addressOfNewToken).createToken(_from, _tokenId, _drawId, _combinationOfTicket, _status);
        safetyInvariantCheck(0);
    }

    /*function migrateChunkOfTokensFrom() public {
    }*/

    function safetyInvariantCheck(uint16 _value) view private
            onlyIfSetAddressOfNewToken {
        require(TokenERC721(addressOfOldToken).totalSupply() + NewTokenERC721(addressOfNewToken).totalMigrated() == migrationSupply - _value, "Total supply of contracts isn't check.");
    }

    function finalizeMigration() public
            onlyAdmin
            onlyIfMigrationInitiated
            onlyIfSetAddressOfOldToken
            onlyIfSetAddressOfNewToken {
        safetyInvariantCheck(0);

        isMigrationInitiated = false;
        migrationSupply = 0;
        addressOfDraw = address(0);
        addressOfOldToken = address(0);

        address _addressOfNewToken = addressOfNewToken;
        addressOfNewToken = address(0);
        NewTokenERC721(_addressOfNewToken).finalizeMigration();
    }
}
