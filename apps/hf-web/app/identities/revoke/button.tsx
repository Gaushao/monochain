'use client'

export default function RevokeIdentityButton({ name }: { name: string }) {
  return <button onClick={() => fetch('identities/revoke', {
    method: 'POST', body: JSON.stringify({ name })
  }).then(r => r.json().then(console.log))}>revoke</button>
}