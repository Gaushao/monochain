# monochain

web3 playground monorepository. startup geth or hyperledger fabric networks with minimal effort

## howto

### install

```sh
npm install -g pnpm
pnpm i
```

### dev

#### dev:breth

```sh
pnpm breth
```

#### dev:hf

```sh
pnpm hf
```

#### dev:docs

```sh
pnpm doc
```

## structure

### repo

- [pnpm](https://www.npmjs.com/package/pnpm) package manager
- [turborepo](https://turbo.build/) workspace manager
  - [reference](https://turbo.build/repo/docs/reference)
  - [configure](https://turbo.build/repo/docs/reference/configuration)
  - [tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [docker](https://www.docker.com/)
- [next.js](https://nextjs.org/) web applications

### apps

- `breth-web`: next app portal
  - [ethers](https://docs.ethers.org/v5/)
- `breth-net`: ethereum network
  - [geth](https://geth.ethereum.org/) blockchain
  - [kurtosis](https://www.kurtosis.com/) environment
  - [ethpandaops](https://github.com/ethpandaops/ethereum-package) ethereum-package
  - [hardhat](https://hardhat.org/) for ethereum development
  - [solidity-docgen](https://github.com/OpenZeppelin/solidity-docgen) documenting
- `hf-net`: hyperledger fabric network
  - [hyperledger-fabric](https://hyperledger-fabric.readthedocs.io/) blockchain
- `docs`: next app to documentation

### packages

- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/env`: environment mapping
- `@repo/scripts`: automation
