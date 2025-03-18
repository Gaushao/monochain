import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { FABRIC_CA_PATH } from "../../gateway/env"

export async function GET() {
  try {
    const orgs = fs.readdirSync(FABRIC_CA_PATH).filter((dir) =>
      fs.statSync(path.join(FABRIC_CA_PATH, dir)).isDirectory()
    )
    return NextResponse.json({
      certificates: orgs.map((org) => {
        const certPath = path.join(FABRIC_CA_PATH, org, "tls-cert.pem")
        return fs.existsSync(certPath) ? { org, certPath } : null
      }).filter(Boolean)
    })
  } catch (error) {
    return NextResponse.json(error)
  }
}