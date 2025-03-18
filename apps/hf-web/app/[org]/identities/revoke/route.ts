import { OrganizationRoute } from "../../router"

export const POST = new OrganizationRoute(({ name }, ca) => ca.revoke(name))
