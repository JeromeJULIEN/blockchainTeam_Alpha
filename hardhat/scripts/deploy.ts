import { ethers } from "hardhat";

async function main() {
  const blockchainTeam = await ethers.deployContract("BlockchainTeamV1");

  await blockchainTeam.waitForDeployment();

  console.log(
    `BlockchainTeamV1 deployed to ${blockchainTeam.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
