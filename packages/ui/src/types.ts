export type ServerSidePageComponentProps<P = object, S = object> = {
  params: Promise<P>
  searchParams: Promise<S>
}