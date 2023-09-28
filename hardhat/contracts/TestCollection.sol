// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TestCollection is ERC721Enumerable {
    constructor() ERC721("MyToken", "MTK") {}
}
