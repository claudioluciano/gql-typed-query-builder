import { graphql } from '../builder'
import OperationType from '../operationType'
import { Todo, QueryTodoArgs, MutationCreateTodoArgs, TodoResult } from './_data_/dataTypes'

describe('test query', () => {
  it('should return a query', () => {
    const [query] = graphql<Todo>({
      name: 'todos',
      fields: [
        'id',
        'name',
        'complete'
      ]
    })

    expect(query).toBe('query { todos { id name complete } }')
  })

  it('should return a query without fragments when fragment is false', () => {
    const [query, variables] = graphql<Todo, QueryTodoArgs>({
      name: 'todo',
      fields: [
        {
          type: 'Todo',
          value: ['id', 'name'],
          fragment: false
        }
      ],
      variables: {
        todoId: '123'
      }
    })

    expect(query).toBe('query ($todoId: String) { todo (todoId: $todoId) { ...on Todo { id name } ...on TodoNotFoundError { message } } }')
    expect(variables).toBe('{ "todoId": 1 }')
  })

  it('should return a query with fragments when fragment is true', () => {
    const [query, variables] = graphql<TodoResult, QueryTodoArgs>({
      name: 'todo',
      fields: [
        {
          type: 'Todo',
          value: ['id', 'name'],
          fragment: true
        },
        {
          type: 'TodoNotFoundError',
          fragment: true,
          value: ['message']
        }
      ],
      variables: {
        todoId: '123'
      }
    })

    expect(query).toBe('query ($todoId: String) { todo (todoId: $todoId) { ...on Todo { id name } ...on TodoNotFoundError { message } } }')
    expect(variables).toBe('{ "todoId": 1 }')
  })

  it('should return a query with variables', () => {
    const [query, variables] = graphql<Todo, QueryTodoArgs>({
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

    expect(query).toBe('query ($todoId: ID!) { todos (todoId: $todoId) { id name complete } }')
    expect(variables).toBe('{ "todoId": 1 }')
  })

  it('should return a mutation with variables', () => {
    const [query, variables] = graphql<Todo, MutationCreateTodoArgs>({
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

    expect(query).toBe('mutation ($input: TodoInput!) { createTodo (input: $input) { id name complete } }')
    expect(variables).toBe('{ "input": { "complete": false, "name": "test", "todoId": "123" } }')
  })
})
