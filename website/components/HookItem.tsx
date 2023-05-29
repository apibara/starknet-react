import Link from 'next/link'

interface HookItemProps {
  name: string
  description: React.ReactNode
  href: string
  isDeprecated: boolean
}

const HookItem = ({ name, description, href = '/', isDeprecated }: HookItemProps) => {
  return (
    <Link href={href} passHref>
      <div className=" transition ease-in-out delay-200 hover:-translate-y-2 hover:-translate-x-2   border-cat-surface  hover:border-cat-peach">
        <div
          className={`p-3 rounded-t-lg text-start font-bold ${
            isDeprecated ? 'text-cat-text' : 'text-cat-base'
          } border-2 ${isDeprecated ? 'bg-cat-surface' : 'bg-cat-peach'} border-cat-surface ${
            isDeprecated && 'line-through'
          }`}
        >
          {name}
        </div>
        <div className="p-3 rounded-b-lg border-2 border-cat-surface text-start">{description}</div>
      </div>
    </Link>
  )
}

export default HookItem
