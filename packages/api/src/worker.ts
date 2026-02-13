

export type Ctx<P> = { params: Promise<P> }

export type ServiceFc<P> = (req: Request, ctx: Ctx<P>) => Promise<unknown>

export default class WorkerAPI<Params extends Record<string, string>> {
  constructor(service: ServiceFc<Params>, fallback: unknown = null) {
    return async (req: Request, ctx: Ctx<Params>) => {
      try {
        return Response.json(await service(req, ctx))
      } catch (e) {
        console.log("🚀 ~ WorkerAPI ~ err:", e)
        return Response.json(fallback, { status: 500 })
      }
    }
  }
}
