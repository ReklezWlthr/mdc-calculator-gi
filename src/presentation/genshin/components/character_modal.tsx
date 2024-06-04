import _ from 'lodash'
import { Characters } from '@src/data/db/characters'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { Element, WeaponIcon, WeaponType } from '@src/domain/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { useMemo } from 'react'
import { DefaultWeapon } from '@src/data/stores/team_store'
import { DefaultBuild } from '@src/data/stores/build_store'
import { findWeapon } from '@src/core/utils/finder'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

interface CharacterModalProps {
  index: number
}

export const CharacterModal = observer(({ index }: CharacterModalProps) => {
  const { teamStore, modalStore, buildStore, charStore, settingStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    element: [],
    weapon: [],
    hasBuild: false,
  })

  const selectedWeaponData = findWeapon(teamStore.characters[index]?.equipments?.weapon?.wId)

  const filteredChar = useMemo(
    () =>
      _.filter(
        Characters.sort((a, b) => a.name.localeCompare(b.name)),
        (item) => {
          const regex = new RegExp(params.searchWord, 'i')
          const nameMatch = item.name.match(regex)
          const elmMatch = _.size(params.element) ? _.includes(params.element, item.element) : true
          const weaponMatch = _.size(params.weapon) ? _.includes(params.weapon, item.weapon) : true
          const buildMatch = params.hasBuild ? _.find(buildStore.builds, ['cId', item.id]) : true

          return nameMatch && elmMatch && weaponMatch && !!buildMatch
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
          'p-0.5': type === 'element',
        })}
        onClick={() => setParams({ [type]: checked ? _.without(array, value) : [...array, value] })}
        title={value}
      >
        <img
          src={
            type === 'element'
              ? `https://cdn.wanderer.moe/genshin-impact/elements/${value?.toLowerCase()}.png`
              : `https://enka.network/ui/${WeaponIcon[value]}`
          }
        />
      </div>
    )
  }

  return (
    <div className="w-[85vw] max-w-[1240px] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
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
        <img
          src={`${publicRuntimeConfig.BASE_PATH}/icons/artifact_icon.png`}
          className={classNames('w-8 h-8 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
            'bg-primary-lighter': params.hasBuild,
          })}
          onClick={() => setParams({ hasBuild: !params.hasBuild })}
          title="Has Default Build"
        />
      </div>
      <div className="grid w-full grid-cols-9 gap-4 max-h-[70vh] overflow-y-auto hideScrollbar rounded-lg">
        {_.map(filteredChar, (item) => {
          const owned = _.includes(_.map(charStore.characters, 'cId'), item.id)
          const codeName = item.codeName === 'Player' ? settingStore.settings.travelerGender : item.codeName
          return (
            <div
              className="w-full text-xs duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border hover:scale-95"
              onClick={() => {
                const build = _.find(buildStore.builds, (build) => build.isDefault && build.cId === item.id)
                const char = _.find(charStore.characters, (char) => char.cId === item.id)
                if (item.weapon !== selectedWeaponData?.type && teamStore.characters[index]?.equipments?.weapon)
                  teamStore.setWeapon(index, DefaultWeapon)
                teamStore.setMemberInfo(index, {
                  cId: item.id,
                  ascension: char?.ascension || 0,
                  level: char?.level || 1,
                  talents: char?.talents || { normal: 1, skill: 1, burst: 1 },
                  equipments: build ? { weapon: build.weapon, artifacts: build.artifacts } : DefaultBuild,
                  cons: char?.cons || 0,
                })
                modalStore.closeModal()
              }}
              key={item.name}
            >
              <div className="relative">
                <img
                  src={`https://cdn.wanderer.moe/genshin-impact/elements/${item.element.toLowerCase()}.png`}
                  className="absolute w-8 h-8 top-1 left-1"
                />
                {owned && (
                  <div className="absolute px-1.5 py-1 text-sm rounded-lg top-1 right-1 bg-primary font-bold">
                    C{_.find(charStore.characters, ['cId', item.id])?.cons || 0}
                  </div>
                )}
                <div className="absolute bg-primary-darker py-0.5 px-1.5 rounded-full right-1 bottom-0.5">
                  <RarityGauge rarity={item.rarity} isSpecial={item.region === 'Unknown'} />
                </div>
                <img
                  src={`https://enka.network/ui/UI_AvatarIcon_${codeName}.png`}
                  className="object-contain rounded-t-lg bg-primary-darker aspect-square"
                />
              </div>
              <p className="w-full px-2 py-1 text-center truncate">{item.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
})
