'use client'

import { PropsWithChildren } from "react"
import { Form } from "@repo/ui"
import { usePackageClient } from "../hook"
import { ChaincodePkgProps } from "../types"

export default function ChaincodePackageFormCtx({ children, chaincode }: PropsWithChildren<ChaincodePkgProps>) {
  const deploy = usePackageClient()
  return <Form submit={f => {
    deploy({ ...chaincode, ...f }).then(console.log).catch(console.error)
  }}>
    {children}
  </Form>
}
