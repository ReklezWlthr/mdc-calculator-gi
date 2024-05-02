import _ from 'lodash'
import mock from '@src/data/mock.json'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { Element, ElementIcon, WeaponIcon, WeaponType } from '@src/domain/genshin'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import classNames from 'classnames'

interface CharacterModalProps {
  index: number
}

export const CharacterModal = observer(({ index }: CharacterModalProps) => {
  const { teamStore, modalStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    element: [],
    weapon: [],
  })

  const FilterIcon = ({ type, value }: { type: 'element' | 'weapon'; value: Element | WeaponType }) => {
    const array = type === 'element' ? params.element : params.weapon
    const checked = _.includes(array, value)
    return (
      <div
        className={classNames('w-8 h-8 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
          'bg-primary-lighter': checked,
        })}
        onClick={() => setParams({ [type]: checked ? _.without(array, value) : [...array, value] })}
      >
        <img src={type === 'element' ? ElementIcon[value] : WeaponIcon[value]} />
      </div>
    )
  }

  return (
    <div className="w-[85vw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <div className="flex items-center gap-6">
        <p className="shrink-0">Select a Character</p>
        <TextInput
          onChange={(value) => setParams({ searchWord: value })}
          value={params.searchWord}
          placeholder="Search Character Name"
        />
        <div className="flex gap-2">
          <FilterIcon type="element" value={Element.ANEMO} />
          <FilterIcon type="element" value={Element.PYRO} />
          <FilterIcon type="element" value={Element.HYDRO} />
          <FilterIcon type="element" value={Element.CRYO} />
          <FilterIcon type="element" value={Element.ELECTRO} />
          <FilterIcon type="element" value={Element.GEO} />
          <FilterIcon type="element" value={Element.DENDRO} />
        </div>
        <div className="flex gap-2">
          <FilterIcon type="weapon" value={WeaponType.SWORD} />
          <FilterIcon type="weapon" value={WeaponType.CLAYMORE} />
          <FilterIcon type="weapon" value={WeaponType.POLEARM} />
          <FilterIcon type="weapon" value={WeaponType.BOW} />
          <FilterIcon type="weapon" value={WeaponType.CATALYST} />
        </div>
      </div>
      <div className="grid w-full grid-cols-10 gap-x-2">
        {_.map(mock, (item) => (
          <div
            className="rounded-lg cursor-pointer bg-primary"
            onClick={() => {
              teamStore.setMemberInfo(index, {
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
