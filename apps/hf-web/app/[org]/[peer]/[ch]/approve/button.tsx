'use client'

import { usePeerChannelApproved } from "../approved/hook"
import { usePeerChannelApprove } from "./hook"
import { PeerInstalledResponse } from "../../cc/installed/types"

export default function PeerChannelApproveButton({
  label: name, package_id
}: PeerInstalledResponse[number]) {
  const approve = usePeerChannelApprove()
  const approved = usePeerChannelApproved()
  console.log('WIP PeerChannelApproveButton')
  approved({ name }).then(console.log).catch(console.error)
  return <button onClick={() => approve({ name, package_id })}>approve</button>
}