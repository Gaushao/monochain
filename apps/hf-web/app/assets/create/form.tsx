'use client'
import { Form, Inputs, SubmitButton } from "@repo/ui"

const { TextInput, NumberInput } = Inputs

type Asset = {
  id: string; color: string; size: string; owner: string; appraisedValue: string
}

export default function CreateAssetForm() {
  return <Form<Asset> submit={f => fetch('assets/create', {
    method: 'POST', body: JSON.stringify(f)
  }).then(() => window.location.reload())}>
    <TextInput name='id' />
    <TextInput name='color' />
    <NumberInput name='size' />
    <TextInput name='owner' />
    <NumberInput name='appraisedValue' />
    <SubmitButton>create</SubmitButton>
  </Form>
}
