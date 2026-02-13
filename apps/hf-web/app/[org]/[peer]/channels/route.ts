import { GatewayPeer } from "../../../../gateway"
import { PeerPageProps } from "../types"

export async function GET(req: Request, ctx: PeerPageProps) {
  const { org, peer } = await ctx.params
  return Response.json(await new GatewayPeer(org, peer).channels)
}