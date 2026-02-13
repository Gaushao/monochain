import { GatewayPeerApprovedPayload } from "@repo/gateway"

export type PeerApprovedPayload = Omit<GatewayPeerApprovedPayload, 'channel'>