import { useCalculator } from '@src/core/hooks/useCalculator'
import { StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import { useStore } from '@src/data/providers/app_store_provider'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { findCharacter } from '@src/core/utils/finder'
import { ScalingWrapper } from '@src/presentation/genshin/components/tables/scaling_wrapper'
import { CompareSubRows } from '@src/presentation/genshin/components/tables/compare_sub_row'
import { CompareConditionalBlock } from '@src/presentation/genshin/components/compare/compare_conditional_block'
import classNames from 'classnames'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { StatBlock } from '@src/presentation/genshin/components/stat_block'
import React, { useCallback } from 'react'
import { StatsModal } from '@src/presentation/genshin/components/modals/stats_modal'
import { CharacterSelect } from '../character_select'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { TalentProperty } from '@src/domain/constant'
import { CompareTotalRows } from '../tables/compare_total_row'
import { EnemyModal } from '../modals/enemy_modal'

export const CompareBlock = observer(() => {
  const { setupStore, modalStore } = useStore()

  const tab = setupStore.tab
  const team = [setupStore.main.char, ..._.map(setupStore.comparing, (item) => item?.char)]
  const [setupIndex, charIndex] = setupStore.selected
  const focusedChar = team[setupIndex][charIndex]

  const selected = _.findIndex(setupStore.main?.char, (item) => item?.cId === setupStore.mainChar)
  const selectedS1 = _.findIndex(setupStore.comparing[0]?.char, (item) => item.cId === setupStore.mainChar)
  const selectedS2 = _.findIndex(setupStore.comparing[1]?.char, (item) => item.cId === setupStore.mainChar)
  const selectedS3 = _.findIndex(setupStore.comparing[2]?.char, (item) => item.cId === setupStore.mainChar)
  const char = setupStore.main?.char?.[selected]
  const charData = findCharacter(setupStore.mainChar)
  const { finalStats, mainComputed, main, ...mainContent } = useCalculator({
    teamOverride: setupStore.main?.char,
    doNotSaveStats: true,
    formOverride: setupStore.forms[0],
    indexOverride: selected,
    customOverride: setupStore.custom[0],
    initFormFunction: (f) => setupStore.initForm(0, f),
  })
  const sub1 = useCalculator({
    teamOverride: setupStore.comparing[0]?.char,
    doNotSaveStats: true,
    formOverride: setupStore.forms[1],
    indexOverride: selectedS1,
    customOverride: setupStore.custom[1],
    initFormFunction: (f) => setupStore.initForm(1, f),
    enabled: !!setupStore.comparing[0]?.char,
  })
  const sub2 = useCalculator({
    teamOverride: setupStore.comparing[1]?.char,
    doNotSaveStats: true,
    formOverride: setupStore.forms[2],
    indexOverride: selectedS2,
    customOverride: setupStore.custom[2],
    initFormFunction: (f) => setupStore.initForm(2, f),
    enabled: !!setupStore.comparing[1]?.char,
  })
  const sub3 = useCalculator({
    teamOverride: setupStore.comparing[2]?.char,
    doNotSaveStats: true,
    formOverride: setupStore.forms[3],
    indexOverride: selectedS3,
    customOverride: setupStore.custom[3],
    initFormFunction: (f) => setupStore.initForm(3, f),
    enabled: !!setupStore.comparing[2]?.char,
  })

  const sumStats = [
    finalStats?.[selected],
    sub1.finalStats?.[selectedS1],
    sub2.finalStats?.[selectedS2],
    sub3.finalStats?.[selectedS3],
  ]
  const allStats = [finalStats, sub1.finalStats, sub2.finalStats, sub3.finalStats]
  const levels = [
    { level: _.map(setupStore.main?.char, 'level'), selected },
    { level: _.map(setupStore.comparing?.[0]?.char, 'level'), selected: selectedS1 },
    { level: _.map(setupStore.comparing?.[1]?.char, 'level'), selected: selectedS2 },
    { level: _.map(setupStore.comparing?.[2]?.char, 'level'), selected: selectedS3 },
  ]
  const contents = [mainContent.contents, sub1.contents, sub2.contents, sub3.contents]

  const getUniqueComponent = (key: string) =>
    _.filter(
      _.uniqBy(
        _.flatMap(sumStats, (f) => f?.[key]),
        (item) => item?.name
      )
    )

  const onOpenStatsModal = useCallback(
    () =>
      modalStore.openModal(
        <StatsModal compare stats={allStats[setupIndex][charIndex]} weapon={findCharacter(focusedChar.cId)?.weapon} />
      ),
    [allStats, charData]
  )
  const onOpenEnemyModal = useCallback(
    () => modalStore.openModal(<EnemyModal compare />),
    [allStats, setupIndex, charIndex]
  )

  const renderRow = (type: string, talent: TalentProperty) => (
    <div className="space-y-0.5">
      {_.map(getUniqueComponent(type), (item) => (
        <CompareSubRows
          key={item.name}
          scaling={_.map(
            _.map(sumStats, (f) => f?.[type]),
            (s) => _.find(s, (a) => a.name === item.name)
          )}
          stats={sumStats}
          allStats={allStats}
          level={levels}
          name={item.name}
          property={item.property}
          element={item.element}
          type={talent}
          setupNames={_.map([setupStore.main, ...setupStore.comparing], 'name')}
        />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-3 gap-4 px-5">
      {_.some(sumStats) && (
        <div className="flex flex-col col-span-2 mb-5 text-sm text-white h-fit">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p>Compare Mode</p>
              <SelectInput
                value={setupStore.mode}
                options={[
                  { name: 'Base', value: 'base' },
                  { name: 'CRIT', value: 'crit' },
                  { name: 'Average', value: 'avg' },
                  { name: 'Percentage Avg.', value: 'percent' },
                  { name: 'Absolute Avg.', value: 'abs' },
                ]}
                onChange={(v) => setupStore.setValue('mode', v)}
                style="w-[125px]"
              />
            </div>
            <PrimaryButton onClick={onOpenEnemyModal} title="Enemy Setting" style="whitespace-nowrap" />
          </div>
          <div className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">
            <p>Damage Comparison</p>
            {/* <p className='text-xs font-normal text-gray'>Hover Numbers for More Details</p> */}
          </div>
          <div className="flex justify-end w-full bg-primary-dark">
            <div className="grid w-4/5 grid-cols-9 gap-2 py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark">
              <p className="col-span-2">Property</p>
              <p className="col-span-1">Type</p>
              <p className="col-span-1">Main</p>
              <p className="col-span-1">Sub 1</p>
              <p className="col-span-1">Sub 2</p>
              <p className="col-span-1">Sub 3</p>
              <p className="col-span-2">DMG Component</p>
            </div>
          </div>
          <div className="rounded-b-lg bg-primary-darker">
            <ScalingWrapper
              talent={main?.talents?.normal}
              element={charData.element}
              level={char.talents?.normal}
              upgraded={main?.upgrade?.normal}
            >
              <div className="flex flex-col justify-between gap-4">
                {renderRow(StatsObjectKeys.BASIC_SCALING, TalentProperty.NA)}
                {/* <CompareTotalRows type={TalentProperty.NA} /> */}
              </div>
              <div className="flex flex-col justify-between gap-4 !my-3">
                {renderRow(StatsObjectKeys.CHARGE_SCALING, TalentProperty.CA)}
                {/* <CompareTotalRows type={TalentProperty.CA} /> */}
              </div>
              <div className="flex flex-col justify-between gap-4">
                {renderRow(StatsObjectKeys.PLUNGE_SCALING, TalentProperty.PA)}
                {/* <CompareTotalRows type={TalentProperty.PA} /> */}
              </div>
            </ScalingWrapper>
            <div className="w-full my-2 border-t-2 border-primary-border" />
            <ScalingWrapper
              talent={main?.talents?.skill}
              element={charData.element}
              level={char.talents?.skill}
              upgraded={main?.upgrade?.skill}
            >
              <div className="flex flex-col justify-between h-full gap-4">
                {renderRow(StatsObjectKeys.SKILL_SCALING, TalentProperty.SKILL)}
                {/* <CompareTotalRows type={TalentProperty.SKILL} /> */}
              </div>
            </ScalingWrapper>
            <div className="w-full my-2 border-t-2 border-primary-border" />
            <ScalingWrapper
              talent={main?.talents?.burst}
              element={charData.element}
              level={char.talents?.burst}
              upgraded={main?.upgrade?.burst}
            >
              <div className="flex flex-col justify-between h-full gap-4 pb-2">
                {renderRow(StatsObjectKeys.BURST_SCALING, TalentProperty.BURST)}
                {/* <CompareTotalRows type={TalentProperty.BURST} /> */}
              </div>
            </ScalingWrapper>
          </div>
        </div>
      )}
      {_.some(contents) && _.some(sumStats) && (
        <div className="flex flex-col items-center w-full gap-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="space-y-1">
              <p className="w-[136px] text-xs font-bold text-center text-white truncate">
                {setupIndex ? setupStore.comparing[setupIndex - 1]?.name : setupStore.main?.name}
              </p>
              <div className="grid grid-cols-4 gap-2 text-xs text-white">
                {_.map(Array(4), (_item, index) => (
                  <div
                    key={index}
                    className={classNames(
                      'flex items-center justify-center rounded-sm w-7 h-7 duration-200',
                      team[index]
                        ? 'bg-primary-dark cursor-pointer'
                        : 'bg-primary-darker text-primary-lighter cursor-not-allowed',
                      { 'ring-2 ring-primary-border': index === setupIndex }
                    )}
                    onClick={() => team[index] && setupStore.setValue('selected', [index, charIndex])}
                  >
                    {index === 0 ? <i className="text-desc fa-solid fa-star" /> : index}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              {_.map(team[setupIndex], (item, index) => (
                <CharacterSelect
                  key={`char_select_${index}`}
                  onClick={() => {
                    if (!team[setupIndex][index]) setupStore.setValue('tab', 'trace')
                    setupStore.setValue('selected', [setupIndex, index])
                  }}
                  isSelected={index === charIndex}
                  codeName={findCharacter(item.cId)?.codeName}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-5">
            <div
              className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                'bg-primary': tab === 'trace',
              })}
              onClick={() => setupStore.setValue('tab', 'trace')}
            >
              Character
            </div>
            {focusedChar && (
              <>
                <div
                  className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                    'bg-primary': tab === 'mod',
                  })}
                  onClick={() => setupStore.setValue('tab', 'mod')}
                >
                  Modifiers
                </div>
                <div
                  className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                    'bg-primary': tab === 'stats',
                  })}
                  onClick={() => setupStore.setValue('tab', 'stats')}
                >
                  Stats
                </div>
                <div
                  className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                    'bg-primary': tab === 'load',
                  })}
                  onClick={() => setupStore.setValue('tab', 'load')}
                >
                  Loadout
                </div>
              </>
            )}
          </div>
          {tab === 'mod' && focusedChar && (
            <CompareConditionalBlock
              stats={allStats[setupIndex]}
              content={contents[setupIndex]}
              team={team[setupIndex]}
            />
          )}
          {tab === 'stats' && focusedChar && (
            <>
              <div className="flex items-center justify-between w-full text-white">
                <p className="px-4 text-lg font-bold">
                  <span className="text-desc">✦</span> Final Stats <span className="text-desc">✦</span>
                </p>
                <PrimaryButton title="Stats Breakdown" onClick={onOpenStatsModal} />
              </div>
              <StatBlock stat={allStats[setupIndex][charIndex]} />
            </>
          )}
        </div>
      )}
    </div>
  )
})
