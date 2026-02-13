
import * as path from 'path'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { FABRIC_BIN_PATH, FABRIC_CFG_PATH, NET_PATH, ORGANIZATIONS_PATH } from './env'
import { existsSync, mkdirSync } from 'fs'

type SpawnResponse = { stdout: string; stderr: string }

const ccLanguageMap = (language: string) => ({
  ts: 'node',
  js: 'node',
  go: 'golang',
  java: 'dont',
})[language] || language

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_')

export default class GatewayPeer {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  bin = `${FABRIC_BIN_PATH}:${process.env.PATH}:$PATH`
  cfg = FABRIC_CFG_PATH
  organization = 'org1'
  peer = 'peer0'
  domain = 'example.com'
  // url = 'localhost'
  // address = 'localhost:7051'

  get mspid() {
    return `${this.organization.charAt(0).toUpperCase() + this.organization.slice(1)}MSP`
  }

  get path() {
    const orgs = ORGANIZATIONS_PATH
    const peer = path.join(orgs, 'peerOrganizations', `${this.organization}.${this.domain}`)
    const orderer = path.join(orgs, 'ordererOrganizations', this.domain)
    const msp = path.join(peer, 'msp')
    const tls = path.join(peer, 'ca', `ca.${this.organization}.${this.domain}-cert.pem`)
    return { orgs, peer, orderer, msp, tls }
  }

