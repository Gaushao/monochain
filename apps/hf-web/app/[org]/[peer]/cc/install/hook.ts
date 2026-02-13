import { usePeerParams } from "../../hook"
import install from "./client"

export function usePeerInstall() {
  const { org, peer } = usePeerParams()
  return (path: string) => install(org, peer, path)
}