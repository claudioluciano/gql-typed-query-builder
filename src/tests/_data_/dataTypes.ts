export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export interface Mutation {
  __typename?: 'Mutation'
  createTodo?: Maybe<Todo>
  deleteTodo?: Maybe<Array<Maybe<Todo>>>
  toggleTodo?: Maybe<Todo>
  updateTodo?: Maybe<Todo>
}

export interface MutationCreateTodoArgs {
  input: TodoInput
}

export interface MutationDeleteTodoArgs {
  input: TodoInput
}

export interface MutationToggleTodoArgs {
  todoId: Scalars['ID']
}

export interface MutationUpdateTodoArgs {
  input: TodoInput
}

export interface Query {
  __typename?: 'Query'
  todo?: Maybe<Todo>
  todos?: Maybe<Array<Maybe<Todo>>>
}

export interface QueryTodoArgs {
  todoId?: InputMaybe<Scalars['ID']>
}

export interface Todo {
  __typename?: 'Todo'
  complete?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
}

export interface TodoInput {
  complete?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<Scalars['String']>
  todoId?: InputMaybe<Scalars['ID']>
}
