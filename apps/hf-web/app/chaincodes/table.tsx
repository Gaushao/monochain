import { Table, TableProps } from "@repo/ui"
import chaincodes from "./client"

type ChaincodeData = Awaited<ReturnType<typeof chaincodes>>[number]

export default async function ChaincodesTable(p: TableProps & {
  mount: (cc: ChaincodeData) => Record<string, unknown>
}) {
  return <Table {...p} data={(await chaincodes()).map(p.mount)} />
}
