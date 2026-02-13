'use client'

import { useParams } from "next/navigation"

export function useChannelParam() {
  return String(useParams()?.ch)
}

export function useChannelParams() {
  return useParams() as { org: string, peer: string, ch: string }
}

export function useChannelUrl(path?: string) {
  return `${useChannelParam()}${path ? `/${path}` : ''}`
}