import { BigNumberish, formatEther, parseEther } from 'ethers'

export const toEther = (wei?: BigNumberish) => wei ? formatEther(wei) : '0'
export const toWei = (ether?: string) => ether ? parseEther(ether) : BigInt(0)