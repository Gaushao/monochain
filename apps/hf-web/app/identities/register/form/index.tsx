import { Inputs, SubmitButton } from "@repo/ui"
import RegisterIdentityFormCtx from "./ctx"

const { TextInput } = Inputs

export default function RegisterIdentityForm() {
  return <RegisterIdentityFormCtx>
    <TextInput name='name' />
    <TextInput name='secret' />
    <SubmitButton>register</SubmitButton>
  </RegisterIdentityFormCtx>
}
