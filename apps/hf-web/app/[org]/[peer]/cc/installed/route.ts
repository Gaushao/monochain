import { WorkerAPI } from "@repo/api"
import { GatewayPeer } from "@repo/gateway"

export const GET = new WorkerAPI(async (req, ctx) => {
  const { org, peer } = await ctx.params
  const { stdout } = await new GatewayPeer(org, peer).installed
  return JSON.parse(stdout)['installed_chaincodes'] || []
}, [])