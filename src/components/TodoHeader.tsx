import { format_date_MM_DD_YYYY } from "../util"

export const TodoHeader = () => {
  return (
    <div className="flex space-between align-baseline mb-1">
      <div>{format_date_MM_DD_YYYY(new Date())}</div>
      <div className="text-xl">todos</div>
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  )
}
