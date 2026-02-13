'use client'

import { useParams } from "next/navigation"

export function usePeerParams() {
  const p = useParams()
  return {
    org: String(p?.org),
    peer: String(p?.peer)
  }
}

export function usePeerParam() {
  return useParams()?.peer
}

export function usePeerUrl(path?: string) {
  const p = path ? `/${path}` : ''
  return `${usePeerParam()}${p}`
}
