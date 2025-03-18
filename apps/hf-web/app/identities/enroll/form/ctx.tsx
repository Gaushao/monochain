'use client'

import { PropsWithChildren } from "react"
import { Form } from "@repo/ui"

export default function EnrollIdentityFormCtx({
  children, name
}: PropsWithChildren<{ name: string }>) {
  return <Form submit={f => fetch('identities/enroll', {
    method: 'POST', body: JSON.stringify({ ...f, name })
  }).then(r => r.json().then(console.log))}>
    {children}
  </Form>
}
