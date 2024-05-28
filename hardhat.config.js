require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");


const dotenv = require("dotenv");
dotenv.config();

function privateKey() {
  return process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
}

module.exports = {
  networks: {
    amoy: {
      url: "https://polygon-amoy.blockpi.network/v1/rpc/public",
      accounts: privateKey(),
    },
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: privateKey(),
    },
    arbitrum_sepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: privateKey(),
    },
    core_testnet: {
      url: "https://rpc.test.btcs.network",
      accounts: privateKey(),
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },  etherscan: {
    apiKey: process.env.API_KEY, 
  },
};