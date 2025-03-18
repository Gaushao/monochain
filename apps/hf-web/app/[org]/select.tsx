"use client"

import { usePathname, useRouter } from "next/navigation"
import { useOrgParam } from "./hook"

export default function OrganizationSelect({ options = [] }: Partial<{ options: string[] }>) {
  const { push } = useRouter()
  const pathname = usePathname()
  const value = useOrgParam() || '/'
  return <select value={value} onChange={e => push(pathname !== '/' ? pathname.replace(`/${value}`, `/${e.target.value}`) : `/${e.target.value}`)}>
    <option value='/'>select an organization</option>
    {options?.map(org => <option key={org} value={org}>{org}</option>)}
  </select>
}