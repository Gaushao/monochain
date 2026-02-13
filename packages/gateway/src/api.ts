import { Contract } from "@hyperledger/fabric-gateway"
import connect, { CONNECTION_OPTIONS } from "./connect"

type ContractProxy<R> = (contract: Contract) => Promise<R>

export default class GatewayAPI {
  static utf8Decoder = new TextDecoder()

  options = {
    ...CONNECTION_OPTIONS,
    channel: 'mychannel',
    chaincode: 'basic',
  }

  constructor(opt: Partial<typeof this.options> = {}) {
    this.options = Object.assign(this.options, opt)
  }

  get connection() {
    return connect(this.options)
  }

  async contractProxy<R = unknown>(cb: ContractProxy<R>) {
    const { gateway, close } = await this.connection
    const network = gateway.getNetwork(this.options.channel)
    console.log("🚀 ~ GatewayAPI ~ gateway:", gateway)
    console.log("🚀 ~ GatewayAPI ~ this.options:", this.options)
    const contract = network.getContract(this.options.chaincode)
    const res = await cb(contract)
    close()
    return res
  }

  async getAssets() {
    return this.contractProxy(async contract => {
      const resultBytes = await contract.evaluateTransaction('GetAllAssets')
      const resultJson = GatewayAPI.utf8Decoder.decode(resultBytes)
      const result = JSON.parse(resultJson) as {
        AppraisedValue: number,
        Color: string,
        ID: string,
        Owner: string,
        Size: number
      }[]
      return result
    })
  }

  async createAsset(id: string, color: string, size: string, owner: string, appraisedValue: string) {
    return this.contractProxy(async contract => contract.submitTransaction(
      'CreateAsset', id, color, size, owner, appraisedValue
    ))
  }

  async getChannels() {
    return this.contractProxy(async c => (await c.evaluateTransaction('GetChannels', 'arg1', 'arg2')).toString())
  }
}