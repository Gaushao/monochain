import { OrganizationPageProps } from "../types"

export type PeerPageProps<P = object> = OrganizationPageProps<{ peer?: string } & P>
