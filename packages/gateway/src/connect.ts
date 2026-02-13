import * as crypto from 'crypto'
import * as path from 'path'
import { promises } from 'fs'
import * as grpc from '@grpc/grpc-js'
import { connect as c, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway'

import * as CONST from './const'

async function newGrpcConnection(
  tlsCertPath: string,
  peerEndpoint: string,
  peerHostAlias: string,
): Promise<grpc.Client> {
  const tlsRootCert = await promises.readFile(tlsCertPath)
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert)
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': peerHostAlias,
  })
}
async function getFirstDirFileName(dirPath: string): Promise<string> {
  const files = await promises.readdir(dirPath)
  const file = files[0]
  if (!file) throw new Error(`No files in directory: ${dirPath}`)
  return path.join(dirPath, file)
}

async function newIdentity(certDirectoryPath: string, mspId: string): Promise<Identity> {
  const certPath = await getFirstDirFileName(certDirectoryPath)
  const credentials = await promises.readFile(certPath)
  return { mspId, credentials }
}

async function newSigner(keyDirectoryPath: string): Promise<Signer> {
  const keyPath = await getFirstDirFileName(keyDirectoryPath)
  const privateKeyPem = await promises.readFile(keyPath)
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  return signers.newPrivateKeySigner(privateKey)
}

const deadline = (ms: number) => () => ({ deadline: Date.now() + ms })

export const CONNECTION_OPTIONS = {
  tlsCertPath: CONST['tlsCertPath'],
  peerEndpoint: CONST['peerEndpoint'],
  peerHostAlias: CONST['peerHostAlias'],
  certDirectoryPath: CONST['certDirectoryPath'],
  mspId: CONST['mspId'],
  keyDirectoryPath: CONST['keyDirectoryPath'],
}

export default async function connect({
  tlsCertPath = CONNECTION_OPTIONS.tlsCertPath,
  peerEndpoint = CONNECTION_OPTIONS.peerEndpoint,
  peerHostAlias = CONNECTION_OPTIONS.peerHostAlias,
  certDirectoryPath = CONNECTION_OPTIONS.certDirectoryPath,
  mspId = CONNECTION_OPTIONS.mspId,
  keyDirectoryPath = CONNECTION_OPTIONS.keyDirectoryPath,
} = CONNECTION_OPTIONS) {
  const client = await newGrpcConnection(tlsCertPath, peerEndpoint, peerHostAlias)
  const gateway = await c({
    client,
    identity: await newIdentity(certDirectoryPath, mspId),
    signer: await newSigner(keyDirectoryPath),
    hash: hash.sha256,
    evaluateOptions: deadline(5000),
    endorseOptions: deadline(15000),
    submitOptions: deadline(5000),
    commitStatusOptions: deadline(60000),
  })
  gateway.getNetwork('mychannel')
  return {
    client, gateway, close: () => {
      gateway.close()
      client.close()
    }
  }
}