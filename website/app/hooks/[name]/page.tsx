import Hooks from "@/components/Hooks";
import { getAllHooks } from "@/lib/typedoc";

interface IParams {
  name: string;
}

export default function Page({ params }: { params: IParams }) {
  const { name } = params;

  const hook = getAllHooks().find((hook) => hook.name === name);

  return <Hooks hook={hook} />;
}

export async function generateStaticParams() {
  const hooks = getAllHooks();
  return hooks.map(({ name }) => ({ name }));
}
