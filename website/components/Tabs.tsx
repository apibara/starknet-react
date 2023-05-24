'use client'
import { useState } from 'react'
import Tab from './Tab'
import TabContent from './TabContent'

interface TabsProps {
  isManual: boolean
}

const Tabs = ({ isManual }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>('pnpm')

  const handleTabClick = (tabIndex: string) => {
    setActiveTab(tabIndex)
  }

  return (
    <div className="pt-4 max-w-70">
      <div className="flex">
        <Tab label="pnpm" isActive={activeTab === 'pnpm'} onClick={() => handleTabClick('pnpm')} />
        <Tab label="yarn" isActive={activeTab === 'yarn'} onClick={() => handleTabClick('yarn')} />
        <Tab label="npm" isActive={activeTab === 'npm'} onClick={() => handleTabClick('npm')} />
      </div>
      <TabContent isActive={activeTab === 'pnpm'}>
        <div className="text-cat-text rounded-full">
          {isManual ? 'pnpm create starknet' : 'pnpm add @starknet-react/core'}
        </div>
      </TabContent>
      <TabContent isActive={activeTab === 'yarn'}>
        <div className="text-cat-text rounded-full">
          {isManual ? 'yarn create starknet' : 'yarn add @starknet-react/core'}
        </div>
      </TabContent>
      <TabContent isActive={activeTab === 'npm'}>
        <div className="text-cat-text rounded-full">
          {isManual ? 'npx create starknet' : 'npm add @starknet-react/core'}
        </div>
      </TabContent>
    </div>
  )
}

export default Tabs
