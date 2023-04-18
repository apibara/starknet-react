export type PackageManager = 'npm' | 'yarn' | 'pnpm'

export function getPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent

  if (userAgent) {
    if (userAgent.includes('yarn')) {
      return 'yarn'
    } else if (userAgent.includes('pnpm')) {
      return 'pnpm'
    }
  }
  return 'npm'
}
