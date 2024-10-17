import { getSideAvatar } from '@src/core/utils/fetcher'
import { useStore } from '@src/data/providers/app_store_provider'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'

export const CharacterSelect = observer(
  ({
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
        <img src={getSideAvatar(code)} className="absolute scale-150 bottom-3" />
      </div>
    )
  }
)
