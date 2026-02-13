
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config
export CORE_PEER_TLS_ENABLED=true

export ORDERER_ADDRESS=localhost:7050
export ORDERER_URL=orderer.example.com

export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

export CA_FILE="${PWD}/src/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
export CC_PACKAGE_ID=test-v1:2d64f563a9318dcc18aa269a84bc72fb6ad87d566d72ca00c3d58f72e9ae31f2
export CC_NAME=test-v1
export CC_CHANNEL=mychannel

peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --ordererTLSHostnameOverride $ORDERER_URL --channelID $CC_CHANNEL --name $CC_NAME --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $CA_FILE

peer lifecycle chaincode commit -o $ORDERER_ADDRESS --ordererTLSHostnameOverride $ORDERER_URL --channelID $CC_CHANNEL --name $CC_NAME --version 1.0 --sequence 1 --tls --cafile $CA_FILE --peerAddresses $CORE_PEER_ADDRESS

peer lifecycle chaincode checkcommitreadiness --channelID $CC_CHANNEL --name $CC_NAME --version 1.0 --sequence 1 --tls --cafile $CA_FILE --output json
peer lifecycle chaincode queryapproved -C $CC_CHANNEL -n $CC_NAME
peer lifecycle chaincode queryinstalled
peer lifecycle chaincode install basic.tar.gz