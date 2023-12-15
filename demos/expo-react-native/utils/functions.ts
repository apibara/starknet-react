export const truncateAddress = (address: string, chars = 6) => {
  const start = address.substring(0, chars)
  const end = address.substring(address.length - chars, address.length)
  return `${start}...${end}`
}