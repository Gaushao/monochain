import { GatewayPeer } from "@repo/gateway"
import { WorkerAPI } from "@repo/api"

export const POST = new WorkerAPI(async (req, ctx) => {
  const { org, peer, ch } = await ctx.params
  if (!org || !peer || !ch) return Response.json('missing environment')
  return new GatewayPeer(org, peer).approve({ ...await req.json(), channel: ch })
}, [])