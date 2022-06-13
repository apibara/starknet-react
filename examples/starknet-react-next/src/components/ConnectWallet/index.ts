import dynamic from 'next/dynamic'

/*
 * The connect wallet interface displays the list of StarkNet wallets
 * that the user has installed. This list depends on the browser environment
 * and so Next.js will complain about the server rendered version mismatch
 * the version rendered in the browser.
 *
 * Solve this issue by wrapping the "real" connect wallet component in
 * a dynamic component that is only rendered in the browser.
 */
export const ConnectWallet = dynamic(() => import('./connect'), { ssr: false })
