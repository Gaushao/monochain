import { CertAuthCLI } from "../../../gateway"

const ca = new CertAuthCLI()

export async function POST(req: Request) {
  try {
    const payload: { name: string; secret: string } = await req.json()
    return Response.json(await ca.enroll(payload.name, payload.secret))
  } catch (error) {
    return Response.json(error)
  }
}
