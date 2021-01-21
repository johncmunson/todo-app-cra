import axios from 'axios'
import { Todo } from '../models/Todo'

const baseUrl = 'http://localhost:3005'

type JsonRPC<T> = {
  result: T
}

type RawTodo = {
  name: string
  description: string
  id: string
  checked: boolean
  archived: boolean
}

export const addTodo = async (name: string) => {
  const {
    data: { result: todo },
  } = await axios.post<JsonRPC<RawTodo>>(baseUrl, {
    jsonrpc: '2.0',
    method: 'addTodo',
    id: 1,
    params: {
      name,
    },
  })

  return new Todo(todo.id, todo.name, todo.checked)
}

export const fetchTodos = async () => {
  const {
    data: { result: todos },
  } = await axios.post<JsonRPC<RawTodo[]>>(baseUrl, {
    jsonrpc: '2.0',
    method: 'getTodoList',
    id: 1,
  })

  return todos.map((_) => new Todo(_.id, _.name, _.checked))
}

export const fetchTodo = async (id: string) => {
  const {
    data: { result: todo },
  } = await axios.post<JsonRPC<RawTodo>>(baseUrl, {
    jsonrpc: '2.0',
    method: 'getTodo',
    id: 1,
    params: {
      id,
    },
  })

  return new Todo(todo.id, todo.name, todo.checked)
}

export const updateTodo = async (id: string, changes: Partial<Todo>) => {
  const rawTodo: Partial<Pick<RawTodo, 'id' | 'name' | 'checked'>> = {
    id,
    name: changes.name,
    checked: changes.isComplete,
  }

  const {
    data: { result: updatedTodo },
  } = await axios.post<JsonRPC<RawTodo>>(baseUrl, {
    jsonrpc: '2.0',
    method: 'updateTodo',
    id: 1,
    params: rawTodo,
  })

  return new Todo(updatedTodo.id, updatedTodo.name, updatedTodo.checked)
}

export const deleteTodo = async (id: string) => {
  const {
    data: { result: todos },
  } = await axios.post<JsonRPC<RawTodo[]>>(baseUrl, {
    jsonrpc: '2.0',
    method: 'deleteTodo',
    id: 1,
    params: {
      id,
    },
  })

  return todos.map((_) => new Todo(_.id, _.name, _.checked))
}
