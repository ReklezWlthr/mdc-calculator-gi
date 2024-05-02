import { useStore } from '@src/data/providers/app_store_provider'
import { useCallback } from 'react'
import { CharacterModal } from './character_modal'
import { observer } from 'mobx-react-lite'
import { PillInput } from '@src/presentation/components/inputs/pill_input'

interface CharacterBlockProps {
  index: number
}

export const CharacterBlock = observer((props: CharacterBlockProps) => {
  const { modalStore, teamStore } = useStore()

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<CharacterModal index={props.index} />)
  }, [modalStore])

  return (
    <div className="w-full overflow-hidden font-bold text-white rounded-lg bg-primary-dark">
      <div className="flex justify-center px-5 py-3 text-xl bg-primary-lighter">Character</div>
      <div className="flex gap-x-3">
        <div className="w-1/2"></div>
        <div className="w-1/2 px-2 py-3 space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Name</p>
            <div className="flex gap-1">
              <PillInput onClick={onOpenModal} value={teamStore.characters[props.index]?.name} />
              <PillInput onClick={() => null} value={'E0'} style="w-fit shrink-0" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex w-full gap-2">
              <p className="w-full text-sm font-semibold">Level</p>
              <p className="w-full text-sm font-semibold">Ascension</p>
            </div>
            <div className="flex w-full gap-2">
              <PillInput onClick={() => null} value={'80'} />
              <PillInput onClick={() => null} value={'A5'} />
            </div>
          </div>
          <p className="w-full text-sm font-semibold">
            Weapon:{' '}
            <span className="font-normal">{teamStore.characters[props.index]?.weapon || '-'}</span>
          </p>
          <p className="w-full text-sm font-semibold">
            Element:{' '}
            <span className="font-normal">{teamStore.characters[props.index]?.element || '-'}</span>
          </p>
        </div>
      </div>
    </div>
  )
})
