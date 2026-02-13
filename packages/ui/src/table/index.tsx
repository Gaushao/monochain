type TableData = Record<string, unknown>[]

const buildColumns = (data: TableData) => new Array(...data.reduce((a, c) => {
  Object.keys(c).forEach(k => a.add(k as keyof typeof data[number]))
  return a
}, new Set<keyof typeof data[number]>()))

const parseCell = (d: TableData[number][string]) => {
  if (typeof d === 'string') return d
  if (typeof d === 'function') return d()
  return JSON.stringify(d, null, 2)
}

export function Table({ id = 'table', data = [], columns = buildColumns(data) }: {
  id?: string
  data?: Record<string, unknown>[]
  columns?: string[]
}) {
  return <table>
    <thead><tr>{columns.map(k => <th key={`${id}-th-${k}`}>{k}</th>)}</tr></thead>
    <tbody>{data.map((d, i) => <tr key={`${id}-tr-${i}`}>
      {columns.map(v => <td key={`${id}-tr-td-${v}`}>{parseCell(d[v])}</td>)}
    </tr>)}</tbody>
  </table>
}

export type TableProps = Parameters<typeof Table>[0]
