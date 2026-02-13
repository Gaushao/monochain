export default async function chaincodes(): Promise<{
  name: string
  language: string
  path: string
  packages: string[]
}[]> {
  return (await fetch(process.env.NEXT_PUBLIC_URL + '/chaincodes')).json()
}