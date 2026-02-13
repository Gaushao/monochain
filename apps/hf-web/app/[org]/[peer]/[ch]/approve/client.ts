import { ClientAPI } from "@repo/api"
import { PeerApprovePayload } from "./types"

export default async function approve(org: string, peer: string, ch: string, payload: PeerApprovePayload) {
  return new ClientAPI(`/${org}/${peer}/${ch}/approve`).POST(payload)
}