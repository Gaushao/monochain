"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface AsyncCallback {
  (...args: any): Promise<unknown>
}

export class UseAsyncHandler {
  data = null
  loading = false
  error = null
  fetch: AsyncCallback = async () => { }
}

export const INITIAL_ASYNC_HANDLER = new UseAsyncHandler()

export function useAsync<
  F extends AsyncCallback,
  R extends ReturnType<F>,
  D extends Awaited<R>
>(cb: F) {
  const [error, setError] = useState<null | Error | unknown>(null)
  const [loading, setLoading] = useState(false)
  const promises = useRef([])
  const [data, setData] = useState<D>()
  useEffect(() => {
    (async () => {
      try {
        if (promises.current.length) {
          const res = (await Promise.all(promises.current)).pop()
          if (res) {
            setData(res)
            promises.current = []
          }
        }
      } catch (e) {
        setError(e)
      }
      setLoading(false)
    })()
  }, [promises.current.length])
  const fetch = useCallback(
    (...p: Parameters<F>) => {
      setLoading(true)
      const promise = cb(...p)
      promises.current.push(promise as never)
      return promise as R
    },
    [cb]
  )
  const reset = useCallback((d?: D) => {
    promises.current = []
    setData(d)
    setError(null)
    setLoading(false)
  }, [])
  return useMemo(() => ({ data, error, loading, fetch, reset }), [data, error, loading, fetch, reset])
}

export function useAsyncOnMount<F extends AsyncCallback>(cb: F) {
  const handler = useAsync(cb)
  useEffect(() => { handler.fetch(...([] as unknown as Parameters<F>)) }, [])
  return handler
}

export function useAsyncOnChange<F extends AsyncCallback>(
  cb: F, params: Parameters<F>
) {
  const ref = useRef({ cache: [] as unknown as typeof params })
  const handler = useAsync(cb)
  const { fetch } = handler
  useEffect(() => {
    if (!params || JSON.stringify(ref.current.cache) === JSON.stringify(params)) return
    ref.current.cache = params
    fetch(...params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  return handler
}

export function useAsyncCatcher<F extends AsyncCallback>(cb: F, handle: (e: unknown) => void) {
  const handler = useAsync(cb)
  useEffect(() => { if (handler.error) handle(handler.error) }, [handler.error])
  return handler
}

export function useAsyncCatcherOnMount<F extends AsyncCallback>(cb: F, handle: (e: unknown) => void) {
  const handler = useAsyncOnMount(cb)
  useEffect(() => { if (handler.error) handle(handler.error) }, [handler.error])
  return handler
}

export function useAsyncInterval<F extends AsyncCallback>(cb: F, ms: number) {
  const interval = useRef<NodeJS.Timeout>(null)
  const handler = useAsync(cb)
  const init = useCallback(() => {
    if (interval.current) clearInterval(interval.current)
    if (ms) interval.current = setInterval(() => { handler.fetch(...[] as unknown as Parameters<F>) }, ms)
    else interval.current = null
  }, [ms, cb])
  useEffect(() => { init() }, [])
  const fetch = useCallback<(...args: Parameters<F>) => ReturnType<F>>((...p) => {
    init()
    return handler.fetch(...p as Parameters<F>)
  }, [init, handler.fetch])
  useEffect(() => { return () => { if (interval.current) clearInterval(interval.current) } }, [])
  return { ...handler, fetch }
}
