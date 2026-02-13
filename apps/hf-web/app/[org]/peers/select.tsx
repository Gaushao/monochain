"use client"

import { usePathname, useRouter } from "next/navigation"
import { useOrgUrl } from "../hook"
import { usePeerParam } from "../[peer]/hook"

const initial = '/'

export default function PeerSelect({ options = [] }: Partial<{ options: string[] }>) {
  const { push } = useRouter()
  const pathname = usePathname()
  const peer = usePeerParam()
  const orgurl = useOrgUrl()
  return <select value={peer} onChange={e => {
    const value = e.target.value
    if (value === initial) return push(orgurl)
    const parent = pathname === '/' || pathname === orgurl
    if (parent) return push(`${orgurl}/${value}`)
    push(pathname.replace(`/${peer}`, `/${value}`))
  }}>
    <option value={initial}>select a peer</option>
    {options?.map(org => <option key={org} value={org}>{org}</option>)}
  </select>
}