import { capitalize } from '../util'
import classNames from 'classnames'

type TodoFooterProps = {
  filters: string[]
  activeFilter: string
  remainingTodoCount: number
  onClickFilter: (filterName: string) => void
  onClearCompleted: () => void
  [x: string]: any
}

export const TodoFooter = ({
  filters,
  activeFilter,
  remainingTodoCount,
  onClickFilter,
  onClearCompleted,
}: TodoFooterProps) => {
  return (
    <div className="flex space-between mt-1 ">
      <div>{remainingTodoCount} items left</div>
      <div>
        {filters.map((filter, i, arr) => (
          <span
            key={filter}
            className={classNames({
              'pointer-hover': true,
              'mr-05': i + 1 !== arr.length,
              'text-bold': filter === activeFilter,
            })}
            onClick={() => onClickFilter(filter)}
          >
            {capitalize(filter)}
          </span>
        ))}
      </div>
      <div className="pointer-hover" onClick={onClearCompleted}>
        Clear Completed
      </div>
    </div>
  )
}
