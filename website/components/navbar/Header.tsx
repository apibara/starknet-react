'use client'

import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'

interface NavigationItemProps {
  href: string
  title: string
}

const NavigationItem = ({ href, title }: NavigationItemProps) => {
  const pathname = usePathname()

  const isActive =
    href === '/' ? pathname === '/starknet-react' : pathname?.startsWith(`/starknet-react/${href}`)

  return (
    <div className={`${isActive ? 'border-b-2 ' : 'border-b-0'} border-cat-peach py-1`}>
      <Link
        href={href}
        passHref
        className="transition ease-in-out delay-200  text-cat-text hover: bg-transparent hover: hover:text-cat-peach"
      >
        {title}
      </Link>
    </div>
  )
}

const Header = () => {
  return (
    <div className="py-4 px-8 bg-cat-crust w-full flex justify-between">
      <div className="items center">
        <Link href="/home" passHref className="text-xl font-bold text-cat-text">
          Starknet React
        </Link>
      </div>
      <div className="flex flex-row gap-4">
        <NavigationItem href="/" title="Home" />
        <NavigationItem href="/get-started" title="Get Started" />
        <NavigationItem href="/hooks" title="Hooks" />
      </div>
    </div>
  )
}

export default Header
