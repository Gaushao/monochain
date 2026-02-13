import PeerChaincodesTable from "../cc/table"
import InstalledTable from "../cc/installed/table"
import { ChannelPageProps } from "./types"

export default async function ChannelPage({ params }: ChannelPageProps) {
  return <>
    <h4>chaincodes</h4>
    <br />
    <h5>installed</h5>
    <br />
    <InstalledTable params={params} />
    <br />
    <h5>source</h5>
    <br />
    <PeerChaincodesTable />
    <br />
  </>
}