import { useStore } from '@src/data/providers/app_store_provider'
import { Element } from '@src/domain/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import _ from 'lodash'
import classNames from 'classnames'
import { toPercentage } from '@src/core/utils/converter'
import { observer } from 'mobx-react-lite'
import { CheckboxInput } from '@src/presentation/components/inputs/checkbox'
import { StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { EnemyGroups } from '@src/data/db/enemies'
import { SelectTextInput } from '@src/presentation/components/inputs/select_text_input'
import { findEnemy } from '@src/core/utils/finder'
import { BaseElementColor } from '@src/core/utils/damageStringConstruct'
import React from 'react'
import { Tooltip } from '@src/presentation/components/tooltip'

export const EnemyModal = observer(({ compare }: { compare?: boolean }) => {
  const { calculatorStore, teamStore } = useStore()
  const store = compare ? calculatorStore : calculatorStore
  const { res, level, computedStats, selected, enemy } = store
  const charLevel = teamStore.characters[store.selected]?.level
  const rawDef = 5 * level + 500
  const pen = computedStats[selected]?.getValue(StatsObjectKeys.DEF_PEN)
  const red = computedStats[selected]?.getValue(StatsObjectKeys.DEF_REDUCTION)
  const def = rawDef * (1 - pen) * (1 - red)
  const defMult = store.getDefMult(charLevel, pen, red)

  const enemyGroups = EnemyGroups
  const enemyData = findEnemy(enemy)

  const reduceRes = (arr: number[]) =>
    _.reduce(
      _.map(Element),
      (acc, curr, i) => {
        acc[curr] = _.round(arr[i] * 100)
        return acc
      },
      {} as Record<Element, number>
    )

  return (
    <div className="w-[35vw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <p>Target Enemy Setting</p>
      <div className="flex gap-3">
        <div className="w-full space-y-1">
          <p className="text-sm">Enemy Preset</p>
          <SelectTextInput
            options={_.map(enemyGroups, (item) => ({
              name: item.name,
              value: item.name,
              img: `https://homdgcat.wiki/homdgcat-res/monster/${item.img}.png`,
            }))}
            onChange={(v) => {
              const enemyData = findEnemy(v?.name)
              const variant = _.head(enemyData?.options)?.value || ''
              const arr = enemyData?.res(variant as Element, false, false)
              store.setValue('enemy', v?.value || '')
              store.setValue('variant', variant || '')
              store.setValue('stun', false)
              store.setValue('shielded', false)
              if (v) store.setValue('res', reduceRes(arr))
            }}
            value={enemy}
            placeholder="Custom"
          />
        </div>
        <div className="space-y-1 w-[37%] shrink-0">
          <p className="text-sm">Enemy Variant</p>
          <SelectInput
            placeholder="None"
            options={enemyData?.options}
            onChange={(v) => {
              store.setValue('variant', v)
              const arr = enemyData?.res(v as Element, store.stun, store.shielded)
              store.setValue('res', reduceRes(arr))
            }}
            value={store.variant}
            disabled={!_.size(enemyData?.options)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-3">
        <div className="flex items-center gap-x-3">
          <p className="text-sm">Level</p>
          <TextInput
            type="number"
            min={1}
            value={level.toString()}
            onChange={(value) => store.setValue('level', parseFloat(value) || 0)}
            style="!w-[60px]"
          />
        </div>
        <div className="flex items-center gap-x-3">
          {enemyData?.stun && (
            <>
              <p className="text-sm">{enemyData?.stun}</p>
              <CheckboxInput
                checked={store.stun}
                onClick={(v) => {
                  const arr = enemyData?.res(store.variant as Element, v, store.shielded)
                  store.setValue('stun', v)
                  store.setValue('res', reduceRes(arr))
                }}
              />
            </>
          )}
          {enemyData?.shield && (
            <>
              <p className="text-sm">{enemyData?.shield}</p>
              <CheckboxInput
                checked={store.shielded}
                onClick={(v) => {
                  const arr = enemyData?.res(store.variant as Element, store.stun, v)
                  store.setValue('shielded', v)
                  store.setValue('res', reduceRes(arr))
                }}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="space-y-5">
          <div className="space-y-1">
            <p>DEF</p>
            <div className="flex flex-wrap items-center px-2 py-1 text-sm font-normal rounded-lg gap-x-2 bg-primary-darker w-fit text-gray">
              <p className="font-bold text-yellow">{_.round(def).toLocaleString()}</p>
              <p>=</p>
              <p>
                (500 + 5 &#215; <b className="text-red">{level}</b>)
              </p>
              {!!pen && (
                <p>
                  &#215;
                  <span className="ml-2">
                    (1 - <b className="text-red">{toPercentage(pen)}</b>)
                  </span>
                </p>
              )}
              {!!red && (
                <p>
                  &#215;
                  <span className="ml-2">
                    (1 - <b className="text-red">{toPercentage(red)}</b>)
                  </span>
                </p>
              )}
            </div>
            <p className="pt-2">DEF Multiplier</p>
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-normal rounded-lg bg-primary-darker w-fit text-gray">
              <p className="font-bold text-orange-300">{toPercentage(defMult)}</p>
              <p>= 1 - </p>
              <div className="flex flex-col gap-y-1">
                <p className="text-center">
                  <b className="text-yellow">{_.round(def).toLocaleString()}</b>
                </p>
                <div className="h-0 border-[1.5px] border-primary-border" />
                <p className="text-center">
                  <b className="text-yellow">{_.round(def).toLocaleString()}</b> + (
                  <b className="text-blue">{charLevel}</b> &#215; 5) + 500
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center gap-2 text-sm">
            <p>Elemental RES</p>
            <Tooltip
              title="Elemental RES"
              body={
                <div className="font-normal">
                  <p>Reduces DMG received by a certain percentage.</p>
                  <p>
                    RES can become negative but will also become only <span className="text-desc">half</span> as
                    effective. Similarly, RES above <span className="text-desc">75%</span> will gradually become less
                    effective as the value increases.
                  </p>
                  <p>You can use the toggle to the right of each Element to make the enemy immune to said Element.</p>
                </div>
              }
              style="w-[400px]"
            >
              <i className="fa-regular fa-question-circle text-gray" />
            </Tooltip>
          </div>
          {_.map(BaseElementColor, (item, key: Element) => (
            <div className="flex items-center gap-3">
              <p className={classNames('whitespace-nowrap text-sm w-full', item)}>{key} RES</p>
              <TextInput
                type={res[key] === Infinity ? 'text' : 'number'}
                value={res[key] === Infinity ? 'Immune' : res[key].toString()}
                onChange={(value) => store.setRes(key, value as any as number)}
                style="!w-[75px] shrink-0"
                disabled={res[key] === Infinity || !!enemyData}
              />
              <CheckboxInput
                checked={res[key] === Infinity}
                onClick={(v) => store.setRes(key, v ? Infinity : 10)}
                disabled={!!enemyData}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})