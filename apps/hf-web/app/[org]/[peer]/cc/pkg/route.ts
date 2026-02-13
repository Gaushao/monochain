import { GatewayPeer } from "@repo/gateway"
import { PeerPageProps } from "../../types"

export async function POST(req: Request, ctx: PeerPageProps) {
  const { org, peer } = await ctx.params
  if (!org || !peer) return Response.json('missing environment')
  return Response.json(await new GatewayPeer(org, peer).package(await req.json()))
}