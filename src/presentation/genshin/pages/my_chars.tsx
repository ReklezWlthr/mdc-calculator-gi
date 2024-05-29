import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { useCallback, useMemo, useState } from 'react'
import { findCharacter } from '@src/core/utils/finder'
import { Characters } from '@src/data/db/genshin/characters'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import classNames from 'classnames'
import { ConsCircle, ElementIconColor, TooltipBody } from '../components/cons_circle'
import conditionals, { UtilTalentOverride } from '@src/data/lib/stats/conditionals/conditionals'
import { A1Icon, A4Icon } from '../components/ascension_icons'
import { Tooltip } from '@src/presentation/components/tooltip'
import { findBaseLevel, findMaxLevel, getBaseStat } from '@src/core/utils/data_format'
import { AscensionGrowth } from '@src/domain/genshin/scaling'
import {
  AscensionOptions,
  ConstellationOptions,
  Stats,
  TravelerIconName,
  WeaponIcon,
} from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { TalentIcon } from '../components/tables/scaling_wrapper'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { PrimaryButton } from '@src/presentation/components/primary.button'

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
  }))

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
        <div className="flex flex-col w-1/3 h-full gap-y-2 shrink-0">
          <p className="text-2xl font-bold text-white">My Characters</p>
          <div className="grid grid-cols-4 gap-4 rounded-lg hideScrollbar">
            {_.map(filteredChar, (item) => {
              const owned = _.includes(_.map(charStore.characters, 'cId'), item.id)
              const codeName = item.codeName === 'Player' ? settingStore.settings.travelerGender : item.codeName
              return (
                <div
                  className={classNames(
                    'w-full text-xs text-white duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border hover:scale-95',
                    owned ? 'opacity-100' : 'opacity-30'
                  )}
                  onClick={() => {
                    charStore.setValue('selected', item.id)
                    setEdit(false)
                    resetForm()
                    if (item.id !== selected) setLoading(true)
                  }}
                  key={item.name}
                >
                  <div className="relative">
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
        {selected ? (
          <div className="w-full h-full p-2 text-white hideScrollbar">
            <div className="flex w-full gap-2">
              <div
                className={classNames(
                  'items-center justify-center w-1/2 aspect-square shrink-0',
                  loading ? 'flex' : 'hidden'
                )}
              >
                <i className="text-6xl animate-spin fa-solid fa-circle-notch text-gray" />
              </div>
              <img
                src={`https://enka.network/ui/UI_Gacha_AvatarImg_${fCodeName}.png`}
                className={classNames(
                  'object-cover rounded-full w-1/2 h-fit aspect-square bg-opacity-5 shrink-0',
                  ElementIconColor[charData?.element],
                  loading ? 'hidden' : 'block'
                )}
                alt={fCodeName}
                loading="eager"
                onLoad={() => setLoading(false)}
              />
              <div className="w-full">
                <div className="flex flex-col items-end w-full pt-2 pr-10 text-sm gap-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-end w-full">
                      <p className="text-5xl font-bold text-end">{charData.name}</p>
                      <div className="w-fit">
                        <RarityGauge rarity={charData?.rarity} textSize="text-2xl" />
                      </div>
                    </div>
                    {charUpgrade && (
                      <p className="px-2 py-0.5 text-lg font-bold rounded-lg bg-primary">{`C${charUpgrade.cons}`}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {charUpgrade && (
                      <p className="px-2 py-0.5 text-base font-bold rounded-lg bg-primary">{`Lvl ${charUpgrade.level}`}</p>
                    )}
                    <div className="flex gap-0.5">
                      <div className="p-1 rounded-full w-14 h-14 bg-primary" title={charData?.weapon}>
                        <img src={`https://enka.network/ui/${WeaponIcon[charData?.weapon]}`} />
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      <div className="p-2 rounded-full w-14 h-14 bg-primary" title={charData?.element}>
                        <img
                          src={`https://cdn.wanderer.moe/genshin-impact/elements/${charData?.element?.toLowerCase()}.png`}
                        />
                      </div>
                    </div>
                    <i
                      className={classNames(
                        'flex items-center justify-center w-12 h-12 text-xl duration-200 rounded-full cursor-pointer fa-solid hover:bg-primary-light shrink-0 text-gray',
                        edit ? 'fa-times' : 'fa-pen'
                      )}
                      title="Edit Character"
                      onClick={() => {
                        setEdit((prev) => !prev)
                        resetForm()
                      }}
                    />
                  </div>
                  {edit ? (
                    <div className="w-4/5 px-4 py-2 space-y-2 border rounded-lg bg-primary-dark border-primary-border">
                      <p className="text-base font-bold">Edit Character</p>
                      <div className="flex items-center w-full gap-2">
                        <p>Level</p>
                        <SelectInput
                          onChange={(value) => setForm({ level: parseInt(value) })}
                          options={_.map(
                            Array(findMaxLevel(form.ascension) - findBaseLevel(form.ascension) + 1 || 1).fill(
                              findBaseLevel(form.ascension)
                            ),
                            (item, index) => ({
                              name: _.toString(item + index),
                              value: _.toString(item + index),
                            })
                          )}
                          value={form.level?.toString()}
                          style="w-full"
                        />
                        <SelectInput
                          onChange={(value) => {
                            const max = _.max([1, (parseInt(value) - 1) * 2])
                            setForm({ ascension: parseInt(value), level: findBaseLevel(parseInt(value) || 0) })
                            if (form.normal > max) setForm({ normal: max })
                            if (form.skill > max) setForm({ skill: max })
                            if (form.burst > max) setForm({ burst: max })
                          }}
                          options={AscensionOptions}
                          value={form.ascension?.toString()}
                          style="w-fit"
                        />
                        <SelectInput
                          onChange={(value) => setForm({ cons: parseInt(value) })}
                          options={ConstellationOptions}
                          value={form.cons?.toString()}
                          style="w-fit"
                          disabled={charData?.id === '10000062'}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p>Normal Attack: </p>
                        <SelectInput
                          value={form.normal?.toString()}
                          onChange={(value) => setForm({ normal: parseInt(value) })}
                          options={talentLevels}
                          style="w-14"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p>Elemental Skill: </p>
                        <SelectInput
                          value={form.skill?.toString()}
                          onChange={(value) => setForm({ skill: parseInt(value) })}
                          options={talentLevels}
                          style="w-14"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p>Elemental Burst: </p>
                        <SelectInput
                          value={form.burst?.toString()}
                          onChange={(value) => setForm({ burst: parseInt(value) })}
                          options={talentLevels}
                          style="w-14"
                        />
                      </div>
                      <div className="flex justify-end w-full">
                        <PrimaryButton onClick={onSave} title="Save" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-4/5 px-4 py-3 space-y-2 rounded-lg bg-primary-dark">
                        <div className="grid grid-cols-3 gap-3">
                          <p className="col-span-2 font-bold">Base HP</p>
                          <p className="text-center text-gray">{_.round(baseHp).toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <p className="col-span-2 font-bold">Base ATK</p>
                          <p className="text-center text-gray">{_.round(baseAtk).toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <p className="col-span-2 font-bold">Base DEF</p>
                          <p className="text-center text-gray">{_.round(baseDef).toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <p className="col-span-2 font-bold">{charData?.stat?.ascStat}</p>
                          <p className="text-center text-gray">
                            {charData?.stat?.ascStat === Stats.EM ? asc.toLocaleString() : toPercentage(asc)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className="font-bold">Talents</p>
                        <div className="relative space-y-2">
                          <TalentIcon
                            talent={charCond?.talents?.normal}
                            element={charData?.element}
                            icon={`https://enka.network/ui${WeaponIcon[charData?.weapon]}`}
                            size="w-10 h-10"
                            tooltipSize="w-[520px]"
                          />
                          {charUpgrade?.talents?.normal && (
                            <div
                              className={classNames(
                                'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-1 -right-3 text-white',
                                charCond?.upgrade?.normal ? 'bg-cyan-600' : 'bg-primary-light'
                              )}
                            >
                              {charUpgrade?.talents?.normal + (charCond?.upgrade?.normal ? 3 : 0)}
                            </div>
                          )}
                        </div>
                        <div className="relative space-y-2">
                          <TalentIcon
                            talent={charCond?.talents?.skill}
                            element={charData?.element}
                            icon={`https://enka.network/ui/Skill_${
                              iconCodeName === 'PlayerGrass' ? 'E' : 'S'
                            }_${iconCodeName}${iconCodeName === 'Qin' ? '_02' : '_01'}${
                              iconCodeName === 'Diluc' ? '_01' : ''
                            }.png`}
                            size="w-10 h-10"
                            tooltipSize="w-[570px]"
                          />
                          {charUpgrade?.talents?.skill && (
                            <div
                              className={classNames(
                                'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-1 -right-3 text-white',
                                charCond?.upgrade?.skill ? 'bg-cyan-600' : 'bg-primary-light'
                              )}
                            >
                              {charUpgrade?.talents?.skill + (charCond?.upgrade?.skill ? 3 : 0)}
                            </div>
                          )}
                        </div>
                        <div className="relative space-y-2">
                          <TalentIcon
                            talent={charCond?.talents?.burst}
                            element={charData?.element}
                            icon={`https://enka.network/ui/Skill_${
                              iconCodeName === 'PlayerGrass' ? 'S' : 'E'
                            }_${iconCodeName}${_.includes(['Ayaka', 'Ambor'], iconCodeName) ? '' : '_01'}.png`}
                            size="w-10 h-10"
                            tooltipSize="w-[550px]"
                          />
                          {charUpgrade?.talents?.burst && (
                            <div
                              className={classNames(
                                'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-1 -right-3 text-white',
                                charCond?.upgrade?.burst ? 'bg-cyan-600' : 'bg-primary-light'
                              )}
                            >
                              {charUpgrade?.talents?.burst + (charCond?.upgrade?.burst ? 3 : 0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="my-5 text-xl font-bold">✦ Constellations & Passives ✦</p>
            <div className="flex items-center gap-4">
              <ConsCircle
                codeName={iconCodeName}
                talents={charCond?.talents}
                cons={charUpgrade?.cons}
                element={charData.element}
                name={charData.constellation}
              />
              <div className="flex flex-col text-sm gap-y-5">
                <div className="flex items-center gap-3">
                  <A1Icon
                    codeName={iconCodeName}
                    talents={charCond?.talents}
                    ascension={charUpgrade?.ascension}
                    element={charData.element}
                  />
                  <p>{charCond?.talents?.a1?.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <A4Icon
                    codeName={iconCodeName}
                    talents={charCond?.talents}
                    ascension={charUpgrade?.ascension}
                    element={charData.element}
                  />
                  <p>{charCond?.talents?.a4?.title}</p>
                </div>
                {charCond?.talents?.util && (
                  <div className="flex items-center gap-3">
                    <Tooltip
                      title={charCond?.talents?.util?.title}
                      body={<TooltipBody talent={charCond?.talents?.util} unlocked />}
                      style="w-[25vw]"
                    >
                      <img
                        src={`https://enka.network/ui/UI_Talent_${
                          UtilTalentOverride[charData.codeName] || `S_${charData.codeName}_07`
                        }.png`}
                        className={classNames(
                          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                          charUpgrade
                            ? ElementIconColor[charData?.element]
                            : 'bg-primary-light ring-primary-lighter opacity-50'
                        )}
                      />
                    </Tooltip>
                    <p>Utility: {charCond?.talents?.util?.title}</p>
                  </div>
                )}
                {charCond?.talents?.sprint && (
                  <div className="flex items-center gap-3">
                    <Tooltip
                      title={charCond?.talents?.sprint?.title}
                      body={<TooltipBody talent={charCond?.talents?.sprint} unlocked />}
                      style="w-[25vw]"
                    >
                      <img
                        src={`https://enka.network/ui/Skill_S_${charData.codeName}_02.png`}
                        className={classNames(
                          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                          charUpgrade
                            ? ElementIconColor[charData?.element]
                            : 'bg-primary-light ring-primary-lighter opacity-50'
                        )}
                      />
                    </Tooltip>
                    <p>Alternative Sprint: {charCond?.talents?.sprint?.title}</p>
                  </div>
                )}
                {charData?.id === '10000054' && (
                  <div className="flex items-center gap-3">
                    <Tooltip
                      title={charCond?.talents?.bonus?.title}
                      body={<TooltipBody talent={charCond?.talents?.bonus} unlocked />}
                      style="w-[25vw]"
                    >
                      <img
                        src={`https://enka.network/ui/UI_Talent_S_Kokomi_07.png`}
                        className={classNames(
                          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                          ElementIconColor[charData?.element]
                        )}
                      />
                    </Tooltip>
                    <p>{charCond?.talents?.bonus?.title}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-2xl font-bold rounded-lg bg-primary-darker text-gray">
            Selected a Character to Preview
          </div>
        )}
      </div>
    </div>
  )
})
