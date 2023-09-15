
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Blockchain team V1", function () {
    async function contractFixture() {
        const Contract = await ethers.getContractFactory("BlockchainTeamV1")
        const contract = await Contract.deploy()

        return { contract }
    }

    describe("create function", function () {
        it("Should create a new collection", async function () {
            const { contract } = await loadFixture(contractFixture)
            await expect(contract.collections(0)).to.be.reverted
            // creation of two collections
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x2", "http://2")
            // check the creations and values
            expect((await contract.collections(0)).contractAddress).to.be.equal('0x')
            expect((await contract.collections(0)).checkoutLink).to.be.equal('http://')
            expect((await contract.collections(1)).contractAddress).to.be.equal('0x2')
            expect((await contract.collections(1)).checkoutLink).to.be.equal('http://2')
            await expect(contract.collections(2)).to.be.reverted
        })
        it("Should revert if not admin", async function () {
            const { contract } = await loadFixture(contractFixture)
            const [owner, otherAccount] = await ethers.getSigners();
            // assert the revert
            await expect(contract.connect(otherAccount).createCollection("0x", "http://")).to.be.revertedWith("AccessControl : Caller don't have ADMIN_ROLE")
            // grant role and assert the value
            await contract.grantRole("0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775", otherAccount.address)
            await contract.connect(otherAccount).createCollection("0x", "http://")
            expect((await contract.collections(0)).contractAddress).to.be.equal('0x')
            expect((await contract.collections(0)).checkoutLink).to.be.equal('http://')
            await expect(contract.collections(1)).to.be.reverted
        })
    })
    describe('getAllCollections function test', () => {
        it("Should return all the collections", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collections creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x2", "http://2")
            const collections = await contract.getAllCollections()
            // check of the returned values
            expect(collections[0].id).to.be.equal(0)
            expect(collections[0].contractAddress).to.be.equal("0x")
            expect(collections[0].checkoutLink).to.be.equal("http://")
            expect(collections[1].id).to.be.equal(1)
            expect(collections[1].contractAddress).to.be.equal("0x2")
            expect(collections[1].checkoutLink).to.be.equal("http://2")
            expect(collections.length).to.be.equal(2)
        })
    })
    describe("getCollectionById function test", () => {
        it("Should return the requested collection", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collection creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x1", "http://1")
            await contract.createCollection("0x2", "http://2")
            // get one collection
            const collection0 = await contract.getCollectionById(0)
            expect(collection0.contractAddress).to.be.equal("0x")
            expect(collection0.checkoutLink).to.be.equal("http://")
            // delete and get on collection
            await contract.deleteCollection(0)
            const collection1 = await contract.getCollectionById(1)
            expect(collection1.contractAddress).to.be.equal("0x1")
            expect(collection1.checkoutLink).to.be.equal("http://1")
            // update and get collection
            await contract.updateCollection(1, "0x1new", "http://1new")
            const newCollection1 = await contract.getCollectionById(1)
            expect(newCollection1.contractAddress).to.be.equal("0x1new")
            expect(newCollection1.checkoutLink).to.be.equal("http://1new")
        })
        it("Should revert if collection id not found", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collection creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x1", "http://1")
            await contract.createCollection("0x2", "http://2")
            // testing revert
            await expect(contract.getCollectionById(4)).to.be.revertedWith("no collection with this id")
        })
    })
    describe("update collections test", () => {
        it("Should update a collection", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collection creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x2", "http://2")
            const collection = await contract.collections(0)
            // check initial values
            expect(collection.contractAddress).to.be.equal("0x")
            expect(collection.checkoutLink).to.be.equal("http://")
            // update collection id 0
            await contract.updateCollection(0, "new0x", "newhttp://")
            await contract.updateCollection(1, "new0x2", "newhttp://2")
            // check the updated value
            const updatedCollection = await contract.collections(0)
            expect(updatedCollection.contractAddress).to.be.equal("new0x")
            expect(updatedCollection.checkoutLink).to.be.equal("newhttp://")
            // check that the collection id1 didn't change
            const otherCollection = await contract.collections(1)
            expect(otherCollection.contractAddress).to.be.equal("new0x2")
            expect(otherCollection.checkoutLink).to.be.equal("newhttp://2")
        })
        it("Should revert if collection id doesn't exist", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collection creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x2", "http://2")
            await expect(contract.updateCollection(2, "xx", "xx")).to.be.rejectedWith("no collection with this id")
        })
        it("Should modify the good collection even after a delete", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collection creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x2", "http://2")
            await contract.createCollection("0x3", "http://3") // id 2
            // deletion of collection with id 1
            await contract.deleteCollection(1)
            // modification of collection id 2
            await contract.updateCollection(2, "new0x3", "newhttp://3")
            const collections = await contract.getAllCollections()
            expect(collections[1].contractAddress).to.be.equal("new0x3")
            expect(collections[1].checkoutLink).to.be.equal("newhttp://3")
        })
    })
    describe("delete collection test", () => {
        it("Should delete the selected collection", async () => {
            const { contract } = await loadFixture(contractFixture)
            // collection creation
            await contract.createCollection("0x", "http://")
            await contract.createCollection("0x2", "http://2")
            await contract.createCollection("0x3", "http://3")
            // check collections length
            const collections = await contract.getAllCollections()
            expect(collections.length).to.be.equal(3)
            // delete collection id1
            await contract.deleteCollection(1)
            // check collections remaining
            const colelctionsUpdated = await contract.getAllCollections()
            expect(colelctionsUpdated.length).to.be.equal(2)
            expect(colelctionsUpdated[0].contractAddress).to.be.equal("0x")
            expect(colelctionsUpdated[0].checkoutLink).to.be.equal("http://")
            expect(colelctionsUpdated[1].contractAddress).to.be.equal("0x3")
            expect(colelctionsUpdated[1].checkoutLink).to.be.equal("http://3")
        })
    })
})