import { ethers } from "ethers"

export function getAddress(address?: string) {
  return ethers.isAddress(address) ? address : null
}

export function getAddress0x(address?: string) {
  const addr0x = '0x' + address
  return getAddress(addr0x) || getAddress(address)
}
