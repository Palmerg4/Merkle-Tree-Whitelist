const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

function encodeMerkleLeaf(address, allowance) {
    return ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [address, allowance]
    );
}

describe("Determine merkle root is working as intended", () => {
    it("should verify address is included in merkle root", async () => {
        const [owner, addr1, addr2, addr3, addr4, addr5] =
            await ethers.getSigners();

        const ls = [
            encodeMerkleLeaf(owner.address, 2),
            encodeMerkleLeaf(addr1.address, 2),
            encodeMerkleLeaf(addr2.address, 2),
            encodeMerkleLeaf(addr3.address, 2),
            encodeMerkleLeaf(addr4.address, 2),
            encodeMerkleLeaf(addr5.address, 2),
        ];

        const merkleTree = new MerkleTree(ls, keccak256, {
            hashLeaves: true,
            sortPairs: true,
        });

        const root = merkleTree.getHexRoot();

        const whitelist = await ethers.getContractFactory("MerkleWhitelist");
        const Whitelist = await whitelist.deploy(root);
        await Whitelist.deployed();

        const leaf = keccak256(ls[0]);
        const proof = merkleTree.getHexProof(leaf);

        let verified = await Whitelist.checkMerkleProof(proof, 2);
        expect(verified).to.equal(true);

        verified = await Whitelist.checkMerkleProof([], 2);
        expect(verified).to.equal(false);
    });
});