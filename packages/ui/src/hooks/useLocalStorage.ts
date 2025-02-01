'use client'

import { useEffect, useRef, useState } from "react"

class ClientLocalStorage {
  static get storage() {
    return typeof window === 'undefined' ? null : localStorage
  }

  _key = ''

  get data() {
    return ClientLocalStorage.storage?.getItem(this._key)
  }
  set save(data: string) {
    ClientLocalStorage.storage?.setItem(this._key, data)
  }
  get empty() {
    ClientLocalStorage.storage?.removeItem(this._key)
    return this.data
  }

  constructor(key: string) {
    this._key = key
  }
}

export function useLocalStorage<D>(key: string) {
  const { current: storage } = useRef(new ClientLocalStorage(key))
  const initial = storage.data
  const handler = useState<D>(initial ? JSON.parse(initial) : initial)
  const [data] = handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { storage.save = JSON.stringify(data) }, [data])
  return handler
}
