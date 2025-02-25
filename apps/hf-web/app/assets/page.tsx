import { GatewayApi } from "../../gateway"
import CreateAssetForm from "./create/form"

const api = new GatewayApi()

export default async function AssetsPage() {
  return <>
    <h1>assets</h1>
    <CreateAssetForm />
    <br />
    {(await api.getAssets()).map(asset => JSON.stringify(asset))}
  </>
}
