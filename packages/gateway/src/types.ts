import GatewayPeer from "./peer"

// export type ChaincodeDeployPayload = {
//   name: string, path: string, language: string, channel: string, version?: string
// }

export type GatewayPeerPackagePayload = Parameters<GatewayPeer['package']>[0]
export type GatewayPeerInstallPayload = Parameters<GatewayPeer['install']>[0]
export type GatewayPeerApprovePayload = Parameters<GatewayPeer['approve']>[0]
export type GatewayPeerApprovedPayload = Parameters<GatewayPeer['approved']>[0]
export type GatewayPeerCommitPayload = Parameters<GatewayPeer['commit']>[0]
