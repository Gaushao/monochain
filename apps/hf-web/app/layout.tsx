import type { Metadata } from "next"
import localFont from "next/font/local"
import Breadcrumb from "../cmp/Breadcrumb"
import Link from "next/link"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <header>
        <Link href='/assets'>assets</Link>
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
