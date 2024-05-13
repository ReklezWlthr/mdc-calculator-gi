import { StatObjectT, useStat } from '@src/core/hooks/useStat'
import { findCharacter } from '@src/core/utils/finder'
import { baseStatsObject, StatsObject } from '@src/data/lib/stats/baseConstant'
import { useStore } from '@src/data/providers/app_store_provider'
import { Stats, WeaponIcon } from '@src/domain/genshin/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { ScalingSubRows } from '../components/tables/scaling_sub_rows'
import { ScalingWrapper } from '../components/tables/scaling_wrapper'
import { StatBlock } from '../components/stat_block'
import { CharacterSelect } from '../components/character_select'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'

export const Calculator = observer(({}: {}) => {
  const { teamStore } = useStore()
  const [selected, setSelected] = useState(0)

  const char = teamStore.characters[selected]
  const charData = findCharacter(char.cId)

  const [computedStats, setComputedStats] = useState<StatsObject[]>(Array(4).fill(baseStatsObject))
  const mainComputed = computedStats?.[selected]

  const stats = useStat(
    char?.cId,
    char?.level,
    char?.ascension,
    char?.equipments?.weapon?.wId,
    char?.equipments?.weapon?.level,
    char?.equipments?.weapon?.ascension,
    char?.equipments?.artifacts,
    computedStats?.[selected]
  )

  const conditionals = useMemo(
    () =>
      _.map(teamStore.characters, (item) =>
        _.find(ConditionalsObject, ['id', item.cId])?.conditionals(item.cons, item.ascension, stats)
      ),
    [computedStats, teamStore.characters, selected]
  )
  const main = conditionals[selected]

  const [form, setForm] = useState<Record<string, any>[]>(
    _.map(conditionals, (item) =>
      _.reduce(
        item?.content,
        (acc, curr) => {
          if (curr.show) acc[curr.id] = curr.default
          return acc
        },
        {}
      )
    )
  )

  useEffect(() => {
    const preCompute = main?.preCompute(form[selected])
    setComputedStats((prev) => {
      prev[selected] = preCompute
      return _.cloneDeep(prev)
    })
  }, [selected, form])

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
            <div className="space-y-0.5">
              {_.map(mainComputed?.BASIC_SCALING, (item) => (
                <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
              ))}
            </div>
            <div className="py-2 space-y-0.5">
              {_.map(mainComputed?.CHARGE_SCALING, (item) => (
                <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
              ))}
            </div>
            <div className="space-y-0.5">
              {_.map(mainComputed?.PLUNGE_SCALING, (item) => (
                <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
              ))}
            </div>
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.skill}
            icon={`https://enka.network/ui/Skill_S_${charData?.codeName}_01.png`}
            element={charData.element}
          >
            {_.map(mainComputed?.SKILL_SCALING, (item) => (
              <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
            ))}
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.burst}
            icon={`https://enka.network/ui/Skill_E_${charData?.codeName}_01.png`}
            element={charData.element}
          >
            {_.map(mainComputed?.BURST_SCALING, (item) => (
              <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
            ))}
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.a1}
            icon={`https://enka.network/ui/UI_Talent_S_${charData?.codeName}_05.png`}
            element={charData.element}
          >
            {_.map(mainComputed?.A1_SCALING, (item) => (
              <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
            ))}
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.a4}
            icon={`https://enka.network/ui/UI_Talent_S_${charData?.codeName}_06.png`}
            element={charData.element}
          >
            {_.map(mainComputed?.A4_SCALING, (item) => (
              <ScalingSubRows key={item.name} scaling={item} cr={stats.cRate} cd={stats.cDmg} />
            ))}
          </ScalingWrapper>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg bg-primary-darker h-fit">
          <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">Self Conditionals</p>
          <div className="h-[200px] px-4 py-3 space-y-3 overflow-visible">
            {_.map(
              main?.content,
              (content) =>
                content.show && (
                  <div className="grid items-center grid-cols-12 text-xs gap-x-1" key={content.id}>
                    <div className="col-span-5">
                      <Tooltip
                        title={content.title}
                        body={<p dangerouslySetInnerHTML={{ __html: content.content }} />}
                        key={content.id}
                        style="w-[40vw]"
                      >
                        <p className="w-full text-xs text-center text-white truncate">{content.text}</p>
                      </Tooltip>
                    </div>
                    <div className="col-span-4 text-center truncate text-gray">{content.value[0]?.name}</div>
                    <div className="col-span-1 text-center text-gray">
                      {content.value[0]?.formatter(
                        content.value[0]?.value * (content.type === 'number' ? form[selected]?.[content.id] : 1)
                      )}
                    </div>
                    {content.type === 'number' && (
                      <TextInput
                        type="number"
                        value={form[selected]?.[content.id]}
                        onChange={(value) =>
                          setForm((formValue) => {
                            formValue[selected] = { ...formValue[selected], [content.id]: parseFloat(value) || '' }
                            return _.cloneDeep(formValue)
                          })
                        }
                        max={content.max}
                        min={content.min}
                        style="col-span-2"
                      />
                    )}
                    {content.type === 'toggle' && (
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setForm((formValue) => {
                            formValue[selected] = { ...formValue[selected], [content.id]: e.target.checked }
                            return _.cloneDeep(formValue)
                          })
                        }
                        checked={form[selected]?.[content.id]}
                        name={content.id}
                      />
                    )}
                  </div>
                )
            )}
          </div>
        </div>
        <StatBlock index={selected} stat={stats} />
      </div>
    </div>
  )
})
