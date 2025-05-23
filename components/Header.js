import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()

  return (
    <header className="flex justify-between items-center max-w-2xl mx-auto p-8 md:p-12">
      <Link href="/">
        <h1 className="font-bold">claude code woz ere</h1>
      </Link>
      <div className="flex items-center">
        <Link href="/">
          <a className={`mr-6 ${router.pathname == "/" ? "text-black" : "text-gray-600"}`}>Home</a>
        </Link>
        <Link href="/about">
          <a className={`mr-6 ${router.pathname == "/about" ? "text-black" : "text-gray-600"}`}>About</a>
        </Link>
        <Link href="/projects">
          <a className={`${router.pathname == "/projects" ? "text-black" : "text-gray-600"}`}>Projects</a>
        </Link>
      </div>
    </header>
  )
}
