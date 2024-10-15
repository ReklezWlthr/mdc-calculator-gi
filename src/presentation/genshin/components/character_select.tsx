import { useStore } from '@src/data/providers/app_store_provider'
import classNames from 'classnames'

export const CharacterSelect = ({
  onClick,
  isSelected,
  codeName,
  ringColor = 'ring-primary-lighter',
}: {
  onClick?: () => void
  isSelected: boolean
  codeName: string
  ringColor?: string
}) => {
  const { settingStore } = useStore()

  const code = codeName === 'Player' ? settingStore.settings.travelerGender : codeName || ''

  return (
    <div
      className={classNames('w-12 h-12 rounded-full bg-primary duration-200 relative shrink-0', {
        'hover:ring-2 ring-primary-light': onClick && !isSelected,
        [classNames('ring-4', ringColor)]: isSelected,
        'cursor-pointer': onClick,
      })}
      onClick={onClick}
    >
      <img
        src={code ? `https://enka.network/ui/UI_AvatarIcon_Side_${code}.png` : ''}
        onError={(e) =>
          (e.target as HTMLElement).setAttribute(
            'src',
            code ? `https://homdgcat.wiki/homdgcat-res/Avatar/UI_AvatarIcon_Side_${code}.png` : ''
          )
        }
        className="absolute scale-150 bottom-3"
      />
    </div>
  )
}
