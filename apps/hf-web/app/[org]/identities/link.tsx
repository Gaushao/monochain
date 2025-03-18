'use client'

import Link from "next/link"
import { useOrgUrl } from "../hook"

export default function IdentitiesLink() {
  return <Link href={useOrgUrl('identities')}>identities</Link>
}