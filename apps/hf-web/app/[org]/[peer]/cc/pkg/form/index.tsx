import { Inputs, SubmitButton } from "@repo/ui"
import ChaincodeDeployFormCtx from "./ctx"
import { ChaincodePkgProps } from "../types"

const { TextInput } = Inputs

export default function ChaincodePackageForm({ chaincode }: ChaincodePkgProps) {
  return <ChaincodeDeployFormCtx chaincode={chaincode}>
    <TextInput name='name' />
    <SubmitButton>submit</SubmitButton>
  </ChaincodeDeployFormCtx>
}
