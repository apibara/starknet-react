interface TabContentProps {
  isActive: boolean;
  children: React.ReactNode;
}

const TabContent = ({ isActive, children }: TabContentProps) => {
  if (!isActive) return null;

  return <div className="p-4 rounded-bl-lg rounded-br-lg">{children}</div>;
};
export default TabContent;
