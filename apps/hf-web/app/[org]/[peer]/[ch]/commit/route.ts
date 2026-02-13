import { GatewayPeer } from "@repo/gateway"
import { ChannelPageProps } from "../types"

export async function POST(req: Request, ctx: ChannelPageProps) {
  const { org, peer, ch } = await ctx.params
  if (!org || !peer || !ch) return Response.json('missing environment')
  const res = new GatewayPeer(org, peer).commit(await req.json())
  return Response.json(res)
}