'use client'

import { useState } from "react"
import { KeyPassForm, PasswordForm, TransferForm, useAsyncOnChange } from "@repo/ui"
import { breth, getAddress0x, isPrivateKey, toEther, toWei } from "../../srv"
import { LocalStorageWalletCtx, useLocalStorageWalletCtx, useLocalStorageWalletCtxBalance } from "../../ctx"

export function Balance() {
  const { address, balance } = useLocalStorageWalletCtxBalance()
  return address ? <>
    <h2>address</h2>
    <h3>{address}</h3>
    <h2>balance</h2>
    <h3>{balance.data}</h3>
  </> : null
}

const BIG_ZERO = BigInt(0)

export function Transfer() {
  const { encrypted } = useLocalStorageWalletCtxBalance()
  const [request, setRequest] = useState<Partial<{
    to: string; value: string; password: string
  }>>()
  const transaction = useAsyncOnChange(async (req: typeof request) => {
    if (!req?.password) return
    const { password, to, value } = req
    const wallet = breth.loadWallet((await breth.fromEncryptedJsonWallet(JSON.stringify(encrypted), password)).privateKey)
    const r = { to: getAddress0x(to), value: toWei(value) }
    const gasLimit = await wallet.estimateGas(r)
    const response = await wallet.sendTransaction({ ...r, gasLimit })
    const receipt = await response.wait()
    return { request: r, response, receipt, gasLimit }
  }, [request])
  if (!encrypted) return null
  const result = {
    fee: transaction.data?.receipt?.fee || BIG_ZERO,
    value: transaction.data?.request?.value || BIG_ZERO,
    get sent() { return this.value - this.fee },
    get ether() {
      return ({
        value: toEther(this.value),
        fee: toEther(this.fee),
        sent: toEther(this.sent)
      })
    }
  }
  return <>
    <h2>transfer</h2>
    {transaction.loading ? 'loading...' : <h3><TransferForm
      submit={setRequest} button={{ children: 'send' }}
    /></h3>}
    {transaction.data && <h3>
      transaction {JSON.stringify(result.ether)} <button onClick={() => transaction.reset()}>ok</button>
    </h3>}
  </>
}

function Decryption() {
  const {
    decrypted,
    resetDecrypt,
    decrypting,
    reset,
    decrypt,
  } = useLocalStorageWalletCtx()
  return decrypted ? <>
    <h2>decrypted <button onClick={() => resetDecrypt()}>close</button></h2>
    <h3>private key {decrypted.privateKey}</h3>
  </> : decrypting ? 'decrypting...' : <>
    <h2>encrypted <button onClick={reset}>remove</button></h2>
    <h3><PasswordForm
      submit={({ password }) => decrypt(password)}
      button={{ children: 'open' }}
    /></h3>
  </>
}

function Encryption() {
  const {
    encrypted,
    encrypting,
    resetEncrypt,
    encrypt,
  } = useLocalStorageWalletCtx()
  return encrypted ? <>
    <Transfer />
    <Decryption />
  </> : encrypting ? 'encrypting...' : <h2>
    <KeyPassForm submit={({ key, password }) => (key && isPrivateKey(key))
      ? breth.loadWallet(key).encrypt(password).then(s => {
        resetEncrypt(JSON.parse(s))
      }) : encrypt(password)} button={{ children: 'create' }} />

  </h2>
}

function Add() {
  const { phrase, add } = useLocalStorageWalletCtx()
  return phrase ? <>
    <h2>phrase</h2>
    <p>{phrase}</p>
    <h2><PasswordForm submit={add} button={{ children: 'add' }} /></h2>
  </> : null
}

function Addresses() {
  const { wallets, selected, select } = useLocalStorageWalletCtx()
  return wallets.filter(w => w.address !== selected?.address).map(w => <h2 key={w.address}>
    {w.address} <button onClick={() => { select(w.address) }}>select</button>
  </h2>)
}

function Content() {
  return <>
    <h1>local storage wallet</h1>
    <Balance />
    <Addresses />
    <Encryption />
    <Add />
  </>
}

const LocalStorageWallet = () => <LocalStorageWalletCtx><Content /></LocalStorageWalletCtx>

export default LocalStorageWallet