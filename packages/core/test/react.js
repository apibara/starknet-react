'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p)
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.renderHook = exports.render = void 0
const jsx_runtime_1 = require('react/jsx-runtime')
const react_1 = require('@testing-library/react')
const src_1 = require('../src')
const devnet_1 = require('./devnet')
const wrapper =
  (options) =>
  ({ children }) =>
    (0, jsx_runtime_1.jsx)(src_1.StarknetConfig, {
      defaultProvider: options?.defaultProvider ?? devnet_1.devnetProvider,
      connectors: options?.connectors ?? [],
      children: children,
    })
const customRender = (el, options) =>
  (0, react_1.render)(el, { wrapper: wrapper(options), ...options })
exports.render = customRender
function customRenderHook(render, options) {
  return (0, react_1.renderHook)(render, {
    wrapper: wrapper(options),
    ...options,
  })
}
exports.renderHook = customRenderHook
__exportStar(require('@testing-library/react'), exports)
//# sourceMappingURL=react.js.map
