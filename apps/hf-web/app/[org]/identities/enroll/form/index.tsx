import { Inputs, SubmitButton } from "@repo/ui"
import EnrollIdentityFormCtx from "./ctx"

const { TextInput } = Inputs

export default function EnrollIdentityForm({ name }: { name: string }) {
  return <EnrollIdentityFormCtx name={name}>
    <TextInput name='secret' />
    <SubmitButton>enroll</SubmitButton>
  </EnrollIdentityFormCtx>
}
