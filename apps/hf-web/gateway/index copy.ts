import GatewayAPI from './api'

export { default as GatewayCA } from './ca'
export { default as GatewayPeer } from './peer'
export { default as OrganizationGateway } from './org'

export * as CA_ENV from './env'

// https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic
export const mychannelBasicApi = new GatewayAPI({
  channel: 'mychannel',
  chaincode: 'basic',
})

export const qsccApi = new GatewayAPI({
  channel: 'mychannel',
  chaincode: 'qscc',
})
