import GatewayApi from './api'

export { default as CertAuthCLI } from './ca/cli'

// https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic
export const mychannelBasicApi = new GatewayApi({
  channel: 'mychannel',
  chaincode: 'basic',
})
