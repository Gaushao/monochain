import GatewayApi from './api'

export { default as CertAuthSDK } from './ca/sdk'

// https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic
export const mychannelBasicApi = new GatewayApi({
  channel: 'mychannel',
  chaincode: 'basic',
})
