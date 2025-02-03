import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-chai-matchers"
import 'solidity-docgen'
import { task } from "hardhat/config"
import { ethers } from "ethers"
import dotenv from 'dotenv'

dotenv.config()

task("accounts", "Prints the list of accounts", async (args, hre): Promise<void> => {
  const accounts = await hre.ethers.getSigners()
  accounts.forEach(account => console.log(account.address))
})

task("balances", "Prints the list of ETH account balances", async (args, hre): Promise<void> => {
  const accounts = await hre.ethers.getSigners()
  for (const account of accounts) {
    const balance: bigint = await hre.ethers.provider.getBalance(
      account.address
    )
    console.log(`${account.address} has balance ${balance.toString()}`)
  }
})

task("send", "Sends ETH from one account to another", async (args, hre): Promise<void> => {
  const [owner, operator] = await hre.ethers.getSigners()
  console.log(await owner.sendTransaction({
    to: operator.address,
    value: ethers.parseEther("1.0"), // Sends 1.0 ether
  }))
})

const CHIP_TOKEN_NAME = "ChipToken"
const CHIP_TOKEN_ADDRESS = "0x9f5eaC3d8e082f47631F1551F1343F23cd427162"

task("mint", "Mint Chips", async (args, hre): Promise<void> => {
  const [minter, recipient] = await hre.ethers.getSigners()
  const chipToken = await hre.ethers.getContractAt(CHIP_TOKEN_NAME, CHIP_TOKEN_ADDRESS)
  const mintTx = await chipToken.connect(minter).mint(recipient, ethers.parseEther("1.5"))
  await mintTx.wait()
  console.log(`Recipient balance: ${await chipToken.balanceOf(recipient)}`)
})

task("miners", "List Chip miners", async (args, hre): Promise<void> => {
  const chipToken = await hre.ethers.getContractAt(CHIP_TOKEN_NAME, CHIP_TOKEN_ADDRESS)
  const signers = await hre.ethers.getSigners()
  console.log(await Promise.all(signers.map(async signer => ({
    address: signer.address,
    miner: await chipToken.hasRole(await chipToken.MINTER_ROLE(), signer.address)
  }))))
})

task("chips", "List Chip balances", async (args, hre): Promise<void> => {
  const chipToken = await hre.ethers.getContractAt(CHIP_TOKEN_NAME, CHIP_TOKEN_ADDRESS)
  const signers = await hre.ethers.getSigners()
  console.log(await Promise.all(signers.map(async signer => ({
    address: signer.address,
    balance: await chipToken.balanceOf(signer.address),
    name: await chipToken.name(),
    symbol: await chipToken.symbol(),
  }))))
})

export default {
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      }
    ]
  },
  networks: {
    localnet: {
      url: process.env['PUBLIC_RPC_URL'],//TODO: REPLACE <PORT> WITH THE PORT OF A NODE URI PRODUCED BY THE ETH NETWORK KURTOSIS PACKAGE
      // These are private keys associated with prefunded test accounts created by the eth-network-package
      //https://github.com/ethpandaops/ethereum-package/blob/main/src/prelaunch_data_generator/genesis_constants/genesis_constants.star
      accounts: [
        "bcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31",
        "53321db7c1e331d93a11a41d16f004d7ff63972ec8ec7c25db329728ceeb1710",
        "ab63b23eb7941c1251757e24b3d2350d2bc05c3c388d06f8fe6feafefb1e8c70",
        "5d2344259f42259f82d2c140aa66102ba89b57b4883ee441a8b312622bd42491",
        "27515f805127bebad2fb9b183508bdacb8c763da16f54e0678b16e8f28ef3fff",
        "7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856",
      ],
    },
    // mainnet config...
    // testnet config...
  },
  docgen: {
    outputDir: "../docs/public/breth",
    pages: "items"
  }
}
