/* eslint-disable turbo/no-undeclared-env-vars */

import path from 'path'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { FABRIC_BIN_PATH, FABRIC_CFG_PATH, ORGANIZATIONS_PATH } from './env'

type SpawnResponse = { stdout: string; stderr: string }

export default class GatewayPeer {
  organization = 'org1'
  peer = 'peer0'

  get addr() {
    return `${this.peer}.${this.organization}.example.com`
  }

  get mspid() {
    return `${this.organization.charAt(0).toUpperCase() + this.organization.slice(1)}MSP`
  }

  constructor(organization = this.organization, peer = this.peer) {
    this.organization = organization
    this.peer = peer
  }

  private get config() {
    const home = path.join(ORGANIZATIONS_PATH, 'peerOrganizations', `${this.organization}.example.com`)
    return {
      home,
      bin: `${FABRIC_BIN_PATH}:$PATH`,
      path: FABRIC_CFG_PATH,
      msp: path.join(home, 'msp'),
      tls: path.join(home, 'ca', `ca.${this.organization}.example.com-cert.pem`),
      address: 'localhost:7051',
    }
  }

  private async respond(p: ChildProcessWithoutNullStreams) {
    let stdout = ""
    let stderr = ""
    p.stdout.on("data", (data) => (stdout += data.toString()))
    p.stderr.on("data", (data) => (stderr += data.toString()))
    return new Promise<SpawnResponse>((resolve, reject) => {
      p.on("close", code => code === 0 ? resolve({
        stdout, stderr
      }) : reject(`Command failed with exit code ${code}\n${stderr}`))
    })
  }

  private async spawn(...args: string[]) {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      PATH: this.config.bin,
      FABRIC_CFG_PATH: this.config.path,
      CORE_PEER_MSPCONFIGPATH: this.config.msp,
      CORE_PEER_TLS_ENABLED: 'true',
      CORE_PEER_TLS_ROOTCERT_FILE: this.config.tls,
      CORE_PEER_ADDRESS: this.config.address,
      CORE_PEER_LOCALMSPID: this.mspid
    }
    return this.respond(spawn('peer', args.filter(s => s.length), { env }))
  }

  get channels() {
    return (async () => {
      const { stdout } = await this.spawn('channel', 'list')
      return stdout
        .split("\n")
        .slice(1)
        .filter(line => line.trim().length > 0)
    })()
  }

  get port() {
    return (async () => {
      const { stdout } = await this.respond(spawn('docker', ['exec', this.addr, 'printenv', 'CORE_PEER_ADDRESS']))
      return stdout.split(':')[1]?.trim()
    })()
  }
}