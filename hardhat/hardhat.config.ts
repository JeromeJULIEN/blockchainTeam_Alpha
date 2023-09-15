import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      // accounts => fourni par hardhat
      chainId: 31337
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 80001
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY as string
    }
  }
};

export default config;
