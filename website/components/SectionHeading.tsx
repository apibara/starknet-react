interface SectionHeadingProps {
  children: React.ReactNode
}

const SectionHeading = ({ children }: SectionHeadingProps) => {
  return <div className="mb-4 text-4xl text-center text-cat-text">{children}</div>
}

export default SectionHeading
