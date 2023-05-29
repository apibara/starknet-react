'use client'

import Link from 'next/link'
import burgerMenu from '../../public/svg/burger-menu-svgrepo-com.svg'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavigationItemProps {
  href: string
  title: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavigationItem = ({ href, title, setIsOpen }: NavigationItemProps) => {
  const pathname = usePathname()

  const isActive =
    href === '/' ? pathname === '/starknet-react' : pathname?.startsWith(`/starknet-react${href}`)

  return (
    <div className="py-1 ">
      <Link
        href={href}
        passHref
        onClick={() => setIsOpen(false)}
        className={`${
          isActive ? 'border-b-2 ' : 'border-b-0'
        } border-cat-peach py-1 transition ease-in-out delay-200  text-cat-text hover: bg-transparent hover: hover:text-cat-peach`}
      >
        {title}
      </Link>
    </div>
  )
}

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOnClick = () => {
    setIsOpen((prevVal) => !prevVal)
  }

  return (
    <div className="py-4 px-8 bg-cat-crust w-full flex justify-between">
      <div className="items center sm:text-center ">
        <Link href="/" passHref className="text-xl font-bold text-cat-text">
          Starknet React
        </Link>
      </div>
      <div className="flex items-center">
        <div
          className={
            isOpen
              ? `absolute top-[40px] w-full left-0 grid grid-cols grid-cols-1 bg-cat-crust p-4 mb-10`
              : `hidden sm:flex gap-4`
          }
        >
          <NavigationItem setIsOpen={setIsOpen} href="/" title="Home" />
          <NavigationItem setIsOpen={setIsOpen} href="/get-started" title="Get Started" />
          <NavigationItem setIsOpen={setIsOpen} href="/hooks" title="Hooks" />
          <NavigationItem setIsOpen={setIsOpen} href="/rsc" title="RSC" />
        </div>

        <div className="sm:hidden">
          <button onClick={handleOnClick}>
            <Image alt="burger-menu.png" src={burgerMenu} height={20} width={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
