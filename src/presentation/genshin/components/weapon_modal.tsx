import _ from 'lodash'
import mock from '@src/data/mock/weapons.json'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'

interface WeaponModalProps {
  index: number
}

export const WeaponModal = observer(({ index }: WeaponModalProps) => {
  const { teamStore, modalStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
  })

  return (
    <div className="w-[85vw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <div className="flex items-center gap-6">
        <p className="shrink-0">Select a Weapon</p>
        <div className="w-1/3">
          <TextInput
            onChange={(value) => setParams({ searchWord: value })}
            value={params.searchWord}
            placeholder="Search Weapon Name"
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-10 gap-x-2">
        {_.map(mock, (item) => (
          <div
            className="w-full text-xs rounded-lg cursor-pointer bg-primary"
            onClick={() => {
              teamStore.setWeapon(index, {
                data: item,
              })
              modalStore.closeModal()
            }}
            key={item.name}
          >
            <p className="flex justify-center w-full px-2 py-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
})
