# [Hyperledger Fabric Network](https://hyperledger-fabric.readthedocs.io)

## [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-2.5/prereqs.html)

the following are required to run a docker-based test network on local ubuntu machine.

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

## [install](https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html)

- `docker`: use Docker to download the Fabric Container Images
- `samples`: clone the fabric-samples github repo to the current directory
- `binary`: download the Fabric binaries

```sh
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x install-fabric.sh
./install-fabric.sh
```

## [test network](https://hyperledger-fabric.readthedocs.io/en/release-2.5/test_network.html)

```sh
# go to test network directory
cd fabric-samples/test-network

# list network bash commands
./network.sh -h

# remove any containers or artifacts from any previous runs
./network.sh down

# bring up the network
./network.sh up
# list running containers
docker ps -a

# create a channel
./network.sh createChannel -c mychannel

# install the asset-transfer
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript -ccl typescript

# add binaries to cli path
export PATH=${PWD}/../bin:$PATH

# set FABRIC_CFG_PATH to point core.yaml
export FABRIC_CFG_PATH=$PWD/../config/

# environment variables for Org1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# InitLedger initializes the ledger with assets
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'

# query the ledger with GetAllAssets
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'

# Environment variables for Org2
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

# query the ledger for asset6 from Org2
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAsset","asset6"]}'

# stop and remove the node and chaincode containers, delete the organization crypto material, remove the chaincode images, channel artifacts and docker volumes from previous runs
./network.sh down

```

## [certificated authorities](https://hyperledger-fabric.readthedocs.io/en/release-2.5/test_network.html#bring-up-the-network-with-certificate-authorities)

```sh
# bring down any running networks
./network.sh down

# bring up a network using Fabric CAs
./network.sh up -ca

# see MSP folder structure
tree organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/
```

## [chaincode deploy](https://hyperledger-fabric.readthedocs.io/en/release-2.5/deploy_chaincode.html)

```sh
# start a network and create a channel
cd fabric-samples/test-network
./network.sh down
./network.sh up createChannel

# go to typescript chaincode
cd fabric-samples/asset-transfer-basic/chaincode-typescript

# install its dependencies
npm install

# back to network folder
cd ../../test-network

# setup paths
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

# create typescript chaincode package with peer lifecycle
peer lifecycle chaincode package basic.tar.gz --path ../asset-transfer-basic/chaincode-typescript/ --lang node --label basic_1.0

# setup env to operate Org1 peer as admin user
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# install chaincode at Org1 peer
peer lifecycle chaincode install basic.tar.gz

# setup env to operate Org2 peer as admin user
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

# install chaincode at Org2 peer
peer lifecycle chaincode install basic.tar.gz

# query peer installed chaincodes
peer lifecycle chaincode queryinstalled

# export CC_PACKAGE_ID={installed chaincode package id}
export CC_PACKAGE_ID=basic_1.0:6b8bb3a5c2202e858e9f898c4e6f2621710715c297c47441aaec1b198af60ba2

# approve the chaincode definition
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# ensure channel members has approved the same chaincode definition
peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name basic --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json

# commit the chaincode definition to the channel
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

# upgrade chaincode with javascript source code
cd ../asset-transfer-basic/chaincode-javascript
npm install
cd ../../test-network

# environment variables as always
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

# set MSP to Admin@org1
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

# create typescript chaincode package with peer lifecycle
peer lifecycle chaincode package basic_2.tar.gz --path ../asset-transfer-basic/chaincode-javascript/ --lang node --label basic_2.0

# setup Org1 environment
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# install basic_2 chaincode package at Org1 peer
peer lifecycle chaincode install basic_2.tar.gz

# checkout installed chaincodes
peer lifecycle chaincode queryinstalled

# setup CC_PACKAGE_ID with PACKAGE_ID of basic_2.0 label
export CC_PACKAGE_ID=basic_2.0:<PACKAGE_ID>

# Org1 approves basic_2 chaincode definition
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 2.0 --package-id $CC_PACKAGE_ID --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# setup Org2 environment
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

# install basic_2 chaincode package on the Org2 peer
peer lifecycle chaincode install basic_2.tar.gz

# Org2 approves basic_2 chaincode definition
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 2.0 --package-id $CC_PACKAGE_ID --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# ensure channel members has approved chaincode definition 2.0
peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name basic --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json

# upgrade the chaincode to 2.0
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

# verify basic_2.0 chaincode has started on your peers
docker ps

# if not initialized InitLedger may be invoked
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'

# invoke CreateAsset
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"CreateAsset","Args":["asset8","blue","16","Kelley","750"]}'

# query the ledger with GetAllAssets
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'

# after done, clean up
./network.sh down
```

## [fabric app](https://hyperledger-fabric.readthedocs.io/en/release-2.5/write_first_app.html)

## troubleshooting

```sh
# start fresh networks
./network.sh down

# remove your images and start from scratch
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)

# wipe previous networks and start with a fresh environment
docker network prune

# Removes dangling volumes
docker volume prune -f

# Remove old channel artifacts
rm -rf channel-artifacts/*
# Remove old identities
rm -rf organizations/peerOrganizations organizations/ordererOrganizations
```

## read more

- [Membership Service Provider (MSP)](https://hyperledger-fabric.readthedocs.io/en/release-2.5/membership/membership.html)
- [Identity](https://hyperledger-fabric.readthedocs.io/en/release-2.5/identity/identity.html)
- [Fabric CA](https://hyperledger-fabric-ca.readthedocs.io/en/latest/operations_guide.html)
- [Peer Lifecycle](https://hyperledger-fabric.readthedocs.io/en/release-2.5/commands/peerlifecycle.html)
- [Chaincode Lifecycle](https://hyperledger-fabric.readthedocs.io/en/release-2.5/chaincode_lifecycle.html)
- [Gateway](https://hyperledger-fabric.readthedocs.io/en/release-2.5/gateway.html)
- [Hyperledger Fabric Tutorials](https://hyperledger-fabric.readthedocs.io/en/release-2.5/tutorials.html)
