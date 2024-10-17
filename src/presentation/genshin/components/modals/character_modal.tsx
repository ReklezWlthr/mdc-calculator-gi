import _ from 'lodash'
import { Characters } from '@src/data/db/characters'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { Element, ITeamChar, Tags, WeaponIcon, WeaponType } from '@src/domain/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { useMemo } from 'react'
import { DefaultWeapon } from '@src/data/stores/team_store'
import { DefaultBuild } from '@src/data/stores/build_store'
import { findWeapon, isSubsetOf } from '@src/core/utils/finder'
import getConfig from 'next/config'
import { TagSelectInput } from '@src/presentation/components/inputs/tag_select_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import { BulletPoint } from '@src/presentation/components/collapsible'
import { getAvatar, getElementImage, getTalentWeaponImage } from '@src/core/utils/fetcher'

const { publicRuntimeConfig } = getConfig()

interface CharacterModalProps {
  index: number
  setChar?: (index: number, value: Partial<ITeamChar>) => void
}

export const CharacterModal = observer(({ index, setChar }: CharacterModalProps) => {
  const { teamStore, modalStore, buildStore, charStore, settingStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    element: [],
    weapon: [],
    tags: [],
  })

  const selectedWeaponData = findWeapon(teamStore.characters[index]?.equipments?.weapon?.wId)

  const charSetter = setChar || teamStore.setMemberInfo

  const filteredChar = useMemo(
    () =>
      _.filter(
        Characters.sort((a, b) => a.name.localeCompare(b.name)),
        (item) => {
          const regex = new RegExp(params.searchWord, 'i')
          const nameMatch = item.name.match(regex)
          const elmMatch = _.size(params.element) ? _.includes(params.element, item.element) : true
          const weaponMatch = _.size(params.weapon) ? _.includes(params.weapon, item.weapon) : true
          const tagsMatch = _.size(params.tags) ? isSubsetOf(params.tags, item.tags) : true

          return nameMatch && elmMatch && weaponMatch && !!tagsMatch
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
        <img src={type === 'element' ? getElementImage(value) : getTalentWeaponImage(value)} />
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
        <div className="flex items-center gap-2">
          <TagSelectInput
            options={_.map(Tags, (item) => ({ name: item, value: item }))}
            onChange={(v) => setParams({ tags: v })}
            placeholder="Select Tags (Match All)"
            small
            style="w-[150px]"
            values={params.tags}
            onlyShowCount
          />
          <Tooltip
            title="Character Tags"
            body={
              <div className="font-normal">
                <BulletPoint>
                  <b>On-Field DPS</b>: Excels at dealing damage by weaving a series of attacks together. Usually deals
                  damage through Normal, Charged, or Plunging Attacks, and remains on the field for most of the
                  rotation.
                </BulletPoint>
                <BulletPoint>
                  <b>Off-Field DPS</b>: Excels at passively dealing damage through various means even after they left
                  the field. Does not take as much field time as On-Field DPS's.
                </BulletPoint>
                {/* <BulletPoint>
                  <b>Reaction</b>: Excels at dealing damage through Elemental Reactions or heavily relies on them to
                  scale. Usually has relatively low personal damage.
                </BulletPoint> */}
                <BulletPoint>
                  <b>Applicator</b>: Also known as <b>Enabler</b>. Possesses abilities that help them reliably and
                  consistently apply and maintain an Elemental Aura on enemies for frequent Reactions.
                </BulletPoint>
                {/* <BulletPoint>
                  <b>Burst Reliant</b>: Heavily relies on their Elemental Burst as an integral part of their
                  kit/rotation. Not having it ready will greatly hinder their performance. Usually requires a lot of
                  Energy Recharge or a Battery.
                </BulletPoint> */}
                <BulletPoint>
                  <b>Amplify</b>: Excels at amplifying the power of their teammates by directly enhancing them and/or
                  their playstyle, or weakening enemies.
                </BulletPoint>
                <BulletPoint>
                  <b>Heal</b>: Possesses abilities that recovers health for their allies.
                </BulletPoint>
                <BulletPoint>
                  <b>Shield</b>: Possesses abilities that provide lasting shields for their allies, protecting them from
                  damage and interruptions.
                </BulletPoint>
                <BulletPoint>
                  <b>Control</b>: Excels at keeping enemies locked in place or preventing them from acting.
                </BulletPoint>
                <BulletPoint>
                  <b>Battery</b>: Excels at recharging Energy for their team either by directly providing Energy or
                  generating a good amount of Elemental Particles.
                </BulletPoint>
                <BulletPoint>
                  <b>Exploration</b>: Possesses abilities that aid players in traversing different kinds of terrain or
                  interacting with Overworld mechanics.
                </BulletPoint>
              </div>
            }
            position="left"
            style="w-[500px]"
          >
            <i className="text-base fa-regular fa-question-circle" />
          </Tooltip>
        </div>
      </div>
      <div className="grid w-full grid-cols-10 gap-4 max-h-[70vh] overflow-y-auto hideScrollbar rounded-lg">
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
                charSetter(index, {
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
                <img src={getElementImage(item.element)} className="absolute w-7 h-7 top-1.5 left-1.5" />
                {owned && (
                  <div className="absolute px-1.5 py-1 text-xs rounded-lg top-1 right-1 bg-primary font-bold">
                    C{_.find(charStore.characters, ['cId', item.id])?.cons || 0}
                  </div>
                )}
                {item.beta && (
                  <div className="absolute right-0 px-1.5 text-xs py-0.5 font-bold rounded-l-md bottom-6 bg-rose-600">
                    Beta
                  </div>
                )}
                <div className="absolute bg-primary-darker py-0.5 px-1.5 rounded-full right-1 bottom-0.5">
                  <RarityGauge rarity={item.rarity} isSpecial={item.region === 'Unknown'} />
                </div>
                <img
                  src={getAvatar(codeName)}
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
