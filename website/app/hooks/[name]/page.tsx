import { getAllHooks } from '../../../lib/typedoc'
import Hooks from '../../../components/Hooks'

interface IParams {
  name: string
}

export default function Page({ params }: { params: IParams }) {
  const { name } = params

  const hook = getAllHooks().find((hook) => hook.name === name)

  return <Hooks hook={hook} />
}

export async function generateStaticParams() {
  const hooks = getAllHooks()
  return hooks.map(({ name }) => ({ name }))
}
