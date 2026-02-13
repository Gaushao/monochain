"use client"

import { useRouter } from "next/navigation"
import { useOrgParam } from "../[org]/hook"

const initial = '/'

export default function OrganizationSelect({ options = [] }: Partial<{
  options: string[]
}>) {
  const { push } = useRouter()
  const org = useOrgParam() || initial
  return <select value={org} onChange={e => push('/' + e.target.value)}>
    <option value={initial}>select an organization</option>
    {options?.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
}