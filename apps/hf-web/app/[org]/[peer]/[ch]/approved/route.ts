import { GatewayPeer } from "@repo/gateway"
import { ChannelPageProps } from "../types"

export async function POST(req: Request, ctx: ChannelPageProps) {
  const { org, peer, ch } = await ctx.params
  if (!org || !peer || !ch) return Response.json('missing environment')
  const gate = new GatewayPeer(org, peer)
  const res = await gate.approved({ ...await req.json(), channel: ch })
  return Response.json(res)
}