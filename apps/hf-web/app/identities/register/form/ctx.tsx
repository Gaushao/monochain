'use client'

import { PropsWithChildren } from "react"
import { Form } from "@repo/ui"

export default function RegisterIdentityFormCtx({ children }: PropsWithChildren) {
  return <Form submit={f => fetch('identities/register', {
    method: 'POST', body: JSON.stringify(f)
  }).then(r => r.json().then(console.log))}>
    {children}
  </Form>
}
