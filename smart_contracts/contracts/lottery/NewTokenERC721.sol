pragma solidity ^0.4.24;

import "./TokenERC721.sol";

contract NewTokenERC721 is TokenERC721 {
    uint256 public totalMigrated; // For migration

    constructor() {
        //lastIdOfToken =
    }

    // For migration
    modifier onlyMigrationAgent(address _from) {
        require(_from == addressOfMigrationAgent, "Only contract of migration agent can call this.");
        _;
    }

    // For migration
    function createToken(address _to, uint256 _tokenId, uint256 _drawId, Status _status, byte32[3] _combinationOfTicket) public onlyMigrationAgent(msg.sender) {
        uint256 indexOfNextToken = balanceOf[_to];

        tokenExists[_tokenId] = true;
        ownerOf[_tokenId] = _to;
        indexOfTokenForOwner[_tokenId] = indexOfNextToken;
        tokenOfOwnerByIndex[_to][indexOfNextToken] = _tokenId;
        balanceOf[_to]++;
        totalSupply++;

        dataOfTicket[_tokenId].drawId = _drawId;
        dataOfTicket[_tokenId].status = _status;
        dataOfTicket[_tokenId].combinationOfTicket = _combinationOfTicket;

        totalMigrated++;

        emit Transfer(addressOfMigrationAgent, _to, _tokenId);
    }

    // For migration
    function finalizeMigration() public onlyMigrationAgent(msg.sender) {

    }
}
