'use client'

import { GatewayPeerCommitPayload } from "@repo/gateway"
import { usePeerChannelCommit } from "./hook"

export default function ChannelCommitButton(p: GatewayPeerCommitPayload) {
  const commit = usePeerChannelCommit()
  return <button onClick={() => commit(p)}>approve</button>
}