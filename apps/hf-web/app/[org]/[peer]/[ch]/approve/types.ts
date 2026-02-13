import { GatewayPeerApprovePayload } from "@repo/gateway"

export type PeerApprovePayload = Omit<GatewayPeerApprovePayload, 'channel'>