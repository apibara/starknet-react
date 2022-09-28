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

export interface BaseType {
  name: string
  comment: {
    summary: TextLike[]
  }
}

export interface Property {
  name: string
  flags: {
    isOptional: boolean
  }
  comment: {
    summary: TextLike[]
  }
  type: {
    type: 'reference' | 'intrinsic'
    package?: string
    name: string
  }
}

export interface InterfaceType extends BaseType {
  properties: Property[]
}

export type ValueType = InterfaceType
export type PropsType = ValueType

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

export function hookValue(hook: Function): ValueType[] {
  const typ = hook.signatures[0]?.type
  if (!typ) return []
  const root = resolveType(typ.id)
  if (!root) return []
  return [root]
}

export function hookProps(hook: Function): PropsType[] {
  const param = hook.signatures[0]?.parameters?.[0]
  if (!param) return []
  if (param.type.type !== 'reference') {
    throw new Error('type parameter is not a reference')
  }
  const root = resolveType(param.type.id)
  if (!root) return []
  return [root]
}

export function resolveType(id: number): PropsType | undefined {
  const root = core.children.find((child) => child.id === id)
  if (!root || !root.comment) return undefined

  switch (root.kindString) {
    case 'Interface': {
      const properties = (root.children ?? []).map((ch) => {
        if (ch.kindString !== 'Property') {
          throw new Error(`unknown interface child ${ch.type}`)
        }
        return ch as Property
      })
      return {
        name: root.name,
        comment: {
          summary: root.comment.summary,
        },
        properties,
      }
    }
    default: {
      throw new Error(`unknown type ${root.kindString}`)
    }
  }
}

export function getAllHooks() {
  return core.children.filter(
    (child) => child.kindString === 'Function' && child.name.startsWith('use')
  )
}
