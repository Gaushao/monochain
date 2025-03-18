import { PropsWithChildren } from "react"
import OrganizationTitle from "./title"

export default function OrganizationLayout({ children }: PropsWithChildren) {
  return <>
    <OrganizationTitle />
    <br />
    {children}
  </>
}
