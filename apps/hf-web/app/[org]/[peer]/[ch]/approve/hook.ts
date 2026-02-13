import { useChannelParams } from "../hook"
import approve from "./client"
import type { PeerApprovePayload } from "./types"

export function usePeerChannelApprove() {
  const { org, peer, ch } = useChannelParams()
  return (p: PeerApprovePayload) => approve(org, peer, ch, p)
}