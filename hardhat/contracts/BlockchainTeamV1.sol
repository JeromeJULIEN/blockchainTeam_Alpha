// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract BlockchainTeamV1 is AccessControl {
    /// @notice ADMIN_ROLE is used to check access right to some functions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Collection {
        uint id;
        string contractAddress;
        string checkoutLink;
    }

    Collection[] public collections;
    uint public CollectionCount;

    event CollectionCreated(
        uint indexed id,
        string contractAddress,
        string checkoutLink
    );
    event CollectionUpdated(
        uint indexed id,
        string newContractAddress,
        string newCheckoutLink
    );
    event CollectionDeleted(uint indexed id);

    //==========================================
    // :::: MODIFIERS ::::
    //==========================================

    /// @notice Modifier to check admin role
    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(ADMIN_ROLE, msg.sender),
            "AccessControl : Caller don't have ADMIN_ROLE"
        );
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createCollection(
        string memory _contractAddress,
        string memory _checkoutLink
    ) public onlyAdmin {
        collections.push(
            Collection(CollectionCount, _contractAddress, _checkoutLink)
        );
        emit CollectionCreated(
            CollectionCount,
            _contractAddress,
            _checkoutLink
        );
        CollectionCount++;
    }

    function getAllCollections() public view returns (Collection[] memory) {
        return collections;
    }

    function updateCollection(
        uint _id,
        string memory _newContractAddress,
        string memory _newCheckoutLink
    ) public onlyAdmin {
        require(_id < CollectionCount, "Invalid Collection ID");
        collections[_id].contractAddress = _newContractAddress;
        collections[_id].checkoutLink = _newCheckoutLink;
        emit CollectionUpdated(_id, _newContractAddress, _newCheckoutLink);
    }

    function deleteCollection(uint _id) public onlyAdmin {
        require(_id < CollectionCount, "Invalid Collection ID");
        for (uint i = _id; i < (collections.length - 1); i++) {
            collections[i] = collections[i + 1];
        }
        collections.pop();
        CollectionCount--;
        emit CollectionDeleted(_id);
    }
}
