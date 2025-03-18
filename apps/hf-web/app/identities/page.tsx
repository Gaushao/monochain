import { CertAuthCLI } from "../../gateway"
import EnrollIdentityForm from "./enroll/form"
import RegisterIdentityForm from "./register/form"
import RevokeIdentityButton from "./revoke/button"

const ca = new CertAuthCLI()

export default async function IdentitiesPage() {
  return <div>
    <h2>Register New Identity</h2>
    <RegisterIdentityForm />
    <br />
    <style>{`
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
    `}</style>
    <h2>Registered Identities</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Affiliation</th>
          <th>Attributes</th>
          <th>Revoke</th>
        </tr>
      </thead>
      <tbody>
        {(await ca.identities).map((identity, index) => <tr key={index}>
          <td>{identity.name}</td>
          <td>{identity.type}</td>
          <td>{identity.affiliation}</td>
          <td>
            <table>
              <thead>
                <tr>
                  <th>Attribute Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {identity.attributes.map((attr, i) => (
                  <tr key={i}>
                    <td>{attr.name}</td>
                    <td>{attr.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          <td>
            <EnrollIdentityForm name={identity.name} />
            <RevokeIdentityButton name={identity.name} />
          </td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
