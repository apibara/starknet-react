interface TabContentProps {
  isActive: boolean
  children: React.ReactNode
}

const TabContent = ({ isActive, children }: TabContentProps) => {
  if (!isActive) return null

  return <div className="p-4 bg-white rounded-bl-lg rounded-br-lg">{children}</div>
}
export default TabContent
