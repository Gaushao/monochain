'use client'

import { useParams } from "next/navigation"

export function useOrgParam() {
  return useParams()?.org
}

export function useOrgUrl(path?: string) {
  return `/${useOrgParam()}${path ? `/${path}` : ''}`
}