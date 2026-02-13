import { GatewayPeer } from "@repo/gateway"
import { PeerPageProps } from "../../types"

export async function POST(req: Request, ctx: PeerPageProps) {
  try {
    const { org, peer } = await ctx.params
    const { path } = await req.json()
    return Response.json(await new GatewayPeer(org, peer).install(path))
  } catch (e) {
    return Response.json(e)
  }
}