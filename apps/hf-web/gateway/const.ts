
import * as path from 'path'

function envOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

export const channelName = envOrDefault('CHANNEL_NAME', 'mychannel')
export const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic')
export const mspId = envOrDefault('MSP_ID', 'Org1MSP')
export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve('..', 'hf-net/src/organizations/peerOrganizations/org1.example.com'))
export const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'))
export const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'))
export const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'))
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051')
export const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com')
export const utf8Decoder = new TextDecoder()

export function displayInputParameters(): void {
  console.log(`channelName:       ${channelName}`)
  console.log(`chaincodeName:     ${chaincodeName}`)
  console.log(`mspId:             ${mspId}`)
  console.log(`cryptoPath:        ${cryptoPath}`)
  console.log(`keyDirectoryPath:  ${keyDirectoryPath}`)
  console.log(`certDirectoryPath: ${certDirectoryPath}`)
  console.log(`tlsCertPath:       ${tlsCertPath}`)
  console.log(`peerEndpoint:      ${peerEndpoint}`)
  console.log(`peerHostAlias:     ${peerHostAlias}`)
}
