import classNames from 'classnames'

export const PillInput = ({
  value,
  onClick,
  style,
  disabled,
}: {
  value: string
  onClick: () => void
  style?: string
  disabled?: boolean
}) => {
  return (
    <div
      className={classNames(
        ' px-2 py-1 border rounded-lg  duration-300  font-normal w-full truncate text-sm peer',
        value && !disabled ? 'text-gray' : 'text-primary-light',
        disabled
          ? 'cursor-not-allowed bg-primary-bg border-primary'
          : 'cursor-pointer hover:border-primary-lighter bg-primary-darker border-primary-light',
        style
      )}
      onClick={() => !disabled && onClick()}
    >
      {value || '-'}
    </div>
  )
}
