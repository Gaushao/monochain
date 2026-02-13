import { GatewayPeerCommitPayload } from "@repo/gateway"
import { useChannelParams } from "../hook"
import commit from "./client"

export function usePeerChannelCommit() {
  const { org, peer, ch } = useChannelParams()
  return (p: GatewayPeerCommitPayload) => commit(p, org, peer, ch)
}