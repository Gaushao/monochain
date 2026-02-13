export default async function channels(org: string, peer: string): Promise<string[]> {
  return (await fetch(`${process.env.NEXT_PUBLIC_URL}/${org}/${peer}/channels`)).json()
}