import { Fields, Variables } from './types'
import OperationType from './operationType'

interface QueryReturn<T, V> {
  operation?: OperationType
  name: string
  fields: Fields<T>
  variables?: Variables<V>
}

/*
parseFields will parse the fields of the query and return a string with only the field names
like this (for a TODO type): "id, name, complete"
*/
function parseFields (fields: any[]): string {
  const query: string[] = []

  for (const field of fields) {
    if (isString(field)) {
      query.push(field)
      continue
    }

    // It's a field object with type and value and fragment properties
    if (isFieldObject(field)) {
      const fragment = field.fragment as boolean
      if (fragment) {
        query.push(`...on ${field.type as string} { ${parseFields(field.value)} }`)
        continue
      }

      // It's not a fragment, so we just need to parse the value
      query.push(parseFields(field.value))
    }
  }

  return query.join(' ')
}

/*
query ($email: String!, $password: String!) {
  userLogin (email: $email, password: $password) {
    userId, token
  }
}
*/
function parseHeader (operation: OperationType, name: string, variables?: any): string {
  let query = ''

  query += `${operation ?? OperationType.Query}`

  if (variables == null) {
    query += ` { ${name} { `

    return query
  }

  const opVariables: string[] = []
  const inVariables: string[] = []
  for (const key in variables) {
    const value = variables[key]
    inVariables.push(`${key}: $${key}`)

    if (typeof (value) !== 'object') {
      const t = getVariableType(value)

      opVariables.push(`$${key}: ${t}`)
      continue
    }

    const r = value?.require !== undefined ? '!' : ''
    const t = value.type
    opVariables.push(`$${key}: ${t as string}${r as string}`)
  }

  query += ` (${opVariables.join(', ')}) `
  query += `{ ${name} (${inVariables.join(', ')}) { `

  return query
}

function parseVariables (variables: any): string {
  const query: string[] = []

  for (const key in variables) {
    const value = variables[key]

    if (typeof (value) !== 'object') {
      // If the value is a primitive type
      let v = `${value as string}`
      if (isString(value)) {
        v = `"${v}"`
      }

      query.push(`"${key}": ${v}`)

      continue
    }

    // If the value is not a VariableFieldObject
    // then it is a object with fields
    if (!isVariableFieldObject(value)) {
      query.push(`"${key}": { ${parseVariables(value)} }`)
      continue
    }

    // If the value of the value is a object
    if (typeof (value.value) === 'object') {
      query.push(`"${key}": { ${parseVariables(value.value)} }`)
      continue
    }

    let v = `${value.value as string}`
    if (isString(value)) {
      v = `"${v}"`
    }

    // the value of the value is a primitive type
    query.push(`"${key}": ${v}`)
  }

  return query.join(', ')
}

function getVariableType (variable: any): string {
  let type = 'String'

  switch (typeof variable) {
    case 'boolean':
      type = 'Boolean'
      break

    case 'number':
      type = variable % 1 === 0 ? 'Int' : 'Float'
      break
  }

  return type
}

function isString (v: any): boolean {
  return typeof (v) === 'string'
}

function isVariableFieldObject (obj: any): boolean {
  const v = Object.prototype.hasOwnProperty.call(obj, 'type') && Object.prototype.hasOwnProperty.call(obj, 'value')
  return v || (v && Object.prototype.hasOwnProperty.call(obj, 'require'))
}

function isFieldObject (obj: any): boolean {
  const v = Object.prototype.hasOwnProperty.call(obj, 'type') && Object.prototype.hasOwnProperty.call(obj, 'value')
  return v || (v && Object.prototype.hasOwnProperty.call(obj, 'fragment'))
}

interface parseOptions {
  operation?: OperationType
  name: string
  fields: any[]
  variables?: any
}

function parse (options: parseOptions): string {
  let query = ''

  query += parseHeader(options.operation ?? OperationType.Query, options.name, options.variables)

  const returnFields = parseFields(options.fields)

  query += `${returnFields}`

  query += ' } }'

  return query
}

// graphql receives two generic types, one for the fields and one for the variables.
// It's not necessary to pass the variables if you don't have any.
// Will an array with tow elements, the first is the query and the second is the variables
export function graphql<T, V = {}> (obj: QueryReturn<T, V>): [string, string] {
  let query = ''
  let variables = ''

  query = parse(obj)

  if (obj.variables != null) {
    variables = parseVariables(obj.variables)

    variables = `{ ${variables} }`
  }

  return [query, variables]
}
