import { toPercentage } from '@src/core/utils/converter'
import { StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import { useStore } from '@src/data/providers/app_store_provider'
import { Stats } from '@src/domain/constant'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

export const AdditionalCompareBlock = observer(({ stats }: { stats: StatsObject[] }) => {
  const { setupStore } = useStore()
  const mode = setupStore.mode

  const eHP = _.map(stats, (item) =>
    item
      ? item.getHP() / (1 - item.getDef() / (item.getDef() + 200 + 10 * +setupStore.level)) / (1 - item.getDmgRed())
      : 0
  )

  // const resist = _.map(stats, (item) =>
  //   item
  //     ? 1 - 1 * (1 - item.getValue(Stats.E_RES)) * (1 + setupStore.getEhr(item.getValue(StatsObjectKeys.EHR_RED)))
  //     : 0
  // )

  const SubDmgBlock = ({ a, b, format }: { a: number; b: number; format: (v: number) => string }) => {
    const compare = b - a
    const p = (b - a) / a
    const percent = a ? (compare >= 0 ? '+' : '') + toPercentage(p) : 'NEW'
    const abs = (compare >= 0 ? '+' : '') + _.floor(b - a).toLocaleString()
    const diff = _.includes(['percent', 'abs'], mode)
    return b ? (
      <p
        className={classNames(
          'col-span-1 text-xs text-center',
          diff
            ? {
                'text-lime-300': compare > 0 && a,
                'text-desc': compare > 0 && !a,
                'text-red': compare < 0,
                'text-blue': compare === 0,
              }
            : ''
        )}
      >
        {mode === 'percent' ? percent : mode === 'abs' ? abs : format(b)}
        {compare > 0 && !diff && <i className="ml-1 text-[10px] fa-solid fa-caret-up text-lime-400" />}
        {compare < 0 && !diff && <i className="ml-1 text-[10px] fa-solid fa-caret-down text-red" />}
        {compare === 0 && !diff && <i className="ml-1 text-[10px] fa-solid fa-minus text-blue" />}
      </p>
    ) : (
      <p className="col-span-1 text-center text-gray">-</p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 mt-5">
      <div className="text-lg font-bold text-center">Additional Comparison</div>
      <div className="col-span-2">
        <div className="grid w-full grid-cols-5 gap-2 px-2 py-1 text-sm font-bold text-center rounded-t-lg bg-primary-dark">
          <p className="col-span-1">Name</p>
          <p className="col-span-1">Main</p>
          <p className="col-span-1">Sub 1</p>
          <p className="col-span-1">Sub 2</p>
          <p className="col-span-1">Sub 3</p>
        </div>
        <div className="grid w-full grid-cols-5 gap-2 px-2 py-1 text-sm text-center rounded-b-lg bg-primary-darker text-gray">
          <p className="col-span-1 text-white">eHP</p>
          {_.map(eHP, (item, i) =>
            i ? (
              <SubDmgBlock a={eHP[0]} b={item} format={(v) => _.round(v).toLocaleString()} />
            ) : (
              <p className="col-span-1 text-xs">{_.round(item).toLocaleString()}</p>
            )
          )}
          {/* <p className="col-span-1 text-white">Debuff RES</p>
          {_.map(resist, (item, i) =>
            i ? (
              <SubDmgBlock a={resist[0]} b={item} format={toPercentage} />
            ) : (
              <p className="col-span-1 text-xs">{toPercentage(item)}</p>
            )
          )} */}
        </div>
      </div>
    </div>
  )
})
