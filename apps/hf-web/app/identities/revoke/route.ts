import { CertAuthCLI } from "../../../gateway"

const ca = new CertAuthCLI()

export async function POST(req: Request) {
  try {
    const payload: { name: string } = await req.json()
    return Response.json(await ca.revoke(payload.name))
  } catch (error) {
    return Response.json(error)
  }
}
