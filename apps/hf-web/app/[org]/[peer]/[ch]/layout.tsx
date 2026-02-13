import { PropsWithChildren } from "react"
import { ChannelPageProps } from "./types"

export default async function ChannelLayout({ children, params }: PropsWithChildren<ChannelPageProps>) {
  return <>
    <h3>{(await params).ch}</h3>
    <br />
    {children}
  </>
}
