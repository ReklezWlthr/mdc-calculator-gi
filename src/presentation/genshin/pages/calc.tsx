import { useStat } from '@src/core/hooks/useStat'
import { findCharacter } from '@src/core/utils/finder'
import { baseStatsObject, StatsObject } from '@src/data/lib/stats/baseConstant'
import Nahida from '@src/data/lib/stats/conditionals/characters/Nahida'
import { useStore } from '@src/data/providers/app_store_provider'
import { Stats, WeaponIcon } from '@src/domain/genshin/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { ScalingSubRows } from '../components/tables/scaling_sub_rows'
import { ScalingWrapper } from '../components/tables/scaling_wrapper'
import { StatBlock } from '../components/stat_block'
import { CharacterSelect } from '../components/character_select'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'
import { IContent } from '@src/domain/genshin/conditional'

type ConditionalFormT = {
  conditionals: Record<string, any>[]
}

const Conditionals = observer(
  ({ content, control, selected }: { content: IContent[]; control: Control<ConditionalFormT>; selected: number }) =>
    _.map(
      content,
      (content) =>
        content.show && (
          <Controller
            key={content.id}
            name={`conditionals.${selected}.${content.id}`}
            control={control}
            render={({ field }) => (
              <div className="grid items-center grid-cols-12 text-xs gap-x-1">
                <div className="col-span-5">
                  <Tooltip
                    title={content.title}
                    body={<p dangerouslySetInnerHTML={{ __html: content.content }} />}
                    key={content.id}
                    style="w-[400px]"
                  >
                    <p className="w-full text-xs text-center text-white truncate">{content.text}</p>
                  </Tooltip>
                </div>
                <div className="col-span-1 text-center truncate text-blue">Buff</div>
                <div className="col-span-4 text-center truncate text-gray">{content.value[0].name}</div>
                <div className="col-span-1 text-center text-gray">
                  {content.value[0].formatter(content.value[0].value * (content.type === 'number' ? field.value : 1))}
                </div>
                {content.type === 'number' && (
                  <TextInput
                    type="number"
                    value={field.value}
                    onChange={(value) => field.onChange(parseFloat(value) || '')}
                    max={content.max}
                    min={content.min}
                    style="col-span-1"
                  />
                )}
                {content.type === 'toggle' && (
                  <input
                    type="checkbox"
                    onChange={(value) => field.onChange(value)}
                    checked={field.value}
                    name={content.id}
                  />
                )}
              </div>
            )}
          />
        )
    )
)

export const Calculator = observer(({}: {}) => {
  const { teamStore } = useStore()
  const [selected, setSelected] = useState(0)

  const char = teamStore.characters[selected]
  const charData = findCharacter(char.cId)

  const [computedStats, setComputedStats] = useState(baseStatsObject)

  const stats = useStat(
    char?.cId,
    char?.level,
    char?.ascension,
    char?.equipments?.weapon?.wId,
    char?.equipments?.weapon?.level,
    char?.equipments?.weapon?.ascension,
    char?.equipments?.artifacts,
    computedStats
  )

  const conditionals = _.map(teamStore.characters, (item) =>
    _.find(ConditionalsObject, ['id', item.cId])?.conditionals(item.cons, item.ascension, stats)
  )
  const main = conditionals[selected]

  const { watch, control } = useForm<ConditionalFormT>({
    defaultValues: {
      conditionals: _.map(conditionals, (item) =>
        _.reduce(
          item?.content,
          (acc, curr) => {
            if (curr.show) acc[curr.id] = curr.default
            return acc
          },
          {}
        )
      ),
    },
  })
  const values = watch()

  useEffect(() => {
    const preCompute = main?.preCompute(values)
    // setComputedStats(preCompute)
  }, [char, values])

  return (
    <div className="grid w-full grid-cols-3 gap-5 p-5 overflow-y-auto text-white">
      <div className="col-span-2">
        <div className="flex justify-center w-full gap-4 pt-1 pb-3">
          {_.map(teamStore?.characters, (item, index) => (
            <CharacterSelect
              key={`char_select_${index}`}
              onClick={() => setSelected(index)}
              isSelected={index === selected}
              codeName={findCharacter(item.cId)?.codeName}
            />
          ))}
        </div>
        <div className="flex flex-col text-sm rounded-lg bg-primary-darker h-fit">
          <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">Damage Calculation</p>
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
            icon={`https://enka.network/ui${WeaponIcon[charData.weapon]}`}
            element={charData.element}
          >
            <div>
              {_.map(computedStats?.BASIC_SCALING, (item) => (
                <ScalingSubRows
                  key={item.name}
                  scaling={item}
                  cr={computedStats[Stats.CRIT_RATE]}
                  cd={computedStats[Stats.CRIT_DMG]}
                />
              ))}
            </div>
            <div className="py-3">
              {_.map(computedStats?.CHARGE_SCALING, (item) => (
                <ScalingSubRows
                  key={item.name}
                  scaling={item}
                  cr={computedStats[Stats.CRIT_RATE]}
                  cd={computedStats[Stats.CRIT_DMG]}
                />
              ))}
            </div>
            <div>
              {_.map(computedStats?.PLUNGE_SCALING, (item) => (
                <ScalingSubRows
                  key={item.name}
                  scaling={item}
                  cr={computedStats[Stats.CRIT_RATE]}
                  cd={computedStats[Stats.CRIT_DMG]}
                />
              ))}
            </div>
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.skill}
            icon={`https://enka.network/ui/Skill_S_${charData?.codeName}_01.png`}
            element={charData.element}
          >
            {_.map(computedStats?.SKILL_SCALING, (item) => (
              <ScalingSubRows
                key={item.name}
                scaling={item}
                cr={computedStats[Stats.CRIT_RATE]}
                cd={computedStats[Stats.CRIT_DMG]}
              />
            ))}
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.burst}
            icon={`https://enka.network/ui/Skill_E_${charData?.codeName}_01.png`}
            element={charData.element}
          >
            {_.map(computedStats?.BURST_SCALING, (item) => (
              <ScalingSubRows
                key={item.name}
                scaling={item}
                cr={computedStats[Stats.CRIT_RATE]}
                cd={computedStats[Stats.CRIT_DMG]}
              />
            ))}
          </ScalingWrapper>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg bg-primary-darker h-fit">
          <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">Self Conditionals</p>
          <div className="h-[200px] px-4 py-3 space-y-3 overflow-visible">
            <Conditionals content={main?.content} control={control} selected={selected} />
          </div>
        </div>
        <StatBlock index={selected} />
      </div>
    </div>
  )
})
