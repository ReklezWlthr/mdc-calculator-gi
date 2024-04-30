import { useStore } from '@src/data/providers/app_store_provider'
import classNames from 'classnames'
import { useCallback } from 'react'
import { CharacterModal } from './character_modal'
import { observer } from 'mobx-react-lite'

interface CharacterBlockProps {
  index: number
}

const PillInput = ({ value, onClick }: { value: string; onClick: () => void }) => {
  return (
    <div
      className={classNames(
        'border-primary-light px-2 py-0.5 border rounded-lg hover:border-primary-lighter duration-300 cursor-pointer font-semibold',
        value ? 'text-white' : 'text-gray'
      )}
      onClick={onClick}
    >
      {value || '-'}
    </div>
  )
}

export const CharacterBlock = observer((props: CharacterBlockProps) => {
  const { modalStore, teamStore } = useStore()

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<CharacterModal index={props.index} />)
  }, [modalStore])

  return (
    <div className="w-full overflow-hidden font-bold text-white rounded-lg bg-primary-dark">
      <div className="flex justify-center px-5 py-3 text-xl bg-primary-lighter">Character</div>
      <div className="flex gap-x-2">
        <div className="w-1/2"></div>
        <div className="w-1/2 space-y-1">
          <p className="text-sm font-semibold">Name</p>
          <div className="flex gap-1">
            <div className="w-full">
              <PillInput onClick={onOpenModal} value={teamStore.characters[props.index]?.name} />
            </div>
            <PillInput onClick={() => null} value={'E0'} />
          </div>
        </div>
      </div>
    </div>
  )
}
)