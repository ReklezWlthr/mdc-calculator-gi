import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import React, { useCallback, useMemo, useState } from 'react'
import { findCharacter } from '@src/core/utils/finder'
import { Characters } from '@src/data/db/characters'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import classNames from 'classnames'
import conditionals from '@src/data/lib/stats/conditionals/conditionals'
import { getBaseStat } from '@src/core/utils/data_format'
import { AscensionGrowth } from '@src/domain/scaling'
import { Element, TravelerIconName, WeaponIcon, WeaponType } from '@src/domain/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { CharDetail } from '../components/char_detail'

export const MyCharacters = observer(() => {
  const { teamStore, charStore, settingStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    element: [],
    weapon: [],
  })
  const { selected } = charStore

  const filteredChar = useMemo(
    () =>
      _.filter(
        Characters.sort((a, b) => a.name.localeCompare(b.name)),
        (item) => {
          const regex = new RegExp(params.searchWord, 'i')
          const nameMatch = item.name.match(regex)
          const elmMatch = _.size(params.element) ? _.includes(params.element, item.element) : true
          const weaponMatch = _.size(params.weapon) ? _.includes(params.weapon, item.weapon) : true

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
        className={classNames('w-6 h-6 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
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

  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const charData = findCharacter(selected)
  const charUpgrade = _.find(charStore.characters, ['cId', selected])
  const charCond = _.find(conditionals, ['id', charData?.id])?.conditionals(
    charUpgrade?.cons || 0,
    charUpgrade?.ascension || 0,
    charUpgrade?.talents || { normal: 1, skill: 1, burst: 1 },
    teamStore.characters
  )
  const baseAtk = getBaseStat(
    charData?.stat?.baseAtk,
    charUpgrade?.level,
    charData?.stat?.ascAtk,
    charUpgrade?.ascension,
    charData?.rarity
  )
  const baseHp = getBaseStat(
    charData?.stat?.baseHp,
    charUpgrade?.level,
    charData?.stat?.ascHp,
    charUpgrade?.ascension,
    charData?.rarity
  )
  const baseDef = getBaseStat(
    charData?.stat?.baseDef,
    charUpgrade?.level,
    charData?.stat?.ascDef,
    charUpgrade?.ascension,
    charData?.rarity
  )
  const asc =
    _.max([0, (charUpgrade?.ascension || 0) - 2]) * AscensionGrowth[charData?.stat?.ascStat]?.[charData?.rarity - 4]

  const iconCodeName = charData?.codeName === 'Player' ? TravelerIconName[charData.element] : charData?.codeName
  const fCodeName = charData?.codeName === 'Player' ? settingStore.settings.travelerGender : charData?.codeName

  const {
    params: form,
    setParams: setForm,
    resetParams: resetForm,
  } = useParams({
    level: charUpgrade?.level || 1,
    ascension: charUpgrade?.ascension || 0,
    cons: charUpgrade?.cons || 0,
    normal: charUpgrade?.talents?.normal || 1,
    skill: charUpgrade?.talents?.skill || 1,
    burst: charUpgrade?.talents?.burst || 1,
  })

  const maxTalentLevel = _.max([1, ((form.ascension || 0) - 1) * 2])
  const talentLevels = _.map(Array(maxTalentLevel), (_, index) => ({
    name: (index + 1).toString(),
    value: (index + 1).toString(),
  })).reverse()

  const onSave = useCallback(() => {
    const data = {
      cId: charData.id,
      cons: form.cons,
      ascension: form.ascension,
      level: form.level,
      talents: { normal: form.normal, skill: form.skill, burst: form.burst },
    }
    if (charUpgrade) {
      charStore.editChar(charUpgrade.cId, data)
    } else {
      charStore.addChar(data)
    }
    setEdit(false)
  }, [form, charUpgrade, charData])

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 max-w-[1240px] mx-auto">
      <div className="flex w-full h-full gap-x-10">
        <div className="flex flex-col w-[30%] h-full gap-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-white">My Characters</p>
            <TextInput
              onChange={(value) => setParams({ searchWord: value })}
              value={params.searchWord}
              placeholder="Search Character Name"
              style="!w-1/2"
            />
          </div>
          <div className="flex items-center gap-6 my-1">
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
          <div className="grid grid-cols-4 gap-3 rounded-lg hideScrollbar">
            {_.map(filteredChar, (item) => {
              const owned = _.includes(_.map(charStore.characters, 'cId'), item.id)
              const codeName = item.codeName === 'Player' ? settingStore.settings.travelerGender : item.codeName
              return (
                <div
                  className={classNames(
                    'w-full text-xs text-white duration-200 border rounded-lg cursor-pointer bg-primary-bg border-primary-border hover:scale-95',
                    owned ? 'border-opacity-100' : 'border-opacity-30'
                  )}
                  onClick={() => {
                    charStore.setValue('selected', item.id)
                    setEdit(false)
                    resetForm()
                    if (item.id !== selected) setLoading(true)
                  }}
                  key={item.name}
                >
                  <div className={classNames('relative', owned ? 'opacity-100' : 'opacity-30')}>
                    <img
                      src={`https://cdn.wanderer.moe/genshin-impact/elements/${item.element.toLowerCase()}.png`}
                      className="absolute w-6 h-6 top-1 left-1"
                    />
                    {owned && (
                      <div className="absolute px-1.5 py-1 rounded-full top-1 right-1 bg-primary-light font-bold">
                        C{_.find(charStore.characters, ['cId', item.id])?.cons || 0}
                      </div>
                    )}
                    <div className="absolute bg-primary-darker py-0.5 px-1.5 rounded-full right-1 bottom-0.5">
                      <RarityGauge rarity={item.rarity} isSpecial={item.region === 'Unknown'} />
                    </div>
                    <img
                      src={`https://homdgcat.wiki/homdgcat-res/Avatar/UI_AvatarIcon_${codeName}.png`}
                      className="object-contain rounded-t-lg bg-primary-darker aspect-square"
                    />
                  </div>
                  <p
                    className={classNames(
                      'w-full px-2 py-1 text-center truncate bg-primary',
                      owned ? 'opacity-100' : 'opacity-30'
                    )}
                  >
                    {item.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
        <CharDetail />
      </div>
    </div>
  )
})
