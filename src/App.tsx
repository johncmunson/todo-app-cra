import './App.css'
import { Todo } from './models/Todo'
import React, { useEffect, useState } from 'react'
import { TodoItem } from './components/TodoItem'
import { TodoInput } from './components/TodoInput'
import * as todoService from './services/todoService'
import { TodoFooter } from './components/TodoFooter'
import { TodoHeader } from './components/TodoHeader'
import useBodyClass from './hooks/useBodyClass'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [allFilteredTodosComplete, setAllFilteredTodosComplete] = useState<boolean>(false)
  const [remainingTodoCount, setRemainingTodoCount] = useState<number>(0)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hydrating, setHydrating] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  useBodyClass(theme === 'light' ? 'bg-white' : 'bg-grey')

  // Hydrate app with initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      const todos = await todoService.fetchTodos()
      setTodos(todos)
      setHydrating(false)
    }

    fetchInitialData()
  }, [])

  // allFilteredTodosComplete is a computed property that depends on other state
  useEffect(() => {
    const allComplete = filteredTodos.every(_ => _.isComplete) && filteredTodos.length > 0
    setAllFilteredTodosComplete(allComplete)
  }, [filteredTodos])

  // remainingTodoCount is a computed property that depends on other state
  useEffect(() => {
    const remainingTodos = todos.filter(_ => !_.isComplete)
    setRemainingTodoCount(remainingTodos.length)
  }, [todos])

  // filteredTodos is a computed property that depends on other state
  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (activeFilter) {
        case 'all': {
          return true
        }
        case 'active': {
          return !todo.isComplete
        }
        case 'complete': {
          return todo.isComplete
        }
        default: {
          return true
        }
      }
    })

    setFilteredTodos(filteredTodos)
  }, [todos, activeFilter])

  const onToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

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

    // Check/uncheck all of the "visible" todos
    const newTodos = todos.map(todo => {
      if (filteredTodos.filter(filteredTodo => filteredTodo.id === todo.id).length > 0) {
        return { ...todo, isComplete: !allFilteredTodosComplete }
      }
      return todo
    })

    setTodos(newTodos)
    await Promise.all(newTodos.map(_ => todoService.updateTodo(_.id, { isComplete: _.isComplete })))

    setLoading(false)
  }

  const onDeleteTodo = async (id: string) => {
    setLoading(true)

    const todoIndex = todos.findIndex((todo) => todo.id === id)
    setTodos([...todos.slice(0, todoIndex), ...todos.slice(todoIndex + 1)])
    await todoService.deleteTodo(id)

    setLoading(false)
  }

  const onClickFilter = (newFilter: string) => {
    if (newFilter !== activeFilter) {
      setActiveFilter(newFilter)
    }
  }

  const onClearCompleted = async () => {
    setLoading(true)

    const activeTodos = todos.filter(_ => !_.isComplete)
    const completedTodos = todos.filter(_ => _.isComplete)

    setTodos(activeTodos)
    await Promise.all(completedTodos.map(_ => todoService.deleteTodo(_.id)))

    setLoading(false)
  }

  return (
    <div className="app">
      {hydrating ? (
        <div className="loading mt-1">Loading</div>
      ) : (
        <>
          <TodoHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
          <div className="flex">
            <input className="mr-05" type="checkbox" checked={allFilteredTodosComplete} onChange={onCheckAll} />
            <TodoInput className="flex-grow" onSubmit={onCreateNewTodo} />
          </div>
          <hr className="opacity-50" />
          {filteredTodos.length > 0 ? filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              name={todo.name}
              isComplete={todo.isComplete}
              onSubmitNewName={onSubmitNewName}
              onCheckTodo={onCheckTodo}
              onDeleteTodo={onDeleteTodo}
            />
          )) : <div className="text-lg">No todos</div>}
          <TodoFooter
            filters={['all', 'active', 'complete']}
            activeFilter={activeFilter}
            remainingTodoCount={remainingTodoCount}
            onClickFilter={onClickFilter}
            onClearCompleted={onClearCompleted}
          />
          {loading && <div className="loading text-xs mt-1">Loading</div>}
        </>
      )}
    </div>
  )
}

export default App