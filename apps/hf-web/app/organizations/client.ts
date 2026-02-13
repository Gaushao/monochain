export default async function organizations(): Promise<string[]> {
  return (await fetch(process.env.NEXT_PUBLIC_URL + '/organizations')).json()
}