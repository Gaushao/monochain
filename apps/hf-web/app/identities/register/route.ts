import { CertAuthCLI } from "../../../gateway"

type Credentials = { name: string; secret: string }

const ca = new CertAuthCLI()

export async function POST(req: Request) {
  try {
    const cred: Credentials = await req.json()
    return Response.json(await ca.register(cred.name, cred.secret))
  } catch (error) {
    return Response.json(error)
  }
}
