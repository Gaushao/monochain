"use client"

import { useRouter } from "next/navigation"
import { useChannelParam } from "../[ch]/hook"

const initial = '/'

export default function ChannelSelect({
  options = [], org, peer
}: Partial<{ options: string[]; org: string; peer: string }>) {
  const orgpeerurl = `/${org}/${peer}`
  const { push } = useRouter()
  return <select value={useChannelParam()} onChange={e => {
    const value = e.target.value
    if (value === initial) return push(orgpeerurl)
    push(`${orgpeerurl}/${value}`)
  }}>
    <option value={initial}>select a channel</option>
    {options?.map(org => <option key={org} value={org}>{org}</option>)}
  </select>
}