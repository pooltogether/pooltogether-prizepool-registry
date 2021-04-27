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

  // deploy a registry 
  // const prizePoolRegistryResult = await deploy("GenericRegistry", {
  //   skipIfAlreadyDeployed: true,
  //   args: ["Prize Pools", timelock],
  //   from: deployer
  // })

  // const genericRegistryInterface = new ethers.utils.Interface(genericRegistryAbi)
  // const genericRegistryContractFactory = new ethers.ContractFactory(genericRegistryInterface, GenericProxyFactory.bytecode, signer)
  

  const genericRegistryContractFactory = await ethers.getContractFactory("AddressRegistry")
  
  const prizePoolRegistryResult = await genericRegistryContractFactory.deploy()

  // now add prize pools to registry
  const prizePoolRegistryContract = await ethers.getContractAt("GenericRegistry", prizePoolRegistryResult.address) 
  const prizePools = ["0x4706856FA8Bb747D50b4EF8547FE51Ab5Edc4Ac2", "0xde5275536231eCa2Dd506B9ccD73C028e16a9a32", "0xab068F220E10eEd899b54F1113dE7E354c9A8eB7"] // array of governance pools on rinkeby
  await prizePoolRegistryContract.addAddresses(prizePools)

  green(`Done!`)

};

export default deployFunction;
