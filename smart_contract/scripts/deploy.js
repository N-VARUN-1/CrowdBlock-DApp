const { ethers, network } = require("hardhat")

async function main() {
    // Get the contract factory
    const Crowdfunding = await ethers.getContractFactory("CrowdFunding");
    console.log("Deploying contract ....")
    // Deploy the contract and await the deployment
    const crowdfunding = await Crowdfunding.deploy();

    // Wait for the deployment transaction to be mined
    await crowdfunding.waitForDeployment();

    const contractAddress = await crowdfunding.getAddress()        // Log the contract address
    console.log(`Crowdfunding contract deployed to: ${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });