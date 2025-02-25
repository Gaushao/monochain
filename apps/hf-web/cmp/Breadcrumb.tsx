'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const HOME_CRUMB = { label: 'home', href: '/' }

export default function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  if (!segments.length) return <nav />
  const breadcrumbs = [HOME_CRUMB, ...segments.map((segment, index) => ({
    label: segment.replace(/-/g, ' '), href: `/${segments.slice(0, index + 1).join('/')}`
  }))]
  return <nav>
    <ol style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
      {breadcrumbs.map((breadcrumb, index) => <li key={breadcrumb.href}>{
        index === breadcrumbs.length - 1
          ? breadcrumb.label
          : <>
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            &nbsp;{'>'}&nbsp;
          </>
      }</li>)}
    </ol>
  </nav>

}