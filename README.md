# GraphQL Query Builder

A simple helper function to generate GraphQL queries using plain JavaScript Objects.

But the cool part is it's have types :tada:

How to use
----------

``` typescript
const query = graphql<Todo>({
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
