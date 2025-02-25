import * as crypto from 'crypto'
import * as path from 'path'
import { promises } from 'fs'
import * as grpc from '@grpc/grpc-js'
import { connect as c, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway'

import { certDirectoryPath, keyDirectoryPath, mspId, peerEndpoint, peerHostAlias, tlsCertPath } from './const'

async function newGrpcConnection(): Promise<grpc.Client> {
  const tlsRootCert = await promises.readFile(tlsCertPath)
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert)
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': peerHostAlias,
  })
}
async function getFirstDirFileName(dirPath: string): Promise<string> {
  const files = await promises.readdir(dirPath)
  const file = files[0]
  if (!file) {
    throw new Error(`No files in directory: ${dirPath}`)
  }
  return path.join(dirPath, file)
}

async function newIdentity(): Promise<Identity> {
  const certPath = await getFirstDirFileName(certDirectoryPath)
  const credentials = await promises.readFile(certPath)
  return { mspId, credentials }
}

async function newSigner(): Promise<Signer> {
  const keyPath = await getFirstDirFileName(keyDirectoryPath)
  const privateKeyPem = await promises.readFile(keyPath)
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  return signers.newPrivateKeySigner(privateKey)
}

function deadline(ms: number) {
  return () => ({ deadline: Date.now() + ms })
}

export default async function connect() {
  const client = await newGrpcConnection()
  const gateway = await c({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
    hash: hash.sha256,
    evaluateOptions: deadline(5000),
    endorseOptions: deadline(15000),
    submitOptions: deadline(5000),
    commitStatusOptions: deadline(60000),
  })
  return {
    client, gateway, close: () => {
      gateway.close()
      client.close()
    }
  }
}