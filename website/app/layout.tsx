import { Metadata } from 'next'
import ClientOnly from '../components/ClientOnly'
import Header from '../components/navbar/Header'
import StarknetProvider from './providers/StarknetProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hooks Reference - Starknet React ',
  description: 'Welcome to Starknet react',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-100 flex flex-col">
        <StarknetProvider>
          <ClientOnly>
            <Header />
          </ClientOnly>
          <div className="grow bg-cat-base">{children}</div>
        </StarknetProvider>
      </body>
    </html>
  )
}
