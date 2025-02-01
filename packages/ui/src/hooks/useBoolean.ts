"use client"

import { useState } from 'react'

export const EMPTY_USE_BOOLEAN = {
  bool: false,
  toggle: () => { },
  truly: () => { },
  falsy: () => { }
}

export function useBoolean(init = false) {
  const [bool, setter] = useState(init)
  return {
    bool,
    toggle: () => {
      setter(b => !b)
    },
    truly: () => {
      setter(true)
    },
    falsy: () => {
      setter(false)
    }
  }
}
