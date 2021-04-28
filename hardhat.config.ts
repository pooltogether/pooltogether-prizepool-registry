import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-dependency-compiler'

import { HardhatUserConfig } from 'hardhat/config';

import networks from './hardhat.network';

const optimizerEnabled = !process.env.OPTIMIZER_DISABLED;

const config: HardhatUserConfig = {
  abiExporter: {
    path: './abis',
    clear: true,
    flat: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  mocha: {
    timeout: 30000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    timelock:{
      default: "0x8Df0AfB54836dc8D0AE795503F837Cff197d3df1",
      4: "0x8Df0AfB54836dc8D0AE795503F837Cff197d3df1"
    },
    genericRegistry: {
      4: "0x9858aC37e385E52dA6385d828Cfe55a182D8ffA6",
      137: "0x75d15A8Be214631b4e5F02D9C4bE3dC1be6876C9"
    }
  },
  networks,
  solidity: {
    compilers:[
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: "istanbul"
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: "istanbul"
        }
      },
      {
        version: "0.6.12",
        settings:{
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion:"istanbul"
        }
      }
    ]

  },
  dependencyCompiler: {
    paths: [
      '@pooltogether/pooltogether-generic-registry/contracts/AddressRegistry.sol',
    ],
  }
};

export default config;
