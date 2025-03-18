'use client'

import { PropsWithChildren } from "react"
import { Form } from "@repo/ui"
import { useOrgUrl } from "../../../hook"

export default function EnrollIdentityFormCtx({
  children, name
}: PropsWithChildren<{ name: string }>) {
  const url = useOrgUrl('identities/enroll')
  return <Form submit={f => fetch(url, {
    method: 'POST', body: JSON.stringify({ ...f, name })
  }).then(r => r.json().then(console.log).catch(console.log))}>
    {children}
  </Form>
}
