import { useStat } from '@src/core/hooks/useStat'
import { baseStatsObject, StatsObject } from '@src/data/lib/stats/baseConstant'
import Nahida from '@src/data/lib/stats/conditionals/characters/Nahida'
import { useStore } from '@src/data/providers/app_store_provider'
import { Stats } from '@src/domain/genshin/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export const Calculator = observer(({}: {}) => {
  const { teamStore } = useStore()
  const char = teamStore.characters[0]

  const [computedStats, setComputedStats] = useState<StatsObject>(baseStatsObject)

  const stats = useStat(
    char?.cId,
    char?.level,
    char?.ascension,
    char?.equipments?.weapon?.wId,
    char?.equipments?.weapon?.level,
    char?.equipments?.weapon?.ascension,
    char?.equipments?.artifacts
  )

  const main = Nahida(teamStore.characters[0]?.cons, teamStore.characters[0]?.ascension, stats)

  const { setValue, watch } = useForm<Record<string, any>>({
    defaultValues: _.reduce(
      main.content,
      (acc, curr) => {
        if (curr.show) acc[curr.id] = curr.default
        return acc
      },
      {}
    ),
  })
  const values = watch()

  useEffect(() => {
    const preComputed = main.preCompute(_.cloneDeep(values))
    setComputedStats(preComputed)
  }, [])

  const Conditionals = useCallback(
    () =>
      _.map(main.content, (content) => {
        let Input = () => <></>
        switch (content.type) {
          case 'number':
            Input = () => (
              <TextInput
                type="number"
                value={values[content.id]}
                onChange={(value) => setValue(content.id, parseFloat(value) || '')}
                max={content.max}
                min={content.min}
                style="col-span-1"
              />
            )
            break
          case 'toggle':
            Input = () => <div></div>
            break
        }

        return (
          content.show && (
            <div className="grid items-center grid-cols-12 text-xs gap-x-1">
              <div className="col-span-4">
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
              <div className="col-span-3 text-center truncate text-gray">{content.value[0].name}</div>
              <div className="col-span-2 text-center text-gray">
                {content.value[0].formatter(
                  content.value[0].value * (content.type === 'number' ? values[content.id] : 1)
                )}
              </div>
              <Input />
            </div>
          )
        )
      }),
    [main, values]
  )

  return (
    <div className="flex w-full gap-5 p-5 text-white">
      <div className="w-1/2 rounded-lg bg-primary-darker h-fit">
        <p className="px-4 py-3 text-lg font-bold text-center rounded-t-lg bg-primary-light">Self Conditionals</p>
        <div className="h-[200px] px-4 py-3 space-y-3 overflow-visible">
          <Conditionals />
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          {_.map(computedStats.BASIC_SCALING, (item) => (
            <div className="flex gap-2">
              <p>{item.name}</p>
              <p>{_.round(item.value)}</p>
              <p>{_.round(item.value * (1 + computedStats[Stats.CRIT_DMG]))}</p>
            </div>
          ))}
        </div>
        <div>
          {_.map(computedStats.CHARGE_SCALING, (item) => (
            <div className="flex gap-2">
              <p>{item.name}</p>
              <p>{_.round(item.value)}</p>
              <p>{_.round(item.value * (1 + computedStats[Stats.CRIT_DMG]))}</p>
            </div>
          ))}
        </div>
        <div>
          {_.map(computedStats.PLUNGE_SCALING, (item) => (
            <div className="flex gap-2">
              <p>{item.name}</p>
              <p>{_.round(item.value)}</p>
              <p>{_.round(item.value * (1 + computedStats[Stats.CRIT_DMG]))}</p>
            </div>
          ))}
        </div>
        <div>
          {_.map(computedStats.SKILL_SCALING, (item) => (
            <div className="flex gap-2">
              <p>{item.name}</p>
              <p>{_.round(item.value)}</p>
              <p>{_.round(item.value * (1 + computedStats[Stats.CRIT_DMG]))}</p>
            </div>
          ))}
        </div>
        <div>
          {_.map(computedStats.BURST_SCALING, (item) => (
            <div className="flex gap-2">
              <p>{item.name}</p>
              <p>{_.round(item.value)}</p>
              <p>{_.round(item.value * (1 + computedStats[Stats.CRIT_DMG]))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
