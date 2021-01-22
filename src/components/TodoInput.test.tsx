import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from './TodoInput'

it('is empty by default', () => {
  render(<TodoInput onSubmit={() => {}} />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  expect(input.value).toEqual('')
})

it('accepts text input', () => {
  render(<TodoInput onSubmit={() => {}} />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  const text = 'Hello World'
  userEvent.type(input, text)
  expect(input.value).toEqual(text)
})

it('submits text on "Enter", and then resets the input to be empty', () => {
  const onSubmit = jest.fn()
  render(<TodoInput onSubmit={onSubmit} />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  const text = 'Sup Dude'
  userEvent.type(input, text)
  userEvent.type(input, '{enter}')
  expect(onSubmit).toHaveBeenCalledWith(text)
  expect(input.value).toEqual('')
})

it('blocks submission if the input is empty', () => {
  const onSubmit = jest.fn()
  render(<TodoInput onSubmit={onSubmit} />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  userEvent.type(input, '{enter}')
  expect(onSubmit).not.toHaveBeenCalled()
  expect(input.value).toEqual('')
})
