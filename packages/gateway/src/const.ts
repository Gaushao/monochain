
import * as path from 'path'
import { envOrDefault } from './env/utils'

export const mspId = envOrDefault('MSP_ID', 'Org1MSP')
export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve('..', 'hf-net/src/organizations/peerOrganizations/org1.example.com'))
export const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'))
export const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'))
export const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'))
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051')
export const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com')
