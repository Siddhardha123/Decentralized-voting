
const hre = require("hardhat");

async function main() {
  

  const Create = await hre.ethers.getContractFactory("Create");
  const create = await Create.deploy();

  await create.deployed();

  console.log( "create with 1 eth deployed to:" , create.address
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
