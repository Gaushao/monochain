import { GatewayPeerPackagePayload } from "@repo/gateway"

export default async function pkg(org: string, peer: string, payload: GatewayPeerPackagePayload) {
  return (await fetch(`/${org}/${peer}/cc/pkg`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })).json()
}