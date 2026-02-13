export default class ClientAPI {
  pathname = ''

  constructor(pathname = this.pathname) {
    this.pathname = pathname
  }

  static url = (p: string) => `${process.env.NEXT_PUBLIC_URL}/${p}`

  fetch = async (...f: Parameters<typeof fetch>) => (await fetch(...f)).json()

  get GET() { return this.fetch(ClientAPI.url(this.pathname)) }

  POST = <P>(payload: P) => this.fetch(this.pathname, {
    method: 'POST', body: JSON.stringify(payload)
  })

}