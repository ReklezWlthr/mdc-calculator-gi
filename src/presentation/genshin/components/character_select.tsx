import classNames from 'classnames'

export const CharacterSelect = ({
  onClick,
  isSelected,
  codeName,
}: {
  onClick: () => void
  isSelected: boolean
  codeName: string
}) => {
  return (
    <div
      className={classNames(
        'w-12 h-12 rounded-full cursor-pointer bg-primary duration-200 relative shrink-0',
        isSelected ? 'ring-4 ring-primary-lighter' : 'hover:ring-2 ring-primary-light'
      )}
      onClick={onClick}
    >
      <img
        src={codeName ? `https://enka.network/ui/UI_AvatarIcon_Side_${codeName}.png` : ''}
        className="absolute scale-150 bottom-3"
      />
    </div>
  )
}
