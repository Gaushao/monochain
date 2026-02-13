import { PropsWithChildren } from "react"
import ChannelSelect from "./channels/select"
import channels from "./channels/client"
import { PeerPageProps } from "./types"

export default async function PeerLayout({ children, params }: PropsWithChildren<PeerPageProps>) {
  const { org, peer } = await params
  return <>
    <h2>{peer}</h2>
    {org && peer && <ChannelSelect org={org} peer={peer} options={await channels(org, peer)} />}
    <br />
    <br />
    {children}
  </>
}
