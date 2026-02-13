export default async function pkgs(path: string) {
  return (await fetch(process.env.NEXT_PUBLIC_URL + '/pkgs', {
    method: 'POST',
    body: JSON.stringify({ path })
  })).json()
}