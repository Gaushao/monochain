import GatewayAPI from './api'

export { default as GatewayCA } from './ca'
export * as CA_ENV from './env'

// https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic
export const mychannelBasicApi = new GatewayAPI({
  channel: 'mychannel',
  chaincode: 'basic',
})
