'use client'

import { createContext, PropsWithChildren, use, useEffect } from "react"
import { useAsync, useLocalStorage } from "@repo/ui"
import { useBrethBalance } from "../hooks"
import { breth } from "../srv"

type LocalWalletStorage = {
  address: string
  phrase: string
}

function useLocalWalletStorage() {
  const [_storage, setStorage] = useLocalStorage<LocalWalletStorage[]>('wallet')
  const storage = _storage || []
  const [selected] = storage
  const {
    data: encrypted = selected,
    loading: encrypting,
    fetch: encrypt,
    reset: resetEncrypt,
  } = useAsync(async (p: string): Promise<LocalWalletStorage> => JSON.parse(
    await breth.createRandomWallet.encrypt(p)
  ))
  useEffect(() => {
    if (encrypted) setStorage(curr => curr?.find(
      w => w.address === encrypted.address
    ) ? curr : [encrypted, ...(curr || storage)])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encrypted])

  const {
    data: decrypted,
    loading: decrypting,
    fetch: decrypt,
    reset: resetDecrypt,
  } = useAsync((password: string) => breth.fromEncryptedJsonWallet(
    JSON.stringify(encrypted) || '', password
  ))
  const find = (address: string) => storage?.find(w => w.address === address)
  const remove = (address: string) => {
    setStorage(curr => curr.filter(w => w.address !== address))
  }
  const add = async ({ password }: { password: string }) => {
    const derived = breth.deriveChild(storage.length, decrypted)
    if (!derived) return
    const encrypted = await derived.encrypt(password)
    const w: LocalWalletStorage = typeof encrypted === 'string' ? JSON.parse(encrypted) : encrypted
    setStorage(curr => curr?.find(stored => stored.address === w.address) ? curr : [w, ...curr])
  }
  const reset = () => {
    resetEncrypt()
    resetDecrypt()
    setStorage([])
  }
  const address = selected?.address
  const phrase = breth.getPhrase(decrypted)
  return {
    wallets: storage,
    selected,
    address,
    encrypted,
    decrypted,
    resetDecrypt,
    decrypting,
    reset,
    decrypt,
    encrypting,
    resetEncrypt,
    encrypt,
    phrase,
    find,
    add,
    remove,
    clear: () => setStorage([]),
    select: (address: string) => {
      setStorage(curr => {
        const found = curr.find(w => w.address === address)
        return found ? [found, ...curr] : curr
      })
      const found = find(address)
      if (!found) return
      if (storage[0]?.address === address) return
      const unselected = storage.filter(wallet => wallet.address !== address)
      setStorage([found, ...unselected])
      if (found) return found
    }
  }
}

const Context = createContext({} as ReturnType<typeof useLocalWalletStorage>)

const Provider = ({ children }: PropsWithChildren<unknown>) => <Context.Provider
  value={useLocalWalletStorage()}>{children}</Context.Provider>

export const LocalStorageWalletCtx = (
  p: Parameters<typeof Provider>[0]
) => typeof window === 'undefined' ? null : <Provider {...p} />

export const useLocalStorageWalletCtx = () => use(Context)

export function useLocalStorageWalletCtxBalance() {
  const ctx = useLocalStorageWalletCtx()
  const balance = useBrethBalance(ctx.address)
  return { ...ctx, balance }
}