import { readdirSync } from "fs"

export async function POST(req: Request) {
  const { path: p } = await req.json() as { path: string }
  try {
    return Response.json(readdirSync(p + '/pkgs'))
  } catch (error) {
    return Response.json([])
  }
}