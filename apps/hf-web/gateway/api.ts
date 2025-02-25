import { Contract } from "@hyperledger/fabric-gateway"
import connect from "./connect"
import { chaincodeName, channelName, utf8Decoder } from "./const"

type ContractProxy<R> = (contract: Contract) => Promise<R>

export default class GatewayApi {

  get connection() {
    return connect()
  }

  async contractProxy<R = unknown>(cb: ContractProxy<R>) {
    const { gateway, close } = await this.connection
    const network = gateway.getNetwork(channelName)
    const contract = network.getContract(chaincodeName)
    const res = await cb(contract)
    close()
    return res
  }

  async getAssets() {
    return this.contractProxy(async contract => {
      console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger')
      const resultBytes = await contract.evaluateTransaction('GetAllAssets')
      const resultJson = utf8Decoder.decode(resultBytes)
      const result = JSON.parse(resultJson) as unknown[]
      console.log('*** Result:', result)
      return result
    })
  }

  async createAsset(id: string, color: string, size: string, owner: string, appraisedValue: string) {
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments')
    return this.contractProxy(async contract => contract.submitTransaction(
      'CreateAsset', id, color, size, owner, appraisedValue
    ))
  }
}