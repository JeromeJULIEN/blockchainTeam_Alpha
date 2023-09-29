// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title BlockchainTeamV1
 * @author Jerome.devvv3
 * @dev Main contract for managing artists and collections from the blockchain team
 */
contract BlockchainTeam is AccessControl {
    /// @notice ADMIN_ROLE is used to check access right to some functions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /**
     * @dev Struct to represent a collection.
     * @param id Unique identifier for the collection.
     * @param contractAddress Address of the collection's contract.
     * @param checkoutLink Payment link for the collection.
     * @param artistId Identifier of the associated artist.
     */
    struct Collection {
        uint id;
        string contractAddress;
        // string checkoutLink;
        uint artistId;
        Nft[] nfts;
    }

    struct Nft {
        uint price;
        string checkoutLink;
    }

    mapping(uint => Nft[]) public nftOfCollection;

    /// @notice List of existing collections.
    Collection[] public collections;

    /// @notice Total number of collections.
    uint public collectionCount;

    /**
     * @dev Struct to represent an artist.
     * @param id Unique identifier for the artist.
     * @param firstName Artist's first name.
     * @param lastName Artist's last name.
     * @param description Artist's description.
     * @param profilePicture URL of the artist's profile picture.
     */
    struct Artist {
        uint id;
        string firstName;
        string lastName;
        string description;
        string profilPicture;
    }

    /// @notice List of existing artists.
    Artist[] public artists;

    /// @notice Total number of artists.
    uint public artistCount;

    //==========================================
    // :::: EVENT ::::
    //==========================================

    // Collection events
    /// @notice Event emitted when a collection is created.
    event CollectionCreated(
        uint indexed id,
        string contractAddress,
        uint artistId
    );

    /// @notice Event emitted when a collection is updated.
    event CollectionUpdated(uint indexed id, string newContractAddress);

    /// @notice Event emitted when a collection is deleted.
    event CollectionDeleted(uint indexed id);

    // Artist events
    /// @notice Event emitted when an artist is created.
    event ArtistCreated(
        uint indexed id,
        string firstName,
        string lastName,
        string description,
        string profilePicture
    );

    /// @notice Event emitted when an artist is updated.
    event ArtistUpdated(
        uint indexed id,
        string newFirstName,
        string newLastName,
        string newDescription,
        string newProfilPicture
    );

    /// @notice Event emitted when an artist is deleted.
    event ArtistDeleted(uint indexed id);

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

    /**
     * @dev Constructor to initialize the contract and grant DEFAULT_ADMIN_ROLE.
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    //==========================================
    // :::: ARTIST FUNCTIONS ::::
    //==========================================
    /**
     * @dev Create a new artist.
     * @param _firstName First name of the artist.
     * @param _lastName Last name of the artist.
     * @param _description Description of the artist.
     * @param _pictureURL URL of the artist's picture.
     */
    function createArtist(
        string memory _firstName,
        string memory _lastName,
        string memory _description,
        string memory _pictureURL
    ) external onlyAdmin {
        artists.push(
            Artist(
                artistCount,
                _firstName,
                _lastName,
                _description,
                _pictureURL
            )
        );
        emit ArtistCreated(
            artistCount,
            _firstName,
            _lastName,
            _description,
            _pictureURL
        );
        artistCount++;
    }

    /**
     * @dev Get all artists.
     * @return artistsList array of existing artists.
     */
    function getAllArtists()
        external
        view
        returns (Artist[] memory artistsList)
    {
        return artists;
    }

    /**
     * @dev Get an artist by his ID.
     * @param _id The artist's ID.
     * @return foundArtist artist's information.
     */
    function getArtistById(
        uint _id
    ) external view returns (Artist memory foundArtist) {
        bool found;
        for (uint i = 0; i < artists.length; i++) {
            if (artists[i].id == _id) {
                found = true;
                return artists[i];
            }
        }
        require(found == true, "no artist with this id");
    }

    /**
     * @dev Check if an artist with the given ID exists.
     * @param _id The ID of the artist to check.
     * @return True if the artist exists, false otherwise.
     */
    function isArtistExisting(uint _id) internal view returns (bool) {
        for (uint i = 0; i < artists.length; i++) {
            if (artists[i].id == _id) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Checks if an artist has a collection associated with their ID.
     * @param _artistId The ID of the artist to check.
     * @return hasCollection A boolean indicating whether the artist has a collection.
     */
    function doesArtistHaveCollection(
        uint _artistId
    ) internal view returns (bool hasCollection) {
        // Iterate through all collections to find a matching artist ID.
        for (uint i = 0; i < collections.length; i++) {
            // If a collection with a matching artist ID is found, return true.
            if (collections[i].artistId == _artistId) {
                return true;
            }
        }
        // If no matching collection is found, return false.
        return false;
    }

    /**
     * @dev Update an artist's information.
     * @param _id The artist's ID.
     * @param _newFirstName New first name of the artist.
     * @param _newLastName New last name of the artist.
     * @param _newDescription New description of the artist.
     * @param _newPictureURL New URL of the artist's picture.
     */
    function updateArtist(
        uint _id,
        string memory _newFirstName,
        string memory _newLastName,
        string memory _newDescription,
        string memory _newPictureURL
    ) external onlyAdmin {
        bool modificated;
        uint nbOfArtist = artists.length;
        for (uint i = 0; i < nbOfArtist; i++) {
            if (artists[i].id == _id) {
                artists[i].firstName = _newFirstName;
                artists[i].lastName = _newLastName;
                artists[i].description = _newDescription;
                artists[i].profilPicture = _newPictureURL;
                modificated = true;
                emit ArtistUpdated(
                    _id,
                    _newFirstName,
                    _newLastName,
                    _newDescription,
                    _newPictureURL
                );
                break;
            }
        }
        require(modificated == true, "no artist with this id");
    }

    /**
     * @dev Delete an artist by their ID.
     * @dev Require that the artist to delete doesn't have any collection associated to him
     * @param _id The artist's ID.
     */
    function deleteArtist(uint _id) external onlyAdmin {
        require(!doesArtistHaveCollection(_id), "artist has collection");
        bool deleted;
        uint nbOfArtist = artists.length;
        for (uint i = 0; i < nbOfArtist; i++) {
            if (artists[i].id == _id) {
                artists[i].id = artists[nbOfArtist - 1].id;
                artists[i].firstName = artists[nbOfArtist - 1].firstName;
                artists[i].lastName = artists[nbOfArtist - 1].lastName;
                artists[i].description = artists[nbOfArtist - 1].description;
                artists[i].profilPicture = artists[nbOfArtist - 1]
                    .profilPicture;
                artists.pop();
                emit ArtistDeleted(_id);
                deleted = true;
                break;
            }
        }
        require(deleted == true, "no collection with this id");
    }

    //==========================================
    // :::: COLLECTION FUNCTIONS ::::
    //==========================================
    /**
     * @dev Create a new collection.
     * @dev Require that artist Id is existing
     * @param _contractAddress Address of the collection's contract.
     * @param _artistId ID of the associated artist.
     */
    function createCollection(
        string memory _contractAddress,
        // string memory _checkoutLink,
        uint _artistId
    ) external onlyAdmin {
        require(isArtistExisting(_artistId), "non existing artist");

        collections.push();
        uint index = collections.length - 1;
        collections[index].contractAddress = _contractAddress;
        collections[index].artistId = _artistId;
        /*Collection memory newCollection = Collection({
            id : collectionCount,
            contractAddress: _contractAddress,
            artistId: _artistId,
            nfts : new Nft[](0)
        });
        collections.push(newCollection);
        emit CollectionCreated(collectionCount, _contractAddress, _artistId);
        collectionCount++;*/
    }

    /**
     * @dev Get all collections.
     * @return collectionsList array of existing collections.
     */
    function getAllCollections()
        external
        view
        returns (Collection[] memory collectionsList)
    {
        return collections;
    }

    function addNftToCollection(
        uint _collectionId,
        uint _price,
        string memory _checkoutLink
    ) external onlyAdmin {
        Nft memory newNft = Nft({price: _price, checkoutLink: _checkoutLink});
        nftOfCollection[_collectionId].push(newNft);
    }

    function getNftsOfCollection(
        uint collectionId
    ) public view returns (Nft[] memory) {
        return nftOfCollection[collectionId];
    }

    /**
     * @dev Get a collection by its ID.
     * @param _id The collection's ID.
     * @return foundCollection The collection's information.
     */
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

    /**
     * @dev Update a collection's information.
     * @dev The artist cannot be modified
     * @param _id The collection's ID.
     * @param _newContractAddress New contract address of the collection.
     */
    function updateCollection(
        uint _id,
        string memory _newContractAddress
    )
        external
        // string memory _newCheckoutLink
        onlyAdmin
    {
        bool modificated;
        uint nbOfCollection = collections.length;
        for (uint i = 0; i < nbOfCollection; i++) {
            if (collections[i].id == _id) {
                collections[i].contractAddress = _newContractAddress;
                // collections[i].checkoutLink = _newCheckoutLink;
                modificated = true;
                emit CollectionUpdated(_id, _newContractAddress);
                break;
            }
        }
        require(modificated == true, "no collection with this id");
    }

    /**
     * @dev Delete a collection by its ID.
     * @param _id The collection's ID.
     */
    function deleteCollection(uint _id) external onlyAdmin {
        bool deleted;
        uint nbOfCollection = collections.length;
        for (uint i = 0; i < nbOfCollection; i++) {
            if (collections[i].id == _id) {
                collections[i].id = collections[nbOfCollection - 1].id;
                collections[i].contractAddress = collections[nbOfCollection - 1]
                    .contractAddress;
                collections[i].artistId = collections[nbOfCollection - 1]
                    .artistId;
                collections[i].nfts = collections[nbOfCollection - 1].nfts;
                collections.pop();
                emit CollectionDeleted(_id);
                deleted = true;
                break;
            }
        }
        require(deleted == true, "no collection with this id");
    }
}
