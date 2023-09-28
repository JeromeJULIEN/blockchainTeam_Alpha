import { ethers } from "hardhat";

async function main() {
  const testCollection = await ethers.deployContract("TestCollection");

  await testCollection.waitForDeployment();

  console.log(
    `TestCollection deployed to ${testCollection.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
