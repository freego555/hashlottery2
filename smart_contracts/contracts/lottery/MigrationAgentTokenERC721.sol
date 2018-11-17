pragma solidity ^0.4.24;

interface TokenERC721 {
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

    function dataOfTicket(uint256 _tokenId) external returns(DataOfTicket);
}

interface NewTokenERC721 {
    function createToken(address _from, uint256 _tokenId) external;
}

contract MigrationAgentTokenERC721 {
    address public addressOfNewToken;
    address public addressOfOldToken;
    address public admin;

    uint256 migrationSupply;

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

    constructor(address _addressOfOldToken, address _addressOfNewToken){
        admin = msg.sender;
        addressOfOldToken = _addressOfOldToken;
        addressOfNewToken = _addressOfNewToken;

        migrationSupply = TokenERC721(_addressOfOldToken).totalSupply();
    }

//    modifier isSetOldToken() {
//        require(addressOfOldToken == address(0), "Address of old token cannot be 0.");
//        _;
//    }
//
//    modifier isSetNewToken() {
//        require(addressOfNewToken == address(0), "Address of new token cannot be 0.");
//        _;
//    }

    function migrateOneTokenFrom(address _from, uint256 _tokenId) public {
        require(addressOfNewToken == address(0), "Address of new token should be set.");
        require(addressOfOldToken == msg.sender, "Sender should be old token.");

        DataOfTicket dataOfTicket = TokenERC721(addressOfOldToken).dataOfTicket(_tokenId);

        safetyInvariantCheck(1);
        NewTokenERC721(addressOfNewToken).createToken(_from, _tokenId, dataOfTicket.drawId, dataOfTicket.status, dataOfTicket.combinationOfTicket);
        safetyInvariantCheck(0);
        //NewTokenERC721(addressOfNewToken).createToken(_from, _tokenId);
    }

    function migrateChunkOfTokensFrom() public {

    }

    function safetyInvariantCheck(uint16 _value) private {
        require(addressOfNewToken == address(0), "Address of new token should be set.");
        require(TokenERC721(addressOfOldToken).totalSupply + NewTokenERC721(addressOfNewToken).totalMigrated == migrationSupply - _value, "Total supply of contracts isn't check.");
    }

    function finalizeMigration() public {
        require(msg.sender == admin, "Only admin can call this.");
        safetyInvariantCheck(0);

        migrationSupply = 0;
        addressOfOldToken = address(0);
        addressOfNewToken = address(0);

        NewTokenERC721(addressOfNewToken).finalizeMigration();
    }
}
