# GraphQL Query Builder

A simple helper function to generate GraphQL queries using plain JavaScript Objects.

But the cool part is it's have types :tada:

<a href="https://www.npmjs.com/package/gql-typed-query-builder">
  <img src="https://img.shields.io/npm/dt/gql-typed-query-builder?label=Downloads" alt="downloads" />
</a>

## Install

`npm install gql-typed-query-builder --save` or `yarn add gql-typed-query-builder`

How to use
----------

``` typescript
import graphql from 'gql-typed-query-builder'

const [query] = graphql<Todo>({
  name: 'todos',
  fields: [
    'id',
    'name',
    'complete'
  ]
})

console.log(query)
"query { todos { id name complete } }"
```


More examples: [Tests](https://github.com/claudioluciano/gql-typed-query-builder/blob/main/src/tests/intex.test.ts)


Ohh it's based on https://github.com/atulmy/gql-query-builder
