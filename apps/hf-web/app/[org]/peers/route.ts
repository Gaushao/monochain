import { OrganizationGateway } from "../../../gateway"
import { OrganizationPageProps } from "../types"

export async function GET(req: Request, ctx: OrganizationPageProps) {
  const org = (await ctx?.params)?.org
  if (!org) return Response.json({ message: "No org provided" })
  return Response.json(await new OrganizationGateway(org).peers)
}