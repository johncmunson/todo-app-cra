import './App.css'
import { Todo } from './models/Todo'
import { useEffect, useState } from 'react'
import { TodoItem } from './components/TodoItem'
import { TodoInput } from './components/TodoInput'
import * as todoService from './services/todoService'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [allComplete, setAllComplete] = useState<boolean>(false)
  const [hydrating, setHydrating] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  // Hydrate app with initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      const todos = await todoService.fetchTodos()
      setTodos(todos)
      setHydrating(false)
    }

    fetchInitialData()
  }, [])

  // allComplete is a computed property that depends on other state
  useEffect(() => {
    const allTodosComplete = todos.every(_ => _.isComplete) && todos.length > 0
    setAllComplete(allTodosComplete)
  }, [todos])

  const onCreateNewTodo = async (name: string) => {
    setLoading(true)

    const newTodo = await todoService.addTodo(name)

    setTodos([...todos, newTodo])
    setLoading(false)
  }

  const onSubmitNewName = async (id: string, newName: string) => {
    setLoading(true)

    const todoIndex = todos.findIndex((todo) => todo.id === id)
    const todo = todos[todoIndex]

    setTodos([
      ...todos.slice(0, todoIndex),
      { ...todo, name: newName },
      ...todos.slice(todoIndex + 1),
    ])
    await todoService.updateTodo(id, { name: newName })

    setLoading(false)
  }

  const onCheckTodo = async (id: string) => {
    setLoading(true)

    const todoIndex = todos.findIndex((todo) => todo.id === id)
    const todo = todos[todoIndex]

    const newIsComplete = !todo.isComplete

    setTodos([
      ...todos.slice(0, todoIndex),
      { ...todo, isComplete: newIsComplete },
      ...todos.slice(todoIndex + 1),
    ])

    await todoService.updateTodo(id, { isComplete: newIsComplete })

    setLoading(false)
  }

  const onCheckAll = async () => {
    setLoading(true)

    setTodos(todos.map(_ => ({ ..._, isComplete: !allComplete })))
    await Promise.all(todos.map(_ => todoService.updateTodo(_.id, { isComplete: !allComplete })))

    setLoading(false)
  }

  const onDeleteTodo = async (id: string) => {
    setLoading(true)

    const todoIndex = todos.findIndex((todo) => todo.id === id)
    setTodos([...todos.slice(0, todoIndex), ...todos.slice(todoIndex + 1)])
    await todoService.deleteTodo(id)

    setLoading(false)
  }

  return (
    <div className="app">
      {hydrating ? (
        <div className="loading mt-1">Loading</div>
      ) : (
        <>
          <div className="flex">
            <input className="mr-05" type="checkbox" checked={allComplete} onChange={onCheckAll} />
            <TodoInput className="flex-grow" onSubmit={onCreateNewTodo} />
          </div>
          <hr />
          {todos.length > 0 ? todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              name={todo.name}
              isComplete={todo.isComplete}
              onSubmitNewName={onSubmitNewName}
              onCheckTodo={onCheckTodo}
              onDeleteTodo={onDeleteTodo}
            />
          )) : <div className="text-lg">You are all caught up!</div>}
          {loading && <div className="loading text-xs mt-1">Loading</div>}
        </>
      )}
    </div>
  )
}

export default App