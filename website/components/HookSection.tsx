interface SectionProps {
  children: React.ReactNode
}

const HookSection = ({ children }: SectionProps) => {
  return <div className="max-w-2xl ms-auto me-auto mt-12">{children}</div>
}

export default HookSection
