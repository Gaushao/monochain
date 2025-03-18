import path from "path"
import { readdirSync, statSync } from "fs"
import { FABRIC_CA_PATH } from "../../gateway/env"

export async function GET() {
  return Response.json(readdirSync(FABRIC_CA_PATH).filter((dir) => statSync(
    path.join(FABRIC_CA_PATH, dir)
  ).isDirectory()))
}