import chaincodes from "../../../../chaincodes/client"

export type ChaincodePkgProps = {
  chaincode: Awaited<ReturnType<typeof chaincodes>>[number]
}
