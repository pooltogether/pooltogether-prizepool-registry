# PoolTogether Prize Pool Registry

Maintains a registry of goverance owned prize pools as an instance of [generic registry](https://github.com/pooltogether/pooltogether-generic-registry).

*Note:* @pooltogether/pooltogether-generic-registry must be installed as a peer dependency. 

# Installation
Install the repo and dependencies by running:
`yarn`

# Deployment
Update the `deploy/deploy.ts` to ensure the initialization args are correct.

These contracts can be deployed to a network by running:
`yarn deploy <networkName>`

# Testing
Since this repo is solely for deployment, it has no tests. Please see https://github.com/pooltogether/pooltogether-generic-registry for tests of the underlying contracts. 