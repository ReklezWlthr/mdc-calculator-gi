import Link from 'next/link'

export const NavBar = () => {
  return (
    <div className="flex items-center w-full gap-10 px-5 py-4 font-bold text-white bg-primary">
      <Link href="/" className="flex items-center text-3xl">
        MD<span className="text-base text-desc">✦</span>C Calculator
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/genshin">Genshin Impact</Link>
        <Link href="/hsr">Honkai: Star Rail</Link>
        <Link href="/wuwa">Wuthering Waves</Link>
      </div>
    </div>
  )
}
