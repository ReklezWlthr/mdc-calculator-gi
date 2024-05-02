import classNames from 'classnames'

export const PillInput = ({
  value,
  onClick,
  style,
}: {
  value: string
  onClick: () => void
  style?: string
}) => {
  return (
    <div
      className={classNames(
        'border-primary-light px-2 py-1 border rounded-lg hover:border-primary-lighter duration-300 cursor-pointer font-normal w-full truncate text-sm',
        value ? 'text-white' : 'text-gray',
        style
      )}
      onClick={onClick}
    >
      {value || '-'}
    </div>
  )
}
