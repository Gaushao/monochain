'use client'

import { usePeerInstall } from "./hook"

export default function PeerInstallButton({ path, name }: { path: string; name: string }) {
  const install = usePeerInstall()
  return <button onClick={() => install(path)}>install {name}</button>
}