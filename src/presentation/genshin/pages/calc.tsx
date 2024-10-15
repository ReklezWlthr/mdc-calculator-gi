import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { Element, Stats, TravelerIconName, WeaponIcon } from '@src/domain/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { ScalingSubRows } from '../components/tables/scaling_sub_rows'
import { ScalingWrapper } from '../components/tables/scaling_wrapper'
import { StatBlock } from '../components/stat_block'
import { CharacterSelect } from '../components/character_select'
import { ConsCircle } from '../components/cons_circle'
import { ConditionalBlock } from '../components/conditionals/conditional_block'
import classNames from 'classnames'
import { Tooltip } from '@src/presentation/components/tooltip'
import { AscensionIcons } from '../components/ascension_icons'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { EnemyModal } from '../components/modals/enemy_modal'
import { ReactionTooltip } from '../components/tables/reaction_tooltip'
import { WeaponConditionalBlock } from '../components/conditionals/weapon_conditional_block'
import { useCalculator } from '@src/core/hooks/useCalculator'
import { CrystallizeTooltip } from '../components/tables/crystallize_tooltip'
import { CustomConditionalBlock } from '../components/conditionals/custom_conditional_block'
import { StatsModal } from '../components/modals/stats_modal'
import { ElementColor } from '@src/core/utils/damageStringConstruct'
import { BaseReactionDmg } from '@src/domain/scaling'
import { SelectInput } from '@src/presentation/components/inputs/select_input'

export const Calculator = observer(({}: {}) => {
  const { teamStore, modalStore, calculatorStore, settingStore } = useStore()
  const { selected, computedStats } = calculatorStore

  const [tab, setTab] = useState('mod')

  const char = teamStore.characters[selected]
  const charData = findCharacter(char.cId)

  const { main, mainComputed, contents, transformative, finalStats } = useCalculator({})

  const onOpenEnemyModal = useCallback(() => modalStore.openModal(<EnemyModal stats={mainComputed} />), [mainComputed])

  const iconCodeName = charData?.codeName === 'Player' ? TravelerIconName[charData.element] : charData?.codeName

  const onOpenStatsModal = useCallback(
    () => modalStore.openModal(<StatsModal stats={mainComputed} weapon={charData.weapon} />),
    [mainComputed, charData, finalStats]
  )

  return (
    <div className="w-full overflow-y-auto">
      <div className="grid w-full grid-cols-3 gap-5 p-5 text-white max-w-[1200px] mx-auto">
        <div className="col-span-2">
          <div className="flex items-center">
            <div className="flex justify-center w-full gap-4 pt-1 pb-3">
              {_.map(teamStore?.characters, (item, index) => (
                <CharacterSelect
                  key={`char_select_${index}`}
                  onClick={() => calculatorStore.setValue('selected', index)}
                  isSelected={index === selected}
                  codeName={findCharacter(item.cId)?.codeName}
                />
              ))}
            </div>
            <PrimaryButton onClick={onOpenEnemyModal} title="Enemy Setting" style="whitespace-nowrap" />
          </div>
          {teamStore?.characters[selected]?.cId ? (
            <>
              <div className="flex flex-col mb-5 text-sm rounded-lg bg-primary-darker h-fit">
                <div className="flex items-center justify-between px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">
                  <div className="w-full" />
                  <p className="shrink-0">Damage Calculation</p>
                  <div className="flex items-center justify-end w-full gap-1">
                    <p className="text-sm font-semibold">Mode:</p>
                    <SelectInput
                      small
                      options={[
                        { name: 'Single-Hit', value: 'single' },
                        { name: 'Total DMG', value: 'total' },
                      ]}
                      onChange={(v) => calculatorStore.setValue('mode', v)}
                      value={calculatorStore.mode}
                      style="w-fit"
                      placeholder="Select Mode"
                    />
                  </div>
                </div>
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
                <div className="h-2" />
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
                            <p>
                              Finally, for Crystallize, this represents the shield's Absorption Value against its own{' '}
                              <b>Elemental Type</b>.
                            </p>
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
                      const base = BaseReactionDmg[char.level - 1] * item.mult * (1 + item.emBonus + item.dmg)
                      return (
                        <div className="grid w-full grid-cols-9 gap-2 py-0.5 pr-2 text-sm text-center" key={item.name}>
                          <div className="flex items-center justify-center w-full col-span-3 gap-2 font-bold">
                            <p>{item.name}</p>
                            {item.name === 'Shattered' && (
                              <div className="text-start">
                                <Tooltip
                                  title="Shatter Reaction"
                                  body={
                                    <div className="font-normal">
                                      Only Blunt attacks (e.g. Claymore attacks, most Plunging attacks, most{' '}
                                      <b className="text-genshin-geo">Geo</b> attacks, and explosions) can trigger
                                      Shatter Reaction. However, for simplicity's sake, this row will be shown on all
                                      characters, regardless of them having any Blunt attacks.
                                    </div>
                                  }
                                  style="w-[450px]"
                                >
                                  <i className="fa-regular fa-question-circle" />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                          <p className={classNames('col-span-2', ElementColor[item.element])}>{item.element}</p>
                          <div className="col-span-2 text-start">
                            <ReactionTooltip {...item} base={BaseReactionDmg[char.level - 1]} />
                          </div>
                          <p
                            className={classNames('col-span-2', {
                              'font-bold text-desc': item.amp > 1 || item.add || item.cd,
                            })}
                          >
                            {item.amp > 1 || item.add || item.cd
                              ? _.round((base + item.add) * (1 + item.cd) * item.amp).toLocaleString()
                              : '-'}
                          </p>
                        </div>
                      )
                    })}
                    {mainComputed?.ELEMENT === Element.GEO && (
                      <div className="grid w-full grid-cols-9 gap-2 py-0.5 pr-2 text-sm text-center">
                        <p className="col-span-3 font-bold">Crystallize</p>
                        <p className="col-span-2 text-indigo-300">Shield</p>
                        <div className="col-span-2 text-start">
                          <CrystallizeTooltip em={mainComputed?.getEM()} level={char?.level} onElement={false} />
                        </div>
                        <div className="col-span-2 text-start">
                          <CrystallizeTooltip em={mainComputed?.getEM()} level={char?.level} onElement={true} />
                        </div>
                      </div>
                    )}
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
              <WeaponConditionalBlock contents={contents.weapon(selected)} />
              <ConditionalBlock title="Artifact Modifiers" contents={contents.artifact(selected)} />
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
              <StatBlock stat={computedStats[selected]} />
              <div className="w-[252px] mt-2">
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
