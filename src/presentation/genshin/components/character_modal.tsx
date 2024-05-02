import _ from 'lodash'
import mock from '@src/data/mock.json'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { Element, WeaponType } from '@src/domain/genshin'

interface CharacterModalProps {
  index: number
}

export const CharacterModal = observer(({ index }: CharacterModalProps) => {
  const { teamStore, modalStore } = useStore()

  return (
    <div className="w-[85vw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <p>Select a Character</p>
      <div className="grid w-full grid-cols-10 gap-x-2">
        {_.map(mock, (item) => (
          <div
            className="rounded-lg cursor-pointer bg-primary"
            onClick={() => {
              teamStore.setMember(index, {
                name: item.name,
                element: Element[item.element],
                weapon: WeaponType[item.weapon],
              })
              modalStore.closeModal()
            }}
            key={item.name}
          >
            <p className="flex justify-center">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
})
