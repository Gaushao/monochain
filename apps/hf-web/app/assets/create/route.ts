import { GatewayApi } from "../../../gateway"

const api = new GatewayApi()

type Asset = {
  id: string; color: string; size: string; owner: string; appraisedValue: string
}

export async function POST(req: Request) {
  try {
    const asset: Asset = await req.json()
    await api.createAsset(asset.id, asset.color, asset.size, asset.owner, asset.appraisedValue)
    return Response.json({ created: asset })
  } catch (error) {
    return Response.json(error)
  }
}
