import { PeerPageProps } from "../types"

export type ChannelPageProps<P = object> = PeerPageProps<{ ch?: string } & P>
