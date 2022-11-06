type ObjectField<T, K extends keyof any> = {
  [P in K]: Fields<T>
}

type Field<T> = {
  [K in keyof T]: T[K] extends object ? ObjectField<T[K], K> : K
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
