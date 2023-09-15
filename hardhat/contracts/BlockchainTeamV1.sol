// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

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
    ) external onlyAdmin {
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

    function getAllCollections() external view returns (Collection[] memory) {
        return collections;
    }

    function getCollectionById(
        uint _id
    ) external view returns (Collection memory foundCollection) {
        bool found;
        for (uint i = 0; i < collections.length; i++) {
            if (collections[i].id == _id) {
                found = true;
                return collections[i];
            }
        }
        require(found == true, "no collection with this id");
    }

    function updateCollection(
        uint _id,
        string memory _newContractAddress,
        string memory _newCheckoutLink
    ) external onlyAdmin {
        bool modificated;
        for (uint i = 0; i < collections.length; i++) {
            if (collections[i].id == _id) {
                collections[i].contractAddress = _newContractAddress;
                collections[i].checkoutLink = _newCheckoutLink;
                modificated = true;
                emit CollectionUpdated(
                    _id,
                    _newContractAddress,
                    _newCheckoutLink
                );
                break;
            }
        }
        require(modificated == true, "no collection with this id");
    }

    function deleteCollection(uint _id) external onlyAdmin {
        bool deleted;
        uint nbOfCollection = collections.length;
        for (uint i = 0; i < nbOfCollection; i++) {
            if (collections[i].id == _id) {
                collections[i].id = collections[nbOfCollection - 1].id;
                collections[i].contractAddress = collections[nbOfCollection - 1]
                    .contractAddress;
                collections[i].checkoutLink = collections[nbOfCollection - 1]
                    .checkoutLink;
                collections.pop();
                emit CollectionDeleted(_id);
                deleted = true;
                break;
            }
        }
        require(deleted == true, "no collection with this id");
    }
}
