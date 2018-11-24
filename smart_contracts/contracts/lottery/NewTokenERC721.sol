pragma solidity ^0.4.24;

import "./TokenERC721.sol";

contract NewTokenERC721 is TokenERC721 {
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
