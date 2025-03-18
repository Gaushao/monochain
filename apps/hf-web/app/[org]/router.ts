import { GatewayCA } from "../../gateway"
import { CredentialsPayload, OrganizationRouteFc, OrganizationServiceFc } from "./types"

export class OrganizationRoute {
  constructor(service: OrganizationServiceFc) {
    return (async (req, ctx) => Response.json(await service(
      (await req.json() as CredentialsPayload),
      new GatewayCA((await ctx?.params)?.org || undefined)
    ))) as OrganizationRouteFc
  }
}