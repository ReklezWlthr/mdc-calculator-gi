import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { BuildBlock } from '../components/build_block'
import { WeaponBlock } from '../components/weapon_block'
import { useMemo, useState } from 'react'
import { ArtifactBlock } from '../components/artifact_block'
import { findCharacter, findWeapon } from '@src/core/utils/finder'
import { Characters } from '@src/data/db/genshin/characters'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import classNames from 'classnames'
import { ConsCircle, ElementIconColor, TooltipBody } from '../components/cons_circle'
import conditionals, { UtilTalentOverride } from '@src/data/lib/stats/conditionals/conditionals'
import { A1Icon, A4Icon } from '../ascension_icons'
import { Tooltip } from '@src/presentation/components/tooltip'
import Image from 'next/image'

export const MyCharacters = observer(() => {
  const { teamStore, modalStore, charStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    element: [],
    weapon: [],
  })

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
  const [selected, setSelected] = useState('')
  const charData = findCharacter(selected)
  const charCond = _.find(conditionals, ['id', charData?.id])?.conditionals(
    0,
    0,
    { normal: 1, skill: 1, burst: 1 },
    teamStore.characters
  )

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 overflow-y-auto">
      <div className="flex w-full h-full gap-x-10">
        <div className="flex flex-col w-1/3 h-full gap-y-2 shrink-0">
          <p className="text-2xl font-bold text-white">My Characters</p>
          <div className="grid grid-cols-4 gap-4 rounded-lg hideScrollbar">
            {_.map(filteredChar, (item) => {
              return (
                <div
                  className={classNames(
                    'w-full text-xs text-white duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border',
                    'opacity-30'
                  )}
                  onClick={() => {
                    setSelected(item.id)
                    if (item.id !== selected) setLoading(true)
                  }}
                  key={item.name}
                >
                  <div className="relative">
                    <img
                      src={`https://cdn.wanderer.moe/genshin-impact/elements/${item.element.toLowerCase()}.png`}
                      className="absolute w-6 h-6 top-1 left-1"
                    />
                    <div className="absolute bg-primary-darker py-0.5 px-1.5 rounded-full right-1 bottom-0.5">
                      <RarityGauge rarity={item.rarity} isSpecial={item.region === 'Unknown'} />
                    </div>
                    <img
                      src={`https://enka.network/ui/UI_AvatarIcon_${item.codeName || 'PlayerGirl'}.png`}
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
          <div className="w-full text-white">
            <div className="flex w-full gap-2">
              <div className={classNames('items-center justify-center w-96 h-96', loading ? 'flex' : 'hidden')}>
                <i className="text-6xl animate-spin fa-solid fa-circle-notch text-gray" />
              </div>
              <Image
                src={`https://enka.network/ui/UI_Gacha_AvatarImg_${charData.codeName}.png`}
                className={classNames(
                  'object-cover rounded-full w-96 h-96 ring-4 bg-opacity-5',
                  ElementIconColor[charData?.element],
                  loading ? 'hidden' : 'block'
                )}
                alt={charData?.codeName}
                width={500}
                height={500}
                quality={90}
                loading="eager"
                onLoad={() => setLoading(false)}
              />
              <div className="w-full">
                <div className="flex flex-col items-end w-full px-20 pt-2">
                  <p className="text-3xl font-bold text-end">{charData.name}</p>
                  <div className="w-fit">
                    <RarityGauge rarity={charData?.rarity} textSize="text-2xl" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ConsCircle
                codeName={charData.codeName}
                talents={charCond?.talents}
                cons={0}
                element={charData.element}
                name={charData.constellation}
              />
              <div className="flex flex-col text-sm gap-y-5">
                <div className="flex items-center gap-3">
                  <A1Icon
                    codeName={charData.codeName}
                    talents={charCond?.talents}
                    ascension={0}
                    element={charData.element}
                  />
                  <p>{charCond?.talents?.a1?.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <A4Icon
                    codeName={charData.codeName}
                    talents={charCond?.talents}
                    ascension={0}
                    element={charData.element}
                  />
                  <p>{charCond?.talents?.a4?.title}</p>
                </div>
                {charCond?.talents?.util && (
                  <div className="flex items-center gap-3">
                    <Tooltip
                      title={charCond?.talents?.util?.title}
                      body={<TooltipBody talent={charCond?.talents?.util} unlocked />}
                      style="w-[40vw]"
                    >
                      <img
                        src={`https://enka.network/ui/UI_Talent_${
                          UtilTalentOverride[charData.codeName] || `S_${charData.codeName}_07`
                        }.png`}
                        className={classNames(
                          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                          ElementIconColor[charData?.element]
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
                      style="w-[40vw]"
                    >
                      <img
                        src={`https://enka.network/ui/Skill_S_${charData.codeName}_02.png`}
                        className={classNames(
                          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                          ElementIconColor[charData?.element]
                        )}
                      />
                    </Tooltip>
                    <p>Alternative Sprint: {charCond?.talents?.sprint?.title}</p>
                  </div>
                )}
                {charData?.id === '10000054' && (
                  <div className="flex items-center gap-3">
                    <Tooltip
                      title={charCond?.talents?.util?.title}
                      body={<TooltipBody talent={charCond?.talents?.util} unlocked />}
                      style="w-[40vw]"
                    >
                      <img
                        src={`https://enka.network/ui/UI_Talent_S_Kokomi_07.png`}
                        className={classNames(
                          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                          ElementIconColor[charData?.element]
                        )}
                      />
                    </Tooltip>
                    <p>{charCond?.talents?.util?.title}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[620px] rounded-lg bg-primary-darker flex items-center justify-center text-gray text-2xl font-bold">
            Selected a Character to Preview
          </div>
        )}
      </div>
    </div>
  )
})
