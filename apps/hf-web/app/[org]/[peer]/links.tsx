'use client'

import Link from "next/link"
import { usePeerUrl } from "./hook"

export function ChaincodesPageLink() {
  return <Link href={`${usePeerUrl()}/cc`}>chaincodes</Link>
}