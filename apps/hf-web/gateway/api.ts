import { Contract } from "@hyperledger/fabric-gateway"
import connect from "./connect"

type ContractProxy<R> = (contract: Contract) => Promise<R>

export default class GatewayApi {
  static utf8Decoder = new TextDecoder()

  channelName: string | 'mychannel'
  chaincodeName: string | 'basic'

  constructor(channelName: string, chaincodeName: string) {
    this.channelName = channelName
    this.chaincodeName = chaincodeName
  }

  get connection() {
    return connect()
  }

  async contractProxy<R = unknown>(cb: ContractProxy<R>) {
    const { gateway, close } = await this.connection
    const network = gateway.getNetwork(this.channelName)
    const contract = network.getContract(this.chaincodeName)
    const res = await cb(contract)
    close()
    return res
  }

  async getAssets() {
    return this.contractProxy(async contract => {
      const resultBytes = await contract.evaluateTransaction('GetAllAssets')
      const resultJson = GatewayApi.utf8Decoder.decode(resultBytes)
      const result = JSON.parse(resultJson) as unknown[]
      return result
    })
  }

  async createAsset(id: string, color: string, size: string, owner: string, appraisedValue: string) {
    return this.contractProxy(async contract => contract.submitTransaction(
      'CreateAsset', id, color, size, owner, appraisedValue
    ))
  }
}