import { graphql } from '../builder'
import OperationType from '../operationType'
import { Todo, QueryTodoArgs, MutationCreateTodoArgs } from './_data_/dataTypes'

describe('test query', () => {
  it('should return a query', () => {
    const query = graphql<Todo>({
      name: 'todos',
      fields: [
        'id',
        'name',
        'complete'
      ]
    })

    expect(query).toBe('query { todos { id name complete } }')
  })

  it('should return a query with variables', () => {
    const query = graphql<Todo, QueryTodoArgs>({
      name: 'todos',
      fields: [
        'id',
        'name',
        'complete'
      ],
      variables: {
        todoId: {
          type: 'ID',
          value: '1',
          require: true
        }
      }
    })

    expect(query).toBe('query ($todoId: ID!) { todos (todoId: $todoId) { id name complete } } \n\n { "todoId": 1 }')
  })

  it('should return a mutation with variables', () => {
    const query = graphql<Todo, MutationCreateTodoArgs>({
      operation: OperationType.Mutation,
      name: 'createTodo',
      fields: [
        'id',
        'name',
        'complete'
      ],
      variables: {
        input: {
          type: 'TodoInput',
          require: true,
          value: {
            complete: false,
            name: 'test',
            todoId: '123'
          }
        }
      }
    })

    expect(query).toBe('mutation ($input: TodoInput!) { createTodo (input: $input) { id name complete } } \n\n { "input": { "complete": false, "name": "test", "todoId": "123" } }')
  })
})
