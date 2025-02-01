import { useAsyncOnChange } from "@repo/ui"
import { breth } from "../srv"

export function useBrethBalance(address?: string) {
  return useAsyncOnChange(async addr => (await breth.getBalance(addr)).toString(), [address])
}
