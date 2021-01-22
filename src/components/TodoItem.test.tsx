import { render } from '@testing-library/react'
import { TodoItem, TodoItemProps } from './TodoItem'

const defaultTodoItemProps: TodoItemProps = {
  id: '1',
  name: 'Do Laundry',
  isComplete: false,
  onSubmitNewName: jest.fn(),
  onCheckTodo: jest.fn(),
  onDeleteTodo: jest.fn(),
}

afterEach(() => {
  jest.clearAllMocks()
})

it('is unchecked when the todo is not complete', () => {
  const { getByRole } = render(<TodoItem {...defaultTodoItemProps} />)
  const checkbox = getByRole('checkbox') as HTMLInputElement
  expect(checkbox.checked).toEqual(false)
})

it('is checked when the todo is complete', () => {
  const { getByRole } = render(
    <TodoItem {...defaultTodoItemProps} isComplete={true} />
  )
  const checkbox = getByRole('checkbox') as HTMLInputElement
  expect(checkbox.checked).toEqual(true)
})

it('calls onCheck with the todo id when the todo is checked or unchecked', () => {
  const { getByRole, rerender } = render(<TodoItem {...defaultTodoItemProps} />)
  const checkbox = getByRole('checkbox') as HTMLInputElement
  checkbox.click()
  // @ts-ignore
  expect(defaultTodoItemProps.onCheckTodo.mock.calls[0][0]).toEqual(
    defaultTodoItemProps.id
  )
  rerender(<TodoItem {...defaultTodoItemProps} isComplete={true} />)
  checkbox.click()
  // @ts-ignore
  expect(defaultTodoItemProps.onCheckTodo.mock.calls[1][0]).toEqual(
    defaultTodoItemProps.id
  )
})

it('is in view mode by default', () => {
  const { queryByTestId, queryByText } = render(
    <TodoItem {...defaultTodoItemProps} />
  )
  const shouldBeNull = queryByTestId('edit-todo-item')
  const shouldExist = queryByTestId('view-todo-item')
  const alsoShouldExist = queryByText(defaultTodoItemProps.name)
  expect(shouldBeNull).toBeNull()
  expect(shouldExist).not.toBeNull()
  expect(alsoShouldExist).not.toBeNull()
})

it.todo('switches to edit mode on click')

it.todo(
  'calls onSubmitNewName on "Enter" or onBlur, and goes back into view mode'
)

it.todo("doesn't allow todo name to be set to an empty string")

it.todo('it call onDeleteTodo when the "x" is clicked')

it.todo('is crossed out when the todo is complete')
