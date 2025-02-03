# breth-net

brazilian ethereum network blockchain

## howto:pnpm

### dev

```sh
pnpm dev:breth
```

### drop and restart

```sh
pnpm rerun:breth
```

### gen docs

```sh
pnpm dev:docs
```

### deploy contracts

```sh
pnpm run deploy:breth
```

### check balances

```sh
pnpm balances
```

### update rpc at .env

```sh
pnpm env:breth
```

### clean

```sh
pnpm clean
```

## howto:kurtosis

### run ethereum-package

```sh
kurtosis --enclave brethnet run github.com/ethpandaops/ethereum-package --args-file args.yaml
```

### clean all

```sh
kurtosis clean -a
```

### clean and rerun args

```sh
kurtosis clean -a && kurtosis run --enclave brethnet github.com/ethpandaops/ethereum-package --args-file args.yaml
```

### inspect enclaves

```sh
kurtosis enclave ls
```

```
UUID           Name                Status     Creation Time
4fdb596367b6   quickstart          RUNNING    Sun, 12 Jan 2025 18:36:47 -03
d9600f8ac2c4   brethnet            RUNNING    Sun, 12 Jan 2025 18:50:42 -03
```

```sh
kurtosis enclave inspect d9600f8ac2c4
```

use any `el-` service rpc url to update `PUBLIC_RPC_URL` in `.env`

```
rpc: 8545/tcp -> 127.0.0.1:32842
```

## howto:harhat

### deploy contracts

```sh
npx hardhat compile
npx hardhat run deploy --network localnet
```

### get balances

```sh
npx hardhat balances --network localnet
```

```
0x8943545177806ED17B9F23F0a21ee5948eCaa776 has balance 999999999319653869984912928
0x614561D2d143621E126e87831AEF287678B442b8 has balance 1000000003000000000000000000
0xf93Ee4Cf8c6c40b329b0c0626F28333c132CF241 has balance 1000000000000000000000000000
0x802dCbE1B1A97554B4F50DB5119E37E8e7336417 has balance 1000000000000000000000000000
0xAe95d8DA9244C37CaC0a3e16BA966a8e852Bb6D6 has balance 1000000000000000000000000000
0x2c57d1CFC6d5f8E4182a56b4cf75421472eBAEa4 has balance 999997497674829983996505861
```

### send transaction

```sh
npx hardhat send --network localnet
```

```
TransactionResponse {
  provider: HardhatEthersProvider {
    _hardhatProvider: LazyInitializationProviderAdapter {
      _providerFactory: [AsyncFunction (anonymous)],
      _emitter: [EventEmitter],
      _initializingPromise: [Promise],
      provider: [BackwardsCompatibilityProviderAdapter]
    },
    _networkName: 'localnet',
    _blockListeners: [],
    _transactionHashListeners: Map(0) {},
    _eventListeners: []
  },
  blockNumber: null,
  blockHash: null,
  index: undefined,
  hash: '0x4d5b95fc6efe5e3394749c7dcfc218b9f894114e182b64a476c181d0bc02d9d4',
  type: 2,
  to: '0x614561D2d143621E126e87831AEF287678B442b8',
  from: '0x8943545177806ED17B9F23F0a21ee5948eCaa776',
  nonce: 3,
  gasLimit: 21000n,
  gasPrice: 5000000008n,
  maxPriorityFeePerGas: 5000000000n,
  maxFeePerGas: 5000000008n,
  maxFeePerBlobGas: null,
  data: '0x',
  value: 1000000000000000000n,
  chainId: 3151908n,
  signature: Signature { r: "0x27f1e4cf3462dac463e88ea59732e47d0ae1d6f757119bde5b6491680a95012b", s: "0x54fd552b4f4dc1378810b513c4bde77d35e683404f51ff03dcf36d01ca564986", yParity: 0, networkV: null },
  accessList: [],
  blobVersionedHashes: null
}
```

### generate docs

```sh
npx hardhat docgen --network localnet
```

### monitor docker usage

```sh
docker system df -v
```
