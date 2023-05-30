'use client'
import HookSection from './HookSection'
import SectionHeading from '../components/SectionHeading'
import { Hook } from '../components/Hook'

export default function Hooks({ hook }: { hook: any }) {
  return (
    <div className=" min-h-screen mx-4 lg:mx-0 flex-col items-center text-cat-text my-0 pt-12 mb-20">
      <div className=" text-center sm:text-4xl md:text-5xl lg:text-6xl md:text-center lg:text-center text-2xl  sm:text-center">
        {hook?.name}
      </div>
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
