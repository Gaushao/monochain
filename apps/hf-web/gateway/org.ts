import path from "path"
import { readdirSync, statSync } from "fs"
import { ORGANIZATIONS_PATH } from "./env"

export default class OrganizationGateway {
  org = 'org1'

  constructor(org = this.org) {
    this.org = org
  }

  get peers() {
    const peerspath = path.join(ORGANIZATIONS_PATH, 'peerOrganizations', `${this.org}.example.com`, 'peers')
    return readdirSync(peerspath).filter(dir => statSync(
      path.join(peerspath, dir)
    ).isDirectory()).map(peer => peer.split('.')[0])
  }

}