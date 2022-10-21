// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleWhitelist {

    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function checkMerkleProof(bytes32[] calldata proof, uint256 maxAllowance) view public returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowance));
        bool verifiedUser = MerkleProof.verify(proof, merkleRoot, leaf);
        return verifiedUser;
    }
}