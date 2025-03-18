import { OrganizationRoute } from "../../router"

export const POST = new OrganizationRoute(({ name, secret }, ca) => ca.enroll(name, secret))
