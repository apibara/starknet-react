'use client'

interface TabProps {
  label: string
  isActive: boolean
  onClick: () => void
}

const Tab = ({ label, isActive, onClick }: TabProps) => {
  return (
    <button
      className={`py-2 px-4 ${
        isActive ? ' bg-cat-neutral rounded-full text-cat-neutral700' : 'bg-blue-500'
      } text-cat-text `}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Tab
