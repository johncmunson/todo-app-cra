import './App.css'
import { Todo } from './models/Todo'
import { useEffect, useState } from 'react'
import { TodoItem } from './components/TodoItem'
import { TodoInput } from './components/TodoInput'
import * as todoService from './services/todoService'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchInitialData = async () => {
    const todos = await todoService.fetchTodos()
    setTodos(todos)
    setLoading(false)
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const onCreateNewTodo = async (name: string) => {
    setLoading(true)

    const newTodo = await todoService.addTodo(name)

    setTodos([
      ...todos,
      newTodo
    ])
    setLoading(false)
  }

  const onSubmitNewName = async (id: string, newName: string) => {
    setLoading(true)

    const todoIndex = todos.findIndex(todo => todo.id === id)
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

    const todoIndex = todos.findIndex(todo => todo.id === id)
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

  const onDeleteTodo = async (id: string) => {
    setLoading(true)

    const todoIndex = todos.findIndex(todo => todo.id === id)

    setTodos([
      ...todos.slice(0, todoIndex),
      ...todos.slice(todoIndex + 1),
    ])

    await todoService.deleteTodo(id)

    setLoading(false)
  }

  return (
    <div className="app">
      <TodoInput
        className='width-100 mb-05'
        onSubmit={onCreateNewTodo}
      />
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          name={todo.name}
          isComplete={todo.isComplete}
          onSubmitNewName={onSubmitNewName}
          onCheckTodo={onCheckTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
      {loading && <div className="loading text-xs mt-1">Loading</div>}
    </div>
  )
}

export default App;
