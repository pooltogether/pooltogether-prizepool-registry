import chalk from 'chalk';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';

import genericRegistryAbi from "@pooltogether/pooltogether-generic-registry/abis/AddressRegistry.json"


const displayLogs = !process.env.HIDE_DEPLOY_LOG;

function dim(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.dim(logMessage));
  }
}

function cyan(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.cyan(logMessage));
  }
}

function yellow(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.yellow(logMessage));
  }
}

function green(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.green(logMessage));
  }
}

function displayResult(name: string, result: DeployResult) {
  if (!result.newlyDeployed) {
    yellow(`Re-used existing ${name} at ${result.address}`);
  } else {
    green(`${name} deployed at ${result.address}`);
  }
}

const chainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 77:
      return 'POA Sokol';
    case 99:
      return 'POA';
    case 100:
      return 'xDai';
    case 137:
      return 'Matic';
    case 31337:
      return 'HardhatEVM';
    case 80001:
      return 'Matic (Mumbai)';
    default:
      return 'Unknown';
  }
};

const deployFunction: any = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, getChainId, ethers } = hre;
  const { deploy } = deployments;
  
  let { deployer, admin, timelock, genericRegistry } = await getNamedAccounts();

  const chainId = parseInt(await getChainId());

  // 31337 is unit testing, 1337 is for coverage
  const isTestEnvironment = chainId === 31337 || chainId === 1337;

  const signer = ethers.provider.getSigner(deployer);

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  dim('PoolTogether Prize Pool Registry - Deploy Script');
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`);
  dim(`deployer: ${deployer}`);

  const prizePoolRegistryResult = await deploy("AddressRegistry", {
    from: deployer,
    args: ["Prize Pools", deployer]
  })

  // now add prize pools to registry
  const prizePoolRegistryContract = await ethers.getContractAt("AddressRegistry", prizePoolRegistryResult.address) 
  const prizePools = ["0xEBfb47A7ad0FD6e57323C8A42B2E5A6a4F68fc1a",
    "0x0650d780292142835F6ac58dd8E2a336e87b4393",
    "0xde9ec95d7708b8319ccca4b8bc92c0a3b70bf416",
    "0xBC82221e131c082336cf698F0cA3EBd18aFd4ce7",
  "0x396b4489da692788e327e2e4b2b0459a5ef26791",
"0xc2a7Dfb76E93d12a1bB1Fa151b9900158090395d"] 
  await prizePoolRegistryContract.addAddresses(prizePools)

  green(`Done!`)

};

export default deployFunction;
