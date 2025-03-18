'use client'

import { useOrgUrl } from "../../hook"

export default function RevokeIdentityButton({ name }: { name: string }) {
  const url = useOrgUrl('identities/revoke')
  return <button onClick={() => fetch(url, {
    method: 'POST', body: JSON.stringify({ name })
  }).then(r => r.json().then(console.log).catch(console.log))}>revoke</button>
}