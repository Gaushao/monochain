import { useChannelParams } from "../hook"
import approved from "./client"
import type { PeerApprovedPayload } from "./types"

export function usePeerChannelApproved() {
  const { org, peer, ch } = useChannelParams()
  return (p: PeerApprovedPayload) => approved(org, peer, ch, p)
}