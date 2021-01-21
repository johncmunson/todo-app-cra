import { useState } from 'react'

export interface TodoItemProps {
  id: string
  name: string
  isComplete: boolean
  onSubmitNewName: (id: string, newName: string) => void
  onCheckTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
}

type TodoItemMode = 'view' | 'edit'

export const TodoItem = ({
  id,
  name,
  isComplete,
  onSubmitNewName,
  onCheckTodo,
  onDeleteTodo,
}: TodoItemProps) => {
  const [mode, setMode] = useState<TodoItemMode>('view')
  const [newName, setNewName] = useState<string>(name)

  const _onNameChange = (e: any) => {
    setNewName(e.target.value)
  }

  const _onSubmitNewName = (e: any) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      if (newName === '') {
        alert('Todo items cannot be empty')
      } else {
        onSubmitNewName(id, newName)
        setMode('view')
      }
    }
  }

  return (
    <div className="flex space-between align-baseline">
      <div>
        <input
          className="mr-05"
          type="checkbox"
          checked={isComplete}
          onChange={() => onCheckTodo(id)}
        />
        {mode === 'view' ? (
          <span
            onClick={() => setMode('edit')}
            className={isComplete ? 'text-strikethrough' : ''}
          >
            {name}
          </span>
        ) : (
          <input
            type="text"
            value={newName}
            autoFocus
            onChange={_onNameChange}
            onKeyDown={_onSubmitNewName}
            onBlur={_onSubmitNewName}
          />
        )}
      </div>
      <div className="pointer-hover" onClick={() => onDeleteTodo(id)}>
        x
      </div>
    </div>
  )
}
