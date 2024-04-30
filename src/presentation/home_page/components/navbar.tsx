import Link from 'next/link'

export const NavBar = () => {
  return (
    <div className="bg-primary w-full text-white px-5 py-4 font-bold flex items-center gap-10">
      <Link href="/" className="text-3xl">
        HoYoverse Calculator
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/genshin">Genshin Impact</Link>
        <Link href="/hsr">Honkai: Star Rail</Link>
      </div>
    </div>
  )
}
