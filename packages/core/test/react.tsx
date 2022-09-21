import {
  renderHook,
  render,
  RenderOptions,
  RenderHookOptions,
  queries,
  Queries,
} from '@testing-library/react'
import React, { ReactElement } from 'react'
import { ProviderInterface } from 'starknet'
import { Connector } from '~/connectors'
import { StarknetConfig } from '../src'
import { devnetProvider } from './devnet'

interface StarkNetRenderOptions {
  connectors?: Connector[]
  defaultProvider?: ProviderInterface
}

const wrapper =
  (options?: StarkNetRenderOptions) =>
  ({ children }: { children: React.ReactNode }) =>
    (
      <StarknetConfig
        defaultProvider={options?.defaultProvider ?? devnetProvider}
        connectors={options?.connectors ?? []}
      >
        {children}
      </StarknetConfig>
    )

const customRender = (
  el: ReactElement,
  options?: StarkNetRenderOptions & Omit<RenderOptions, 'wrapper'>
) => render(el, { wrapper: wrapper(options), ...options })

function customRenderHook<
  Props,
  Result,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  render: (initialProps: Props) => Result,
  options?: StarkNetRenderOptions &
    Omit<RenderHookOptions<Props, Q, Container, BaseElement>, 'wrapper'>
) {
  return renderHook(render, {
    wrapper: wrapper(options),
    ...options,
  })
}

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook }
