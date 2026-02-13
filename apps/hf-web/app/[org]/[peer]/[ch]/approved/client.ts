import { ClientAPI } from "@repo/api"
import { PeerApprovedPayload } from "./types"

export default async function approved(org: string, peer: string, ch: string, payload: PeerApprovedPayload) {
  return new ClientAPI(`/${org}/${peer}/${ch}/approved`).POST(payload)
}