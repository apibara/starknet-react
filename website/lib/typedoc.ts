import core from '../generated/core.json'

export interface TextLike {
  kind: string
  text: string
}

export interface Signature {
  comment: {
    summary: TextLike[]
    blockTags: {
      tag: string
      content: TextLike[]
    }[]
  }
  type: {
    type: string
    id: number
  }
  parameters: {
    type: {
      type: string
      id: number
    }
  }[]
}

export interface Function {
  name: string
  kindString: 'Function'
  signatures: Signature[]
}

export type Hook = Function

export function isHookDeprecated(hook: Function) {
  const tags = hook.signatures[0]?.comment?.blockTags
  if (!tags) return false
  return tags.find((t) => t.tag === '@deprecated') !== undefined
}

export function getAllHooks() {
  return core.children.filter(
    (child) => child.kindString === 'Function' && child.name.startsWith('use')
  )
}
