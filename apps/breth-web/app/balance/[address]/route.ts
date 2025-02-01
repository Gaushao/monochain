import { NextRequest } from "next/server"
import { breth } from "../../../srv"

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.pathname.split('/')[2]
    return Response.json({ address, balance: (await breth.getBalance(address)).toString() })
  } catch (error) {
    return Response.json(error)
  }
}
