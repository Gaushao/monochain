
export default async function install(org?: string, peer?: string, path?: string) {
  return (await fetch(`/${org}/${peer}/cc/install`, {
    method: 'POST',
    body: JSON.stringify({ path })
  })).json()
}