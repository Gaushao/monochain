import { PropsWithChildren } from "react"
import PeerSelect from "./peers/select"
import { OrganizationPageProps } from "./types"
import peers from "./peers/client"

export default async function OrganizationLayout({ children, params }: PropsWithChildren<OrganizationPageProps>) {
  const org = (await params)?.org
  return <>
    <h1>{org}</h1>
    {org && <PeerSelect options={await peers(org)} />}
    <br />
    {children}
  </>
}
