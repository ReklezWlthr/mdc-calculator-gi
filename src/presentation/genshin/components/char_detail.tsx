import { findBaseLevel, findMaxLevel, getBaseStat } from '@src/core/utils/data_format'
import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import _ from 'lodash'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'
import { TalentIcon } from './tables/scaling_wrapper'
import { StatIcons, Stats, TravelerIconName } from '@src/domain/constant'
import { useParams } from '@src/core/hooks/useParams'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { toPercentage } from '@src/core/utils/converter'
import { getElementImage, getWeaponImage } from '@src/core/utils/fetcher'
import { AscensionGrowth } from '@src/domain/scaling'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const CharDetail = observer(() => {
  const { charStore, settingStore, teamStore, modalStore } = useStore()
  const selected = charStore.selected
  const data = findCharacter(selected)
  const charUpgrade = _.find(charStore.characters, ['cId', selected])
  const cond = _.find(ConditionalsObject, ['id', charStore.selected])?.conditionals(
    charUpgrade?.cons || 0,
    charUpgrade?.ascension,
    charUpgrade?.talents || { normal: 1, skill: 1, burst: 1 },
    teamStore.characters
  )
  const talent = cond.talents

  const [loading, setLoading] = useState(true)

  const { params, setParams } = useParams({ asc: 7 })

  useEffect(() => {
    setLoading(true)
    const elms = document.getElementsByClassName('cons')
    _.forEach(elms, (elm: HTMLImageElement) => (elm.style.display = 'none'))
    document.getElementById('detail_container').scrollTo(0, 0)
  }, [charStore.selected])

  const onCalcSlider = useCallback(() => {
    const range = document.getElementsByClassName('slider')
    if (range) {
      _.forEach(range, (elm: HTMLInputElement) => {
        const bg = getComputedStyle(elm).getPropertyValue('--tw-gradient-to')
        const slider = getComputedStyle(elm).getPropertyValue('--tw-gradient-from')
        const min = Number(elm.min)
        const max = Number(elm.max) - min
        const value = ((Number(elm.value) - min) / max) * 100
        elm.setAttribute('style', `background:linear-gradient(to right,${slider},${slider} ${value}%,${bg} ${value}%)`)
      })
    }
  }, [])

  useEffect(() => {
    onCalcSlider()
  }, [params, talent])

  const consImage = {
    B: 'Normal',
    S: 'BP',
    U: 'Ultra',
    T: 'Passive',
  }

  // const id = formatIdIcon(selected, settingStore.settings?.travelerGender)
  const baseLevel = params.asc === 7 ? 80 : findBaseLevel(params.asc)
  const asc = _.min([params.asc, 6])
  const ascStat = _.max([0, asc - 2]) * AscensionGrowth[data?.stat?.ascStat]?.[data?.rarity - 4]

  const iconCodeName = data?.codeName === 'Player' ? TravelerIconName[data.element] : data?.codeName
  const fCodeName = data?.codeName === 'Player' ? settingStore.settings.travelerGender : data?.codeName

  // const onOpenEditModal = useCallback(
  //   () => modalStore.openModal(<CharDetailModal char={charUpgrade} cId={selected} />),
  //   [charUpgrade, charStore.selected]
  // )

  return (
    <div className="w-full h-full py-2 pr-5 ml-2 text-white customScrollbar" id="detail_container">
      <div className="flex">
        <div className="relative w-2/3 aspect-square">
          <div
            className={classNames(
              'items-center justify-center w-full h-full aspect-square shrink-0',
              loading ? 'flex' : 'hidden'
            )}
          >
            <i className="text-6xl animate-spin fa-solid fa-circle-notch text-gray" />
          </div>
          <img
            src={`https://homdgcat.wiki/homdgcat-res/Gacha/UI_Gacha_AvatarImg_${fCodeName}.png`}
            className={loading ? 'hidden' : 'block h-full object-cover overflow-visible -z-10 relative object-[35%]'}
            onLoad={() => setLoading(false)}
          />
          <div className="absolute top-0 left-0 w-full h-full from-primary-bg bg-gradient-to-r via-10% via-transparent" />
          <div className="absolute top-0 left-0 w-[150%] h-full from-primary-bg bg-gradient-to-t via-20% via-transparent overflow-visible" />
          <div className="absolute left-0 flex flex-col space-y-1 bottom-10">
            <div className="flex gap-4">
              <img
                src={getElementImage(data.element)}
                className="w-10 h-10 p-1 bg-opacity-75 rounded-full shrink-0 bg-primary-bg"
              />
              <img
                src={getWeaponImage(data.weapon)}
                className="w-10 h-10 p-1 bg-opacity-75 rounded-full shrink-0 bg-primary-bg"
              />
            </div>
            <p className="px-3 py-2 text-3xl font-semibold text-center break-words bg-opacity-75 rounded-lg bg-primary-bg">
              {data.name}
            </p>
            <div className="ml-3 w-fit">
              <RarityGauge rarity={data.rarity} textSize="text-xl" />
            </div>
          </div>
        </div>
        <div className="w-1/3 px-3 space-y-3">
          <div>
            <p className="font-bold">Base Stats</p>
            <input
              type="range"
              className="w-full h-2 slider bg-gradient-to-r from-primary-lighter to-gray shrink-0"
              step={1}
              min="0"
              max="6"
              value={params.asc}
              onChange={(e) => {
                const value = Number(e.target.value)
                setParams({ asc: value })
              }}
            />
            <div className="flex justify-between pl-2 text-xs text-gray">
              {_.map(Array(6), (_item, index) => (
                <p key={index}>{findBaseLevel(index)}</p>
              ))}
              <p>80</p>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-2 px-5 py-3 text-xs rounded-lg bg-opacity-80 bg-primary-dark">
            <img
              src={`${publicRuntimeConfig.BASE_PATH}/icons/cons/${data?.constellation?.replaceAll(
                ' ',
                '_'
              )}_Shape.webp`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 h-[170px] top-1/2 left-1/2 saturate-0 brightness-150"
              onError={(e) => (e.currentTarget.style.display = 'none')}
              onLoad={(e) => (e.currentTarget.style.display = 'block')}
            />
            <b>Base HP</b>
            <p className="text-center">
              {_.round(
                getBaseStat(data?.stat?.baseHp, baseLevel, data?.stat?.ascHp, charUpgrade?.ascension, data?.rarity)
              ).toLocaleString()}
            </p>
            <b>Base ATK</b>
            <p className="text-center">
              {_.round(
                getBaseStat(data?.stat?.baseAtk, baseLevel, data?.stat?.ascAtk, charUpgrade?.ascension, data?.rarity)
              ).toLocaleString()}
            </p>
            <b>Base DEF</b>
            <p className="text-center">
              {_.round(
                getBaseStat(data?.stat?.baseDef, baseLevel, data?.stat?.ascDef, charUpgrade?.ascension, data?.rarity)
              ).toLocaleString()}
            </p>
            <b>Max Energy</b>
            <p className="text-center">{data?.stat?.energy}</p>
            <b>{data?.stat?.ascStat}</b>
            <p className="text-center">{data?.stat?.ascStat === Stats.EM ? ascStat : toPercentage(ascStat)}</p>
            <b>Nation</b>
            <p className="text-center">{data?.region}</p>
            <b>Constellation</b>
            <p className="text-center">{data?.constellation}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 rounded-lg bg-opacity-80 bg-primary-dark">
              <p className="font-bold">Account Data</p>
              <p className="text-[10px] font-normal text-gray">Will be used as Default Data</p>
            </div>
            <PrimaryButton title="Edit" onClick={() => {}} />
          </div>
          <div className="px-5 py-3 rounded-lg bg-primary-darker bg-opacity-80">
            {charUpgrade ? (
              <div className="text-xs">
                <div className="flex justify-around">
                  <p>
                    Level{' '}
                    <span className="text-desc">
                      {charUpgrade.level}/{findMaxLevel(charUpgrade.ascension)}
                    </span>
                  </p>
                  <p>
                    Constellation <span className="text-desc">{charUpgrade.cons}</span>
                  </p>
                </div>
                <p className="py-1.5 font-bold text-center">Talents</p>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-3 space-y-1">
                    <div className="flex justify-between">
                      <p>Basic ATK</p>
                      <p className={cond.upgrade?.normal ? 'text-blue' : 'text-desc'}>
                        {charUpgrade.talents?.normal + (cond.upgrade?.normal ? 3 : 0)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Skill</p>
                      <p className={cond.upgrade?.skill ? 'text-blue' : 'text-desc'}>
                        {charUpgrade.talents?.skill + (cond.upgrade?.skill ? 3 : 0)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Ultimate</p>
                      <p className={cond.upgrade?.burst ? 'text-blue' : 'text-desc'}>
                        {charUpgrade.talents?.burst + (cond.upgrade?.burst ? 3 : 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray">Not Owned</p>
            )}
          </div>
        </div>
      </div>
      <p className="flex justify-center gap-2 mt-5 mb-1 text-2xl font-bold">
        <span className="text-desc">✦</span> Talents <span className="text-desc">✦</span>
      </p>
      <div className="grid gap-6 ml-2">
        {_.map(_.omit(talent, 'a1', 'a4', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6'), (item) => {
          return (
            item && (
              <div className="flex gap-x-3" key={item.trace}>
                <TalentIcon element={data.element} talent={item} size="w-10 h-10 mt-1" hideTip />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-normal text-primary-lighter">{item.trace}</p>
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex gap-1 text-xs opacity-80">
                        {!!item.tag && <p className="text-desc">[{item.tag}]</p>}
                      </div>
                    </div>
                    {/* {item.trace !== TalentType.TECH && (
                      <div className="flex items-center justify-end w-1/3 gap-2 pr-4">
                        <p className="text-xs">
                          Level: <span className="text-desc">{params[baseType]}</span>
                        </p>
                        <input
                          type="range"
                          className="slider h-[8px] bg-gradient-to-r from-primary-lighter to-gray shrink-0"
                          step={1}
                          min="1"
                          max={_.includes(item.trace, TalentType.BA) ? 7 : 12}
                          value={params[baseType]}
                          onChange={(e) => {
                            const value = Number(e.target.value)
                            setParams({ [baseType]: value })
                          }}
                        />
                      </div>
                    )} */}
                  </div>
                  <p
                    className="pt-1.5 text-[13px] font-normal text-gray"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            )
          )
        })}
        <p className="flex justify-center gap-2 mb-1 text-2xl font-bold">
          <span className="text-desc">✦</span> Ascension Passives <span className="text-desc">✦</span>
        </p>
        <div className="flex flex-col gap-5">
          {_.map([talent.a1, talent.a4], (item) => (
            <div className="flex gap-x-3" key={item.trace}>
              <TalentIcon element={data.element} talent={item} size="w-10 h-10" hideTip />
              <div>
                <p className="text-sm font-normal text-primary-lighter">{item?.trace}</p>
                <p className="font-semibold">{item.title}</p>
                <p
                  className="pt-1.5 text-[13px] font-normal text-gray"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="flex justify-center gap-2 mb-1 text-2xl font-bold">
          <span className="text-desc">✦</span> Constellations <span className="text-desc">✦</span>
        </p>
        <div className="flex flex-col gap-5">
          {_.map([talent.c1, talent.c2, talent.c3, talent.c4, talent.c5, talent.c6], (item, i) => (
            <div className="flex gap-x-3" key={item.trace}>
              <div className="flex gap-3">
                <TalentIcon element={data.element} talent={item} size="w-10 h-10" hideTip />
                <div>
                  <p className="text-sm font-normal text-primary-lighter">{item.trace}</p>
                  <p className="font-semibold">{item.title}</p>
                  <p
                    className="pt-1.5 text-[13px] font-normal text-gray"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
