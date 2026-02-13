export default async function peers(org: string): Promise<string[]> {
  return (await fetch(`${process.env.NEXT_PUBLIC_URL}/${org}/peers`)).json()
}