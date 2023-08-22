import { Button } from '@/components/ui/button'

interface TabProps {
  label: string
  isActive: boolean
  onClick: () => void
}

const Tab = ({ label, isActive, onClick }: TabProps) => {
  return (
    <Button
      className={`py-2 px-4 ${
        isActive ? ' bg-cat-neutral rounded-full text-cat-neutral700' : 'bg-cat-base'
      } text-cat-text `}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export default Tab
