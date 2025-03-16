import { CertAuthSDK } from "../../gateway"

const ca = new CertAuthSDK()

export default async function UsersPage() {
  return <div>
    <style>
      {`
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid white;
        padding: 8px;
        text-align: left;
      }
      th {
      }
    `}
    </style>
    <h2>Registered Users</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Affiliation</th>
          <th>Attributes</th>
        </tr>
      </thead>
      <tbody>
        {(await ca.identities).map((user, index) => (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.type}</td>
            <td>{user.affiliation}</td>
            <td>
              <table>
                <thead>
                  <tr>
                    <th>Attribute Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {user.attributes.map((attr, i) => (
                    <tr key={i}>
                      <td>{attr.name}</td>
                      <td>{attr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}
