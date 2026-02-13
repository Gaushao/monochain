import { PeerPageProps } from "./types"
import { ChaincodesPageLink } from "./links"

export default async function OrganizationPeerPage(p: PeerPageProps) {
  return <>
    Peer Page
    <br />
    <ChaincodesPageLink />
  </>
}