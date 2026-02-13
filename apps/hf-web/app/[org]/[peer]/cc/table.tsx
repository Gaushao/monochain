import ChaincodesTable from "../../../chaincodes/table"
import PeerInstallButton from "./install/button"
import ChaincodePackageForm from "./pkg/form"

export default async function PeerChaincodesTable(p: Partial<Parameters<typeof ChaincodesTable>[0]>) {
  return <ChaincodesTable mount={chaincode => ({
    ...(p.mount || (d => d))(chaincode),
    packages: () => chaincode.packages.map(pkg => <PeerInstallButton name={pkg} path={`${chaincode.path}/pkgs/${pkg}`} key={pkg} />),
    package: () => <ChaincodePackageForm chaincode={chaincode} />,
  })} />
}