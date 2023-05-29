import { deprecationTag, getAllHooks } from '../../lib/typedoc'
import HookItem from '../../components/HookItem'
import HookSummary from '../../components/HookSummary'

const ApiPage = () => {
  const hooks = getAllHooks()

  return (
    <div className="mt-8 pt-10 text-center text-cat-text ">
      <div className="text-6xl">Hooks reference</div>
      <div className="text-xl text-cat-peach mt-6">Hooks reference and examples</div>
      <div className="flex flex-col content-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-4 lg:mx-0  mt-20 mb-40 gap-6">
          {hooks.map((hook) => (
            <HookItem
              key={hook.name}
              name={hook.name}
              description={<HookSummary hook={hook} />}
              href={`/hooks/${hook.name}`}
              isDeprecated={deprecationTag(hook) !== undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApiPage
