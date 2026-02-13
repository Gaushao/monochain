'use client'

import Link from "next/link"
import { useOrgUrl } from "./hook"

export function IdentitiesLink() {
  return <Link href={useOrgUrl('identities')}>identities</Link>
}

export function ChaincodesLink() {
  return <Link href={useOrgUrl('chaincodes')}>chaincodes</Link>
}