import { ContractFactory } from "ethers"
import { ethers } from "hardhat"
import { ChipToken } from "../typechain-types"

const ChipTokenDeploy = async (): Promise<any> => {
  const ChipToken: ContractFactory = await ethers.getContractFactory("ChipToken")
  const chipToken = await ChipToken.deploy("Real Brasileiro", "BRL", 2) as ChipToken
  console.log(`ChipToken deployed to: ${await chipToken.getAddress()}`)
}

export default ChipTokenDeploy