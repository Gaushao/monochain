import { GatewayCA } from "../../gateway"

export type CredentialsPayload = { name: string; secret: string }

export type NextPageProps<P> = { params: Promise<P> }

export type OrganizationRouteParams = { org?: string }

export type OrganizationPageProps<P = object> = NextPageProps<OrganizationRouteParams & P>

export interface OrganizationRouteFc {
  (req: Request, ctx: OrganizationPageProps): Promise<Response>
}

export interface OrganizationServiceFc {
  (pay: CredentialsPayload, ca: GatewayCA): Promise<{
    stdout: string
    stderr: string
  }>
}
