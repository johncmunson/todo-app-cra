import { format_date_MM_DD_YYYY } from '../util'

type TodoHeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export const TodoHeader = ({ theme, onToggleTheme }: TodoHeaderProps) => {
  return (
    <div className="flex space-between align-baseline mb-1">
      <div>{format_date_MM_DD_YYYY(new Date())}</div>
      <div className="text-xl">todos</div>
      <label className="switch">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={onToggleTheme}
        />
        <span className="slider round"></span>
      </label>
    </div>
  )
}
