pnpm netdn
pnpm netchca
src/network.sh deployCC -ccn abac -ccp chaincodes/go/asset-transfer-abac/ -ccl go

# environment variables
export PATH=${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/config/

# create the identities using the Org1 CA
export FABRIC_CA_CLIENT_HOME=${PWD}/src/organizations/peerOrganizations/org1.example.com/

# METHOD 1: specify that the attribute be added to the certificate by default when the identity is registered
# `ecert` suffix adds the attribute to the certificate automatically when the identity is enrolled
fabric-ca-client register --id.name creator1 --id.secret creator1pw --id.type client --id.affiliation org1 --id.attrs 'abac.creator=true:ecert' --tls.certfiles "${PWD}/src/organizations/fabric-ca/org1/tls-cert.pem"

# enroll the identity
fabric-ca-client enroll -u https://creator1:creator1pw@localhost:7054 --caname ca-org1 -M "${PWD}/src/organizations/peerOrganizations/org1.example.com/users/creator1@org1.example.com/msp" --tls.certfiles "${PWD}/src/organizations/fabric-ca/org1/tls-cert.pem"

# copy the Node OU configuration file into the creator1 MSP folder
cp "${PWD}/src/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "${PWD}/src/organizations/peerOrganizations/org1.example.com/users/creator1@org1.example.com/msp/config.yaml"


# METHOD 2: request that the attribute be added upon enrollment
fabric-ca-client register --id.name creator2 --id.secret creator2pw --id.type client --id.affiliation org1 --id.attrs 'abac.creator=true:' --tls.certfiles "${PWD}/src/organizations/fabric-ca/org1/tls-cert.pem"

# add the attribute to the certificate
fabric-ca-client enroll -u https://creator2:creator2pw@localhost:7054 --caname ca-org1 --enrollment.attrs "abac.creator" -M "${PWD}/src/organizations/peerOrganizations/org1.example.com/users/creator2@org1.example.com/msp" --tls.certfiles "${PWD}/src/organizations/fabric-ca/org1/tls-cert.pem"

# copy the Node OU configuration file into the creator2 MSP folder.
cp "${PWD}/src/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "${PWD}/src/organizations/peerOrganizations/org1.example.com/users/creator2@org1.example.com/msp/config.yaml"

# set environment variables to the generated identity creator1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/organizations/peerOrganizations/org1.example.com/users/creator1@org1.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051
export TARGET_TLS_OPTIONS=(-o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/src/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/src/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/src/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt")

# create Asset1
peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n abac -c '{"function":"CreateAsset","Args":["Asset1","blue","20","100"]}'

sleep 3

# read Asset1
peer chaincode query -C mychannel -n abac -c '{"function":"ReadAsset","Args":["Asset1"]}'

# transfer Asset1 to the user1 identity from Org1
export RECIPIENT="x509::CN=user1,OU=client,O=Hyperledger,ST=North Carolina,C=US::CN=fabric-ca-server,OU=Fabric,O=Hyperledger,ST=North Carolina,C=US"
peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n abac -c '{"function":"TransferAsset","Args":["Asset1","'"$RECIPIENT"'"]}'

sleep 3

# verify asset owner
peer chaincode query -C mychannel -n abac -c '{"function":"ReadAsset","Args":["Asset1"]}'

# operate as the asset owner by setting the MSP path to User1
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp

# update the asset
peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n abac -c '{"function":"UpdateAsset","Args":["Asset1","green","20","100"]}'

sleep 3

# verify asset changes
peer chaincode query -C mychannel -n abac -c '{"function":"ReadAsset","Args":["Asset1"]}'

# delete asset
peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n abac -c '{"function":"DeleteAsset","Args":["Asset1"]}'

sleep 3

# query the ledger, Asset1 no longer exists
peer chaincode query -C mychannel -n abac -c '{"function":"GetAllAssets","Args":[]}'
