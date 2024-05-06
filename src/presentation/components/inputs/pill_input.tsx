import classNames from 'classnames'

export const PillInput = ({
  value,
  onClick,
  onClear,
  style,
  disabled,
}: {
  value: string
  onClick: () => void
  onClear: () => void
  style?: string
  disabled?: boolean
}) => {
  return (
    <div
      className={classNames(
        'group flex items-center px-2 py-1 border rounded-lg duration-300 font-normal truncate w-full text-sm gap-1',
        value && !disabled ? 'text-gray' : 'text-primary-light',
        disabled
          ? 'cursor-not-allowed bg-primary-bg border-primary'
          : 'cursor-pointer hover:border-primary-lighter bg-primary-darker border-primary-light',
        style
      )}
      onClick={() => !disabled && onClick()}
    >
      <p className="w-full truncate">{value || '-'}</p>
      <i
        className="text-sm duration-100 opacity-0 cursor-pointer fa-solid fa-times-circle text-primary-light group-hover:opacity-100 w-fit"
        onClick={(event) => {
          event.stopPropagation()
          !disabled && onClear()
        }}
      />
    </div>
  )
}
