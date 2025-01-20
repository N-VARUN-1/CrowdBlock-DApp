require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    holesky: {
      url: "https://eth-holesky.g.alchemy.com/v2/SL1iqRJPRio8Vj8NEQS7Jbpugj5ygte2",
      accounts: ["f52836bbae0640ad07f93bf7d77ed00a1dfe32df82afbf66f6a2ccbfd98b79b0"],
      chainId: 17000
    }
  }
};
