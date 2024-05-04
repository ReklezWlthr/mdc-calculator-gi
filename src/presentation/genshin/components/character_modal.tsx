import _ from 'lodash'
import mock from '@src/data/mock/characters.json'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { Element, ElementIcon, WeaponIcon, WeaponType } from '@src/domain/genshin/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { useMemo } from 'react'
import { DefaultWeapon } from '@src/data/stores/team_store'

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

  const filteredChar = useMemo(
    () =>
      _.filter(
        mock.sort((a, b) => a.name.localeCompare(b.name)),
        (item) => {
          const regex = new RegExp(params.searchWord, 'i')
          const nameMatch = item.name.match(regex)
          const elmMatch = _.size(params.element) ? _.includes(params.element, Element[item.element]) : true
          const weaponMatch = _.size(params.weapon) ? _.includes(params.weapon, WeaponType[item.weapon]) : true

          return nameMatch && elmMatch && weaponMatch
        }
      ),
    [params]
  )

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
      <div className="grid w-full grid-cols-10 gap-4">
        {_.map(filteredChar, (item) => (
          <div
            className="text-xs duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border hover:scale-105"
            onClick={() => {
              teamStore.setMemberInfo(index, {
                data: item,
              })
              console.log(item.weapon !== teamStore.characters[index]?.equipments?.weapon?.data?.type)
              if (item.weapon !== teamStore.characters[index]?.equipments?.weapon?.data?.type)
                teamStore.setWeapon(index, DefaultWeapon)
              modalStore.closeModal()
            }}
            key={item.name}
          >
            <div className="relative">
              <img src={ElementIcon[Element[item.element]]} className="absolute w-8 h-8 top-0.5 left-1" />
              <div className="absolute bg-primary-darker py-0.5 px-1.5 rounded-full right-1 bottom-0.5">
                <RarityGauge rarity={item.rarity} />
              </div>
              <img
                src={`https://enka.network/ui/UI_AvatarIcon_${item.codeName || 'PlayerGirl'}.png`}
                className="rounded-t-lg bg-primary-darker"
              />
            </div>
            <p className="flex justify-center px-2 py-1 truncate">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
})
