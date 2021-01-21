import { useState } from "react"

export interface TodoItemProps {
  id: string
  name: string
  isComplete: boolean
  onSubmitNewName: (id: string, newName: string) => void
  onCheckTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
}

type TodoItemMode = 'view' | 'edit'

export const TodoItem = ({ id, name, isComplete, onSubmitNewName, onCheckTodo, onDeleteTodo }: TodoItemProps) => {
  const [mode, setMode] = useState<TodoItemMode>('view')
  const [newName, setNewName] = useState<string>(name)

  const _onNameChange = (e: any) => {
    setNewName(e.target.value)
  }

  const _onSubmitNewName = (e: any) => {
    if (e.key === 'Enter') {
      onSubmitNewName(id, newName)
      setMode('view')
    }
  }

  return (
    <div>
      {/* <button onClick={() => console.log(mode, name, newName)}>log</button> */}
      <input type="checkbox" checked={isComplete} onChange={() => onCheckTodo(id)} />
      {
        mode === 'view'
          ? <span onClick={() => setMode('edit')} className={isComplete ? 'text-strikethrough' : ''}>{name}</span>
          : <input type="text" value={newName} autoFocus onChange={_onNameChange} onKeyDown={_onSubmitNewName} />
      }
    </div>
  )
}