  constructor(organization = this.organization, peer = this.peer) {
    this.organization = organization
    this.peer = peer
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

  get url() {
    return (async () => {
      const { stdout } = await this.respond(spawn('docker', ['exec', `${this.peer}.${this.organization}.example.com`, 'printenv', 'CORE_PEER_ADDRESS']))
      return stdout
    })()
  }

  get port() {
    return (async () => (await this.url).split(':')[1]?.trim())()
  }

  get address() {
    return (async () => `localhost:${await this.port}`)()
  }

  get channels() {
    return (async () => {
      const env = {
        FABRIC_CFG_PATH: this.cfg,
        CORE_PEER_MSPCONFIGPATH: this.path.msp,
        CORE_PEER_TLS_ENABLED: 'true',
        CORE_PEER_TLS_ROOTCERT_FILE: this.path.tls,
        CORE_PEER_ADDRESS: await this.address,
        CORE_PEER_LOCALMSPID: this.mspid
      }
      console.log("🚀 ~ GatewayPeer ~ channels ~ env:", env)
      const { stdout } = await this.respond(spawn('peer', ['channel', 'list'], {
        env: { ...process.env, PATH: this.bin, ...env }
      }))
      return stdout
        .split("\n")
        .slice(1)
        .filter(line => line.trim().length > 0)
    })()
  }

  async package({ name, path, language, version = 'v1' }: {
    name: string, path: string, language: string, version?: string
  }) {
    console.log("🚀 ~ GatewayPeer ~ package:", { name, path, language, version })
    if (!existsSync(path)) throw new Error(path + 'not found')
    const pkgdir = `${path}/pkgs`
    const label = sanitize(`${name}-${version}`)
    const pkgpath = `${pkgdir}/${label}.tar.gz`
    if (!existsSync(pkgdir)) mkdirSync(pkgdir, { recursive: true })
    const res = await this.respond(spawn('peer', [
      'lifecycle', 'chaincode', 'package', pkgpath,
      '--lang', ccLanguageMap(language),
      '--label', label,
      '--path', path,
    ], {
      cwd: NET_PATH + '/src',
      env: {
        ...process.env,
        PATH: this.bin,
        FABRIC_CFG_PATH: this.cfg,
        CORE_PEER_MSPCONFIGPATH: this.path.msp,
        CORE_PEER_TLS_ENABLED: 'true',
        CORE_PEER_TLS_ROOTCERT_FILE: this.path.tls,
        CORE_PEER_ADDRESS: await this.address,
        CORE_PEER_LOCALMSPID: this.mspid,
        ORG: this.organization,
        PEER: this.peer
      }
    }))
    console.log("🚀 ~ GatewayPeer ~ package ~ res:", res)
    return res
  }

  get installed() {
    return (async () => {
      const res = await this.respond(spawn('peer', [
        'lifecycle', 'chaincode', 'queryinstalled', '--output', 'json'
      ], {
        cwd: NET_PATH + '/src',
        env: {
          ...process.env,
          PATH: this.bin,
          FABRIC_CFG_PATH: this.cfg,
          CORE_PEER_MSPCONFIGPATH: `${this.path.peer}/users/Admin@${this.organization}.example.com/msp`,
          CORE_PEER_TLS_ENABLED: 'true',
          CORE_PEER_TLS_ROOTCERT_FILE: this.path.tls,
          CORE_PEER_ADDRESS: await this.address,
          CORE_PEER_LOCALMSPID: this.mspid,
          ORG: this.organization,
          PEER: this.peer
        }
      }))
      console.log("🚀 ~ GatewayPeer ~ installed ~ res:", res)
      return res
    })()
  }

  async install(path: string) {
    console.log("🚀 ~ GatewayPeer ~ install:", path)
    const res = await this.respond(spawn('peer', ['lifecycle', 'chaincode', 'install',
      path,
    ], {
      cwd: NET_PATH + '/src',
      env: {
        ...process.env,
        PATH: this.bin,
        FABRIC_CFG_PATH: this.cfg,
        CORE_PEER_MSPCONFIGPATH: `${this.path.peer}/users/Admin@${this.organization}.example.com/msp`,
        CORE_PEER_TLS_ENABLED: 'true',
        CORE_PEER_TLS_ROOTCERT_FILE: this.path.tls,
        CORE_PEER_ADDRESS: await this.address,
        CORE_PEER_LOCALMSPID: this.mspid,
        ORG: this.organization,
        PEER: this.peer
      }
    }))
    console.log("🚀 ~ GatewayPeer ~ install ~ res:", res)
    return res
  }

  async approve({ name, channel, package_id, sequence = '1', version = 'v1', init = false }: {
    name: string; channel: string; package_id: string; sequence?: string; version?: string; init?: boolean
  }) {
    const addr = await this.address
    const args = [
      '-o', 'localhost:7050',
      '--ordererTLSHostnameOverride', 'orderer.example.com',
      '--tls',
      '--channelID', channel,
      '--name', sanitize(name),
      '--version', version,
      '--package-id', package_id,
      '--sequence', sequence,
      '--cafile', this.path.orderer + '/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem',
    ]
    console.log("🚀 ~ GatewayPeer ~ args:", args)
    if (init) args.push('--init-required')
    const env = {
      FABRIC_CFG_PATH: this.cfg,
      CORE_PEER_ADDRESS: addr,
      CORE_PEER_MSPCONFIGPATH: `${this.path.peer}/users/Admin@${this.organization}.example.com/msp`,
      CORE_PEER_TLS_ENABLED: 'true',
      CORE_PEER_TLS_ROOTCERT_FILE: this.path.peer + `/peers/${this.peer}.${this.organization}.example.com/tls/ca.crt`,
      CORE_PEER_LOCALMSPID: this.mspid,
    }
    console.log("🚀 ~ GatewayPeer ~ env:", env)
    const res = await this.respond(spawn('peer', ['lifecycle', 'chaincode', 'approveformyorg', ...args], {
      cwd: NET_PATH + '/src',
      env: { ...process.env, ...env, PATH: this.bin }
    }))
    console.log("🚀 ~ GatewayPeer ~ approve ~ res:", res)
    return res
  }

  async approved({ name, channel }: {
    name: string; channel: string
  }) {
    console.log("🚀 ~ GatewayPeer ~ approved:", { name, channel })
    const env = {
      FABRIC_CFG_PATH: this.cfg,
      CORE_PEER_ADDRESS: await this.address,
      CORE_PEER_MSPCONFIGPATH: `${this.path.peer}/users/Admin@${this.organization}.example.com/msp`,
      CORE_PEER_TLS_ENABLED: 'true',
      CORE_PEER_TLS_ROOTCERT_FILE: this.path.peer + `/peers/${this.peer}.${this.organization}.example.com/tls/ca.crt`,
      CORE_PEER_LOCALMSPID: this.mspid,
    }
    console.log("🚀 ~ GatewayPeer ~ approved ~ env:", env)
    const args = ['lifecycle', 'chaincode', 'queryapproved',
      '--channelID', channel,
      '--name', sanitize(name),
      '--output', 'json',
    ]
    console.log("🚀 ~ GatewayPeer ~ args:", args)
    const res = await this.respond(spawn('peer', args, {
      cwd: NET_PATH + '/src',
      env: { ...process.env, ...env, PATH: this.bin }
    }))
    console.log("🚀 ~ GatewayPeer ~ approved ~ res:", res)
    return res
  }

  async commit({ name, channel, sequence = '1', version = 'v1' }: {
    name: string, channel: string, sequence?: string, version?: string
  }) {
    console.log("🚀 ~ GatewayPeer ~ commit:", { name, channel })
    const env = {
      FABRIC_CFG_PATH: this.cfg,
      CORE_PEER_ADDRESS: await this.address,
      CORE_PEER_MSPCONFIGPATH: `${this.path.peer}/users/Admin@${this.organization}.example.com/msp`,
      CORE_PEER_TLS_ENABLED: 'true',
      CORE_PEER_TLS_ROOTCERT_FILE: this.path.peer + `/peers/${this.peer}.${this.organization}.example.com/tls/ca.crt`,
      CORE_PEER_LOCALMSPID: this.mspid,
    }
    console.log("🚀 ~ GatewayPeer ~ commit ~ env:", env)
    const args = ['lifecycle', 'chaincode', 'commit',
      '-o', 'localhost:7050',
      '--name', sanitize(name),
      '--channelID', channel,
      '--ordererTLSHostnameOverride', 'orderer.example.com',
      '--tls',
      '--version', version,
      '--sequence', sequence,
      '--cafile', this.path.orderer + '/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem',
      '--output', 'json',
    ]
    console.log("🚀 ~ GatewayPeer ~ args:", args)
    const res = await this.respond(spawn('peer', args, {
      cwd: NET_PATH + '/src',
      env: { ...process.env, ...env, PATH: this.bin }
    }))
    console.log("🚀 ~ GatewayPeer ~ commit ~ res:", res)
    return res
  }

}