import { mychannelBasicApi } from "../../gateway"
import CreateAssetForm from "./create/form"

export default async function AssetsPage() {
  return <>
    <h1>assets</h1>
    <CreateAssetForm />
    <br />
    {(await mychannelBasicApi.getAssets()).map(asset => <div key={asset.ID}>{JSON.stringify(asset)}</div>)}
  </>
}
