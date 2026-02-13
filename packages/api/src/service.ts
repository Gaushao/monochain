

export type ServiceCtx<P> = { params: Promise<P> }

export default class ServiceAPI<Params extends Record<string, unknown>> {

  constructor(service: (...p: unknown[]) => Promise<unknown>, fallback = null, params: string[] = []) {
    return async (req: Request, ctx: ServiceCtx<Params>) => {
      const p = await ctx.params
      const args = params.map(k => p[k])
      try {
        return Response.json(service(await req.json(), ...args))
      } catch (e) {
        if (params.length != args.length) return Response.json(fallback, { status: 400 })
        return Response.json(fallback, { status: 500, statusText: e as string })
      }
    }
  }
}
