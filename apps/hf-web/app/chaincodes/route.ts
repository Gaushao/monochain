import path from "path"
import { readdirSync } from "fs"
import { CHAINCODES_PATH } from "@repo/gateway/src/env"

export async function GET() {
  const chaincodes = []
  for (const language of readdirSync(CHAINCODES_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)) {
    const lpath = path.join(CHAINCODES_PATH, language)
    for (const name of readdirSync(lpath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)) {
      const p = path.join(lpath, name)
      chaincodes.push({
        name, language, path: p, packages: (() => {
          try {
            return readdirSync(p + '/pkgs')
          } catch (e) {
            return []
          }
        })()
      })
    }
  }
  return Response.json(chaincodes)
}