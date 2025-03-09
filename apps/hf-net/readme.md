# hf-net

hyperledger fabric network

## prerequisites

`node` or `go` to chaincode package

```sh
# git
sudo apt-get install git
# cURL
sudo apt-get install curl
# docker
sudo apt-get -y install docker-compose
# jq
sudo apt-get install jq
```

## howto:pnpm

### install

download and run install-fabric bash for binaries and docker data

```sh
pnpm install:hf-net
```

### dev

brings the network up with certified authority and creates a channel

```sh
pnpm netch
```

brings the network up with certified authority

```sh
pnpm netca
```

brings the network up

```sh
pnpm netup
```

### test

run asset-transfer chaincode (nodejs)

```sh
pnpm test:asset-transfer
```

run abac chaincode (golang)

```sh
pnpm test:abac-ownership
```

### down

drops the network

```sh
pnpm netdn
```

### clean

drops the network and removes every docker data

```sh
pnpm clean
```

## read more

- [samples](../docs/public/md/hf_basics.md)
