'use client'
import HookSection from './HookSection'
import SectionHeading from '../components/SectionHeading'
import { Hook } from '../components/Hook'

export default function Hooks({ hook }: { hook: any }) {
  return (
    <div className=" min-h-screen flex-col items-center text-cat-text  mx-0 my-0 pt-12 mb-20">
      <div className=" text-center text-6xl">{hook?.name}</div>
      <div className=" text-center mt-4 text-cat-peach text-xl ">
        <Hook.Summary hook={hook} />
      </div>
      <Hook.Deprecation hook={hook} />

      <HookSection>
        <Hook.Remarks hook={hook} />
      </HookSection>

      <HookSection>
        <SectionHeading>Examples</SectionHeading>
        <Hook.Example hook={hook} />
      </HookSection>
    </div>
  )
}
