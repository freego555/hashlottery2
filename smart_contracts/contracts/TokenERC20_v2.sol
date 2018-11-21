pragma solidity ^0.4.24;

import "./TokenERC20.sol";

interface Draw {
    function isBlockedTranferPeriod() external view returns (bool);
}

contract TokenERC20_v2 is TokenERC20 {
    address public addressOfContractDraw;

    modifier onlyIfAllowedTransferInDraw {
        require(!Draw(addressOfContractDraw).isBlockedTranferPeriod(), "Transfer of tokens is blocked for an hour before draw and for an hour after draw.");
        _;
    }

    modifier onlyIfSetAddressOfContractDraw {
        require(addressOfContractDraw != address(0), "Address of contract Draw should be set.");
        _;
    }

    function setAddressOfContractDraw(address _address) public
            onlyOwner {
        require(addressOfContractDraw == address(0), "Address of contract Draw already set.");
        addressOfContractDraw = _address;
    }

    function _transfer(address _from, address _to, uint _value) internal
            onlyIfSetAddressOfContractDraw
            onlyIfAllowedTransferInDraw {
        super._transfer(_from, _to, _value);
    }
}
