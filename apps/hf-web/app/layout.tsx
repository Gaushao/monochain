/* eslint-disable turbo/no-undeclared-env-vars */
import type { Metadata } from "next"
import localFont from "next/font/local"
import Link from "next/link"
import Breadcrumb from "../cmp/Breadcrumb"
import OrganizationSelect from "./[org]/select"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "HF Web",
  description: "hyperledger fabric gateway web app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <header>
        <OrganizationSelect options={await (await fetch(process.env.__NEXT_PRIVATE_ORIGIN + '/organizations')).json()} />
      </header>
      <Breadcrumb />
      <main>
        {children}
      </main>
      <footer>
        <Link href='https://github.com/Gaushao/monochain'>git</Link>
      </footer>
    </body>
  </html>
}
