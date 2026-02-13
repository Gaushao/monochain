import { ClientAPI } from "@repo/api"

export default function installed(org?: string, peer?: string): Promise<{
  package_id: string; label: string
}[]> {
  return new ClientAPI(`/${org}/${peer}/cc/installed`).GET
}
