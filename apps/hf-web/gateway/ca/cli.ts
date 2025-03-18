
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const HFNET_PATH = path.resolve('../hf-net')
const FABRIC_BIN_PATH = path.join(HFNET_PATH, 'bin')
const FABRIC_CFG_PATH = path.join(HFNET_PATH, 'config')
const ORGS_FOLDER = path.join(HFNET_PATH, 'src/organizations')

export default class CertAuthCLI {
  affiliation = 'org1'

  constructor(affiliation = this.affiliation) {
    this.affiliation = affiliation
  }

  get config() {
    return {
      bin: FABRIC_BIN_PATH,
      path: FABRIC_CFG_PATH,
      home: path.join(ORGS_FOLDER, 'peerOrganizations', `${this.affiliation}.example.com`),
      cert: path.join(ORGS_FOLDER, 'fabric-ca', this.affiliation, 'tls-cert.pem'),
      caname: `ca-${this.affiliation}`
    }
  }

  exec(cmd: string) {
    return promisify(exec)(`
    export PATH=${this.config.bin}:$PATH && 
    export FABRIC_CFG_PATH=${this.config.path} && 
    export FABRIC_CA_CLIENT_HOME=${this.config.home} && 
    ${cmd}
  `.trim())
  }

  parseIdentities(stdout: string) {
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
    return (async () => this.parseIdentities((await this.exec(`fabric-ca-client identity list --tls.certfiles ${this.config.cert}`)).stdout))()
  }

  register(name: string, secret: string, type = 'client', affiliation = 'org1', attributes: { name: string, value: string, ecert?: boolean }[] = []) {
    const attrString = attributes.map(attr => `--id.attrs "${attr.name}=${attr.value}${attr.ecert ? ':ecert' : ''}"`).join(' ')
    return this.exec(`fabric-ca-client register --id.name "${name}" --id.secret ${secret} --id.type ${type} ${attrString} --id.affiliation ${affiliation} --tls.certfiles ${this.config.cert}`)
  }

  revoke(name: string) {
    return this.exec(`fabric-ca-client revoke --revoke.name "${name}" --tls.certfiles ${this.config.cert}`)
  }

  enroll(name: string, secret: string) {
    return this.exec(`fabric-ca-client enroll -u https://${name}:${secret}@localhost:7054 --caname ${this.config.caname} -M ${this.config.home}/users/${name}@org1.example.com/msp --tls.certfiles ${this.config.cert}`)
  }
}