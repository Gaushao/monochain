import { JsonRpcProvider, Wallet, HDNodeWallet } from "ethers"
import { PUBLIC_RPC_URL } from "@repo/env/"
import { getAddress0x } from "./utils"

export default class BrethService {

  static Provider = class Provider extends JsonRpcProvider {
    constructor() {
      super(PUBLIC_RPC_URL)
    }
  }

  get provider() { return new BrethService.Provider() }
  get createRandomWallet() { return Wallet.createRandom(this.provider).deriveChild(0) }
  get fromEncryptedJsonWallet() { return Wallet.fromEncryptedJson }
  loadWallet(key: string) { return new Wallet(key, this.provider) }
  fromPhrase(phrase: string) { return HDNodeWallet.fromPhrase(phrase) }
  deriveChild(index: number, wallet?: Wallet | HDNodeWallet) {
    return (wallet as HDNodeWallet)?.deriveChild(index)
  }
  getPhrase(wallet?: Wallet | HDNodeWallet) {
    return (wallet as HDNodeWallet)?.mnemonic?.phrase
  }
  async getBalance(address?: string) {
    const addr0x = getAddress0x(address)
    return addr0x ? this.provider.getBalance(addr0x) : 0
  }
}