
import path from 'path'
import { spawn } from 'child_process'
import { FABRIC_BIN_PATH, FABRIC_CA_PATH, FABRIC_CFG_PATH, ORGANIZATIONS_PATH } from './env'

export default class GatewayCA {
  organization = 'org1'

  constructor(organization = this.organization) {
    this.organization = organization
  }

  private get config() {
    const tls = path.join(FABRIC_CA_PATH, this.organization, 'tls-cert.pem')
    return {
      bin: `${FABRIC_BIN_PATH}:$PATH`,
      path: FABRIC_CFG_PATH,
      home: path.join(ORGANIZATIONS_PATH, 'peerOrganizations', `${this.organization}.example.com`),
      caname: `ca-${this.organization}`,
      certargs: ['--tls.certfiles', tls]
    }
  }

  private async spawn(...args: string[]) {
    return new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
      try {
        const process = spawn('fabric-ca-client', args.filter(s => s.length).concat(this.config.certargs), {
          env: {
            NODE_ENV: 'development' as const,
            PATH: this.config.bin,
            FABRIC_CFG_PATH: this.config.path,
            FABRIC_CA_CLIENT_HOME: this.config.home,
          }
        })
        let stdout = ""
        let stderr = ""
        process.stdout.on("data", (data) => (stdout += data.toString()))
        process.stderr.on("data", (data) => (stderr += data.toString()))
        process.on("close", code => code === 0 ? resolve({
          stdout, stderr
        }) : reject(`Command failed with exit code ${code}: ${stderr}`))
      }
      catch (error) {
        reject(error)
      }
    })
  }

  private parseIdentities(stdout: string) {
    return stdout.split("Name: ").slice(1).map(e => {
      const lines = e.split(", ")
      const name = lines[0] || "Unknown"
      const type = lines[1]?.split(": ")[1] || "Unknown"
      const affiliation = lines[2]?.split(": ")[1] || "None"
      const attributes = e.match(/\{Name:(.*?)\}/g) || []
      return {
        name, type, affiliation, attributes: attributes.map(attr => {
          const [key = '', value] = attr.replace(/[{}]/g, "").split(" Value:")
          return { name: key.replace("Name:", "").trim(), value: value || "N/A" }
        })
      }
    })
  }

  get identities() {
    return (async () => this.parseIdentities((await this.spawn(
      'identity', 'list'
    )).stdout))()
  }

  register(name: string, secret: string, type = 'client', attributes: { name: string, value: string, ecert?: boolean }[] = []) {
    const attrString = attributes.map(attr => `--id.attrs "${attr.name}=${attr.value}${attr.ecert ? ':ecert' : ''}"`).join(' ')
    return this.spawn(
      'register',
      '--id.name', name,
      '--id.secret', secret,
      '--id.type', type,
      '--id.affiliation', this.organization,
      attrString,
    )
  }

  enroll(name: string, secret: string) {
    return this.spawn(
      'enroll',
      '-u', `https://${encodeURI(name)}:${encodeURI(secret)}@localhost:7054`,
      '--caname', this.config.caname,
      '-M', `${this.config.home}/users/${name}@org1.example.com/msp`,
    )
  }

  revoke(name: string) {
    return this.spawn('revoke', '--revoke.name', name)
  }
}