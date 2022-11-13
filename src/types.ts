interface ObjectField<T, K extends keyof T> {
  type: T[K]
  value: Array<Field<T>>
  fragment: boolean
}

type KeysOfUnion<T> = T extends T ? keyof T : never

type Field<T> = {
  [K in keyof T]: KeysOfUnion<T> | ObjectField<T, K>
}[keyof T]

export type Fields<T> = Array<Field<T>>

type VariableField<T> = {
  [K in keyof T]: T[K] | VariableFieldObject<T[K]>
}

interface VariableFieldObject<T> {
  type: string // GraphQL type
  require?: boolean // Is required put a ! after the type
  value: VariableField<T>
}

export type Variables<T> = {
  [K in keyof T]: T[K] | VariableFieldObject<T[K]>
}
