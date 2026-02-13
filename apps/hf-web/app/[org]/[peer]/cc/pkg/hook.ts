import { GatewayPeerPackagePayload } from "@repo/gateway"
import { usePeerParams } from "../../hook"
import pkg from "./client"

export function usePackageClient() {
  const { org, peer } = usePeerParams()
  return (payload: GatewayPeerPackagePayload) => pkg(org, peer, payload)
}