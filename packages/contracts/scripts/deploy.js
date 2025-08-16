const hre = require("hardhat");

async function main() {
  console.log("Deploying ProofLayer SBT contract...");

  const ProofLayerSBT = await hre.ethers.getContractFactory("ProofLayerSBT");
  const sbt = await ProofLayerSBT.deploy();

  await sbt.deployed();

  console.log(`ProofLayerSBT deployed to: ${sbt.address}`);

  // Verify the contract on BSCScan
  if (process.env.BSCSCAN_API_KEY) {
    console.log("Waiting for 6 block confirmations before verification...");
    await sbt.deployTransaction.wait(6);

    console.log("Verifying contract on BSCScan...");
    await hre.run("verify:verify", {
      address: sbt.address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
