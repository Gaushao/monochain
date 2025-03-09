import { mychannelBasicApi } from "../../../gateway"

type Asset = {
  id: string; color: string; size: string; owner: string; appraisedValue: string
}

export async function POST(req: Request) {
  try {
    const asset: Asset = await req.json()
    await mychannelBasicApi.createAsset(
      asset.id,
      asset.color,
      asset.size,
      asset.owner,
      asset.appraisedValue
    )
    return Response.json({ created: asset })
  } catch (error) {
    return Response.json(error)
  }
}
