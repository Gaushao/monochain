import { GatewayCA } from "../../gateway"

export type CredentialsPayload = { name: string; secret: string }

export type OrganizationPageProps = { params: Promise<{ org?: string }> }

export interface OrganizationRouteFc {
  (req: Request, ctx: OrganizationPageProps): Promise<Response>
}

export interface OrganizationServiceFc {
  (pay: CredentialsPayload, ca: GatewayCA): Promise<{
    stdout: string
    stderr: string
  }>
}
