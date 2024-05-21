import { useStore } from '@src/data/providers/app_store_provider'
import { Element } from '@src/domain/genshin/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import _ from 'lodash'
import classNames from 'classnames'
import { BaseElementColor } from './tables/scaling_sub_rows'
import { toPercentage } from '@src/core/utils/converter'
import { observer } from 'mobx-react-lite'

export const EnemyModal = observer(() => {
  const { calculatorStore, teamStore } = useStore()
  const { res, level, computedStats, selected } = calculatorStore
  const charLevel = teamStore.characters[calculatorStore.selected]?.level
  const rawDef = 5 * level + 500
  const pen = computedStats[selected]?.DEF_PEN
  const red = computedStats[selected]?.DEF_REDUCTION
  const def = rawDef * (1 - pen) * (1 - red)
  const defMult = calculatorStore.getDefMult(charLevel, pen, red)

  return (
    <div className="w-[35vw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <p>Target Enemy Setting</p>
      <div className="flex justify-between gap-4">
        <div className="space-y-5">
          <div className="flex items-center gap-x-3">
            <p>Level</p>
            <TextInput
              value={level.toString()}
              onChange={(value) => calculatorStore.setValue('level', parseFloat(value) || 0)}
              style="!w-[60px]"
            />
          </div>
          <div className="space-y-1">
            <p>DEF</p>
            <div className="flex flex-wrap items-center px-2 py-1 text-sm font-normal rounded-lg gap-x-2 bg-primary-darker w-fit text-gray">
              <p className="font-bold text-yellow">{_.round(def).toLocaleString()}</p>
              <p>=</p>
              <p>
                ((<b className="text-red">{level}</b> &#215; 5) + 500)
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
            <p>DEF Multiplier</p>
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-normal rounded-lg bg-primary-darker w-fit text-gray">
              <p className="font-bold text-orange-300">{toPercentage(defMult)}</p>
              <p>=</p>
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
        <div className="flex flex-col items-end gap-y-3">
          <i className='fa-solid fa-circle-xmark text-red' title="Immune" />
          {_.map(BaseElementColor, (item, key: Element) => (
            <div className="flex items-center gap-3">
              <p className={classNames('whitespace-nowrap text-sm', item)}>{key} RES</p>
              <TextInput
                value={res[key] === Infinity ? 'Immune' : res[key].toString()}
                onChange={(value) => calculatorStore.setRes(key, parseFloat(value) || 0)}
                style="!w-[75px]"
                disabled={res[key] === Infinity}
              />
              <input
                type="checkbox"
                checked={res[key] === Infinity}
                onChange={(e) => calculatorStore.setRes(key, e.target.checked ? Infinity : 10)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
