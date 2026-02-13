import { ClientAPI } from "@repo/api"
import { GatewayPeerCommitPayload } from "@repo/gateway"

export default function commit(payload: GatewayPeerCommitPayload, org?: string, peer?: string, ch?: string) {
  return new ClientAPI(`/${org}/${peer}/${ch}/commit`).POST(payload)
}
