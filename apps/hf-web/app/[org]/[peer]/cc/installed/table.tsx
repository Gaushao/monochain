import { Table } from "@repo/ui"
import installed from "./client"
import { PeerPageProps } from "../../types"
import PeerChannelApproveButton from "../../[ch]/approve/button"

export default async function InstalledTable(p: PeerPageProps) {
  const { org, peer } = await p.params
  return <Table data={(await installed(org, peer)).map(pkg => ({
    ...pkg, actions: () => <PeerChannelApproveButton {...pkg} />
  }))} />
}