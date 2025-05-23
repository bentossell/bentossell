import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          claude code woz ere
        </h1>
      </Link>
      <a
        href="https://www.bentossell.com/"
        target="_blank"
        rel="noreferrer"
      >
        <button
          className="bg-black text-white px-4 py-2 border-none rounded-full text-base font-medium flex items-center space-x-2"
        >
          <p>Read my blog</p>
        </button>
      </a>
    </header>
  )
}