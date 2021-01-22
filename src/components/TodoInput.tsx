import { useState } from 'react'

export interface TodoInputProps {
  onSubmit: (todoText: string) => void
  [x: string]: any
}

export const TodoInput = ({ onSubmit, ...props }: TodoInputProps) => {
  const [todoText, setTodoText] = useState('')

  const _onChange = (e: any) => {
    setTodoText(e.target.value)
  }

  const _onSubmit = (e: any) => {
    if (e.key === 'Enter' && todoText !== '') {
      onSubmit(todoText)
      setTodoText('')
    }
  }

  return (
    <input
      type="text"
      placeholder="Add a new todo..."
      value={todoText}
      onChange={_onChange}
      onKeyDown={_onSubmit}
      {...props}
    />
  )
}
