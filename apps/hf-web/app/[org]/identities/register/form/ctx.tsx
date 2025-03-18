'use client'

import { PropsWithChildren } from "react"
import { Form } from "@repo/ui"
import { useOrgUrl } from "../../../hook"

export default function RegisterIdentityFormCtx({ children }: PropsWithChildren) {
  const url = useOrgUrl('identities/register')
  return <Form submit={f => fetch(url, {
    method: 'POST', body: JSON.stringify(f)
  }).then(r => r.json().then(console.log).catch(console.log))}>
    {children}
  </Form>
}
