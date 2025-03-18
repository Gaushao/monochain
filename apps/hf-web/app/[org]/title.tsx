'use client'

import { useOrgParam } from "./hook"

export default function OrganizationTitle() {
  return <h1>{useOrgParam()}</h1>
}