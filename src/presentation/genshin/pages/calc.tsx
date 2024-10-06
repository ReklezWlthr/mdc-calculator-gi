import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { Stats, TravelerIconName, WeaponIcon } from '@src/domain/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { ElementColor, ScalingSubRows } from '../components/tables/scaling_sub_rows'
import { ScalingWrapper } from '../components/tables/scaling_wrapper'
import { StatBlock } from '../components/stat_block'
import { CharacterSelect } from '../components/character_select'
import { ConsCircle } from '../components/cons_circle'
import { ConditionalBlock } from '../components/conditional_block'
import classNames from 'classnames'
import { Tooltip } from '@src/presentation/components/tooltip'
import { AscensionIcons } from '../components/ascension_icons'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { EnemyModal } from '../components/enemy_modal'
import { ReactionTooltip } from '../components/tables/reaction_tooltip'
import { WeaponConditionalBlock } from '../components/weapon_conditional_block'
import { useCalculator } from '@src/core/hooks/useCalculator'
import { CrystallizeTooltip } from '../components/tables/crystallize_tooltip'
import { CustomConditionalBlock } from '../components/custom_conditional_block'
import { StatsModal } from '../components/stats_modal'

export const Calculator = observer(({}: {}) => {
  const { teamStore, modalStore, calculatorStore, settingStore } = useStore()
  const { selected, computedStats } = calculatorStore

  const [tab, setTab] = useState('mod')

  const char = teamStore.characters[selected]
  const charData = findCharacter(char.cId)

  const { main, mainComputed, contents, transformative, finalStats } = useCalculator({})

  const onOpenEnemyModal = useCallback(() => modalStore.openModal(<EnemyModal />), [])

  const iconCodeName = charData?.codeName === 'Player' ? TravelerIconName[charData.element] : charData?.codeName

  const onOpenStatsModal = useCallback(
    () => modalStore.openModal(<StatsModal stats={mainComputed} weapon={charData.weapon} />),
    [mainComputed, charData, finalStats]
  )

  return (
    <div className="w-full overflow-y-auto">
      <div className="grid w-full grid-cols-3 gap-5 p-5 text-white max-w-[1240px] mx-auto">
        <div className="col-span-2">
          <div className="flex items-center">
            <div className="flex justify-center w-full gap-4 pt-1 pb-3">
              {_.map(teamStore?.characters, (item, index) => {
                const x = findCharacter(item.cId)?.codeName
                const y = x === 'Player' ? settingStore.settings.travelerGender : x
                return (
                  <CharacterSelect
                    key={`char_select_${index}`}
                    onClick={() => calculatorStore.setValue('selected', index)}
                    isSelected={index === selected}
                    codeName={y}
                  />
                )
              })}
            </div>
            <PrimaryButton onClick={onOpenEnemyModal} title="Enemy Setting" style="whitespace-nowrap" />
          </div>
          {teamStore?.characters[selected]?.cId ? (
            <>
              <div className="flex flex-col mb-5 text-sm rounded-lg bg-primary-darker h-fit">
                <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">
                  Damage Calculation
                </p>
                <div className="flex justify-end w-full mb-1.5 bg-primary-dark">
                  <div className="grid w-4/5 grid-cols-8 gap-2 py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark">
                    <p className="col-span-2">Property</p>
                    <p className="col-span-1">Element</p>
                    <p className="col-span-1">Base</p>
                    <p className="col-span-1">CRIT</p>
                    <p className="col-span-1">Average</p>
                    <p className="col-span-2">DMG Component</p>
                  </div>
                </div>
                <ScalingWrapper
                  talent={main?.talents?.normal}
                  element={charData.element}
                  level={char.talents?.normal}
                  upgraded={main?.upgrade?.normal}
                  childeBuff={_.includes(_.map(teamStore.characters, 'cId'), '10000033')}
                >
                  <div className="space-y-0.5">
                    {_.map(mainComputed?.BASIC_SCALING, (item) => (
                      <ScalingSubRows key={item.name} scaling={item} />
                    ))}
                  </div>
                  <div className="py-2 space-y-0.5">
                    {_.map(mainComputed?.CHARGE_SCALING, (item) => (
                      <ScalingSubRows key={item.name} scaling={item} />
                    ))}
                  </div>
                  <div className="space-y-0.5">
                    {_.map(mainComputed?.PLUNGE_SCALING, (item) => (
                      <ScalingSubRows key={item.name} scaling={item} />
                    ))}
                  </div>
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper
                  talent={main?.talents?.skill}
                  element={charData.element}
                  level={char.talents?.skill}
                  upgraded={main?.upgrade?.skill}
                >
                  {_.map(mainComputed?.SKILL_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper
                  talent={main?.talents?.burst}
                  element={charData.element}
                  level={char.talents?.burst}
                  upgraded={main?.upgrade?.burst}
                >
                  {_.map(mainComputed?.BURST_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
              </div>
              <div className="grid grid-cols-3 gap-x-3">
                <div className="flex flex-col col-span-2 text-sm rounded-lg bg-primary-darker h-fit">
                  <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">
                    Transformative Reactions
                  </p>
                  <div className="grid w-full grid-cols-9 gap-2 py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark items-center">
                    <p className="col-span-3">Reaction</p>
                    <p className="col-span-2">Element</p>
                    <p className="col-span-2">Base</p>
                    <div className="flex items-center justify-center col-span-2 gap-2 text-start">
                      <p>Amplified</p>
                      <Tooltip
                        title="Amplified Reaction"
                        body={
                          <div className="space-y-1 font-normal text-start">
                            <p>
                              For Swirl Reactions, this represents the <b className="text-genshin-anemo">Swirl DMG</b>{' '}
                              amplified by either Vaporize, Melt or Aggravate Reaction.
                            </p>
                            <p>
                              For Bloom-related Reactions, this represents the{' '}
                              <b className="text-genshin-dendro">Dendro Core</b>
                              's Crit DMG caused by Nahida's C2.
                            </p>
                            <p>Burning Reactions can be affected by both.</p>
                          </div>
                        }
                        style="w-[400px]"
                      >
                        <i className="text-sm fa-regular fa-question-circle" />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="py-1 rounded-b-lg bg-primary-darker">
                    {_.map(transformative, (item) => {
                      const base = item.base * item.mult * (1 + item.emBonus + item.dmg)
                      return (
                        <div className="grid w-full grid-cols-9 gap-2 py-0.5 pr-2 text-sm text-center" key={item.name}>
                          <p className="col-span-3 font-bold">{item.name}</p>
                          <p className={classNames('col-span-2', ElementColor[item.element])}>{item.element}</p>
                          <div className="col-span-2 text-start">
                            <ReactionTooltip {...item} />
                          </div>
                          <p
                            className={classNames('col-span-2', {
                              'font-bold text-desc': item.amp > 1 || item.add || item.cd,
                            })}
                          >
                            {item.amp > 1 || item.add || item.cd
                              ? _.round((base + item.add) * (1 + item.cd) * item.amp)
                              : '-'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-col col-span-1 text-sm rounded-lg bg-primary-darker h-fit">
                  <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">Crystallize</p>
                  <div className="grid w-full py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark items-center">
                    Raw Shield Value
                  </div>
                  <div className="flex justify-center py-1 rounded-b-lg bg-primary-darker">
                    <CrystallizeTooltip
                      em={mainComputed?.getValue(Stats.EM)}
                      level={char?.level}
                      shieldStrength={mainComputed?.getValue(Stats.SHIELD)}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full text-xl rounded-lg h-[66vh] bg-primary-darker">
              No Character Selected
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-full gap-3">
          <div className="flex gap-5">
            <div
              className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                'bg-primary': tab === 'mod',
              })}
              onClick={() => setTab('mod')}
            >
              Modifiers
            </div>
            <div
              className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                'bg-primary': tab === 'stats',
              })}
              onClick={() => setTab('stats')}
            >
              Stats
            </div>
          </div>
          {tab === 'mod' && (
            <>
              <ConditionalBlock
                title="Elemental Reactions"
                contents={_.filter(contents.reaction, 'show')}
                tooltipStyle="w-[20vw]"
              />
              <ConditionalBlock title="Self Conditionals" contents={_.filter(contents.main, 'show')} />
              <ConditionalBlock title="Team Conditionals" contents={_.filter(contents.team, 'show')} />
              <WeaponConditionalBlock contents={contents.weapon(selected)} index={selected} />
              <CustomConditionalBlock index={selected} />
            </>
          )}
          {charData && tab === 'stats' && (
            <>
              <div className="flex items-center justify-between w-full">
                <p className="px-4 text-lg font-bold">
                  <span className="text-desc">✦</span> Final Stats <span className="text-desc">✦</span>
                </p>
                <PrimaryButton title="Stats Breakdown" onClick={onOpenStatsModal} />
              </div>
              <StatBlock index={selected} stat={computedStats[selected]} />
              <div className="w-[252px]">
                <AscensionIcons
                  talents={main?.talents}
                  codeName={iconCodeName}
                  element={charData.element}
                  stats={computedStats[selected]}
                  ascension={char.ascension}
                />
              </div>
              <ConsCircle
                talents={main?.talents}
                codeName={charData.codeName}
                element={charData.element}
                name={charData.constellation}
                cons={char.cons}
                stats={computedStats[selected]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
})
