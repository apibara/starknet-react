import { RenderOptions, RenderHookOptions, queries, Queries } from '@testing-library/react'
import { ReactElement } from 'react'
import { ProviderInterface } from 'starknet'
import { Connector } from '~/connectors'
interface StarkNetRenderOptions {
  connectors?: Connector[]
  defaultProvider?: ProviderInterface
}
declare const customRender: (
  el: ReactElement,
  options?: StarkNetRenderOptions & Omit<RenderOptions, 'wrapper'>
) => import('@testing-library/react').RenderResult<typeof queries, HTMLElement, HTMLElement>
declare function customRenderHook<
  Props,
  Result,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  render: (initialProps: Props) => Result,
  options?: StarkNetRenderOptions &
    Omit<RenderHookOptions<Props, Q, Container, BaseElement>, 'wrapper'>
): import('@testing-library/react').RenderHookResult<Result, Props>
export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook }
