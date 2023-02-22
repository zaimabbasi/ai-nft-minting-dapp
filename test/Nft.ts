import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Nft", function () {
    async function deployNftFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Nft = await ethers.getContractFactory("Nft");
        const nft = await Nft.deploy();
        return { nft, owner, otherAccount };
    }

    describe("constructor", function () {
        it("assigns a valid name and symbol", async function () {
            const { nft } = await loadFixture(deployNftFixture);
            const name = await nft.name();
            const symbol = await nft.symbol();

            expect(name).to.equal("Nft");
            expect(symbol).to.equal("NFT");
        });

        it("assigns a valid owner", async function () {
            const { nft, owner } = await loadFixture(deployNftFixture);
            const ownerAddress = await nft.owner();

            expect(ownerAddress).to.equal(owner.address);
        });
    });

    describe("safeMint", function () {
        it("allows to mint an Nft token when value is provided equal to the minting fee", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);

            await nft
                .connect(otherAccount)
                .safeMint(otherAccount.address, "", { value: ethers.utils.parseEther("0.01") });

            const tokenBalance = await nft.balanceOf(otherAccount.address);
            expect(tokenBalance).to.equal("1");
        });

        it("does not allow to mint an Nft token when value is provided less than the minting fee", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);

            await expect(
                nft
                    .connect(otherAccount)
                    .safeMint(otherAccount.address, "", { value: ethers.utils.parseEther("0.001") })
            ).to.be.reverted;
        });

        it("does not overcharge recipient when value is provided greater than the minting fee", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);
            const initialBalance = await ethers.provider.getBalance(otherAccount.address);
            const tx = await nft
                .connect(otherAccount)
                .safeMint(otherAccount.address, "", { value: ethers.utils.parseEther("0.05") });

            const reciept = await tx.wait();

            const gas = reciept.gasUsed.mul(reciept.effectiveGasPrice);
            const finalBalance = await ethers.provider.getBalance(otherAccount.address);
            expect(finalBalance).to.equal(initialBalance.sub(gas.add(ethers.utils.parseEther("0.01"))));
        });

        it("deposits an amount to the contract when someone mints an Nft token", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);
            const initialBalance = await ethers.provider.getBalance(nft.address);
            const tx = await nft
                .connect(otherAccount)
                .safeMint(otherAccount.address, "", { value: ethers.utils.parseEther("0.01") });

            await tx.wait();

            const finalBalance = await ethers.provider.getBalance(nft.address);
            expect(finalBalance).to.equal(initialBalance.add(ethers.utils.parseEther("0.01")));
        });

        it("emits an event when someone mints an Nft token", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);
            const tokenURI = "";

            await expect(
                nft
                    .connect(otherAccount)
                    .safeMint(otherAccount.address, tokenURI, { value: ethers.utils.parseEther("0.01") })
            )
                .to.emit(nft, "SafeMint")
                .withArgs(otherAccount.address, 0, tokenURI);
        });
    });

    describe("viewBalance", function () {
        it("allows owner to view the available balance", async function () {
            const { nft, owner } = await loadFixture(deployNftFixture);
            const contractBalance = await ethers.provider.getBalance(nft.address);

            expect(await nft.connect(owner).viewBalance()).to.equal(contractBalance);
        });

        it("does not allows others to view the available balance", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);
            await expect(nft.connect(otherAccount).viewBalance()).to.be.reverted;
        });
    });

    describe("withdrawBalance", function () {
        it("allows owner to withdraw available balance", async function () {
            const { nft, owner } = await loadFixture(deployNftFixture);
            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
            const initialContractBalance = await ethers.provider.getBalance(nft.address);

            const tx = await nft.connect(owner).withdrawBalance();
            const reciept = await tx.wait();
            const gas = reciept.gasUsed.mul(reciept.effectiveGasPrice);

            const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(gas).add(initialContractBalance));

            const finalContractBalance = await ethers.provider.getBalance(nft.address);
            expect(finalContractBalance).to.equal(ethers.utils.parseEther("0"));
        });

        it("does not allows others to withdraw available balance", async function () {
            const { nft, otherAccount } = await loadFixture(deployNftFixture);
            await expect(nft.connect(otherAccount).withdrawBalance()).to.be.reverted;
        });

        it("emits an event when owner withdraws available balance", async function () {
            const { nft, owner } = await loadFixture(deployNftFixture);
            const contractBalance = await ethers.provider.getBalance(nft.address);

            await expect(nft.connect(owner).withdrawBalance())
                .to.emit(nft, "WithdrawBalance")
                .withArgs(contractBalance);
        });
    });
});
