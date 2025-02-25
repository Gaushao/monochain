# Launch the blockchain network

```sh
./network.sh down
./network.sh up createChannel -c mychannel -ca
```

# Deploy the smart contract

```sh
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript
```
