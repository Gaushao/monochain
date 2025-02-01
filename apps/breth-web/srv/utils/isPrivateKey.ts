import { Wallet } from 'ethers'

export function isPrivateKey(key?: string): boolean {
  if (typeof key !== 'string') return false
  try {
    new Wallet(key)
    return true
  } catch (e) {
    return false
  }
}
