import { render } from '@testing-library/react'
import { format_date_MM_DD_YYYY } from '../util'
import { TodoHeader } from './TodoHeader'

it('displays the current data in MM/DD/YYYY format', () => {
  const { getByText } = render(
    <TodoHeader theme="light" onToggleTheme={() => {}} />
  )
  expect(getByText(format_date_MM_DD_YYYY(new Date()))).toBeInTheDocument()
})

it('dark mode toggle is checked when theme is "dark"', () => {
  const { getByTestId } = render(
    <TodoHeader theme="dark" onToggleTheme={() => {}} />
  )
  const toggle = getByTestId('dark-mode-toggle') as HTMLInputElement
  expect(toggle.checked).toEqual(true)
})

it('dark mode toggle is not checked when theme is "light"', () => {
  const { getByTestId } = render(
    <TodoHeader theme="light" onToggleTheme={() => {}} />
  )
  const toggle = getByTestId('dark-mode-toggle') as HTMLInputElement
  expect(toggle.checked).toEqual(false)
})

it('calls onToggleTheme when the dark mode toggle is clicked', () => {
  const onToggleTheme = jest.fn()
  const { getByTestId } = render(
    <TodoHeader theme="light" onToggleTheme={onToggleTheme} />
  )
  const toggle = getByTestId('dark-mode-toggle')
  toggle.click()
  expect(onToggleTheme).toHaveBeenCalledTimes(1)
})
