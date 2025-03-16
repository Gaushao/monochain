
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const HFNET_PATH = path.resolve('../hf-net')
const FABRIC_BIN_PATH = path.join(HFNET_PATH, 'bin')
const ORGS_FOLDER = path.join(HFNET_PATH, 'src/organizations')
const CERTIFICATE = path.join(ORGS_FOLDER, 'fabric-ca/org1/ca-cert.pem')
const FABRIC_CA_CLIENT_HOME = path.join(ORGS_FOLDER, 'peerOrganizations/org1.example.com')
const CONFIG = {
  bin: FABRIC_BIN_PATH,
  home: FABRIC_CA_CLIENT_HOME,
  cert: CERTIFICATE
}

export default class CertAuthSDK {

  static exec = promisify(exec)

  config = CONFIG

  constructor(c: Partial<typeof CONFIG> = {}) {
    this.config = Object.assign(this.config, c)
  }

  parseIdentities = async (output: ReturnType<typeof CertAuthSDK.exec>) => {
    const { stdout, stderr } = await output
    const users = []
    const entries = String(stdout).split("Name: ").slice(1)

    for (const entry of entries) {
      const lines = entry.split(", ")
      const name = lines[0]
      const type = lines[1]?.split(": ")[1] || "Unknown"
      const affiliation = lines[2]?.split(": ")[1] || "None"
      const attributes = entry.match(/\{Name:(.*?)\}/g) || []
      const formattedAttributes = attributes.map((attr) => {
        const [key = '', value] = attr.replace(/[\{\}]/g, "").split(" Value:")
        return { name: key.replace("Name:", "").trim(), value: value || "N/A" }
      })

      users.push({ name, type, affiliation, attributes: formattedAttributes })
    }

    return users
  }

  get identities() {
    return this.parseIdentities(CertAuthSDK.exec(
      `export PATH=${this.config.bin}:$PATH && export FABRIC_CA_CLIENT_HOME=${this.config.home} && fabric-ca-client identity list --tls.certfiles ${this.config.cert}`
    ))
  }

}