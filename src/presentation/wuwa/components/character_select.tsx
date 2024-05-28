import classNames from 'classnames'

export const CharacterSelect = ({
  onClick,
  isSelected,
  id,
}: {
  onClick: () => void
  isSelected: boolean
  id: string
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
        src={id ? `https://cdn.wanderer.moe/wuthering-waves/character-icons/T_IconRoleHead175_${id}_UI.png` : ''}
        className="absolute scale-150 bottom-3"
      />
    </div>
  )
}
