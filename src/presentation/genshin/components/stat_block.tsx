import { observer } from 'mobx-react-lite'
import _ from 'lodash'
import { toPercentage } from '@src/core/utils/converter'

import { StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import { Stats } from '@src/domain/constant'

interface StatBlockProps {
  index: number
  stat: StatsObject
}

export const StatBlock = observer(({ index, stat }: StatBlockProps) => {
  const DataRow = ({ title, value }: { title: string; value: number | string }) => {
    return (
      <div className="flex items-center gap-2 text-xs">
        <p className="shrink-0">{title}</p>
        <hr className="w-full border border-primary-border" />
        <p className="font-normal text-gray">{value.toLocaleString()}</p>
      </div>
    )
  }

  const ExtraDataRow = ({ title, base, bonus }: { title: string; base: number; bonus: number }) => {
    return (
      <div className="flex items-center gap-2 text-xs">
        <p className="shrink-0">{title}</p>
        <hr className="w-full border border-primary-border" />
        <div className="flex flex-col items-end shrink-0">
          <p className="font-normal text-gray">{_.round(base + bonus).toLocaleString()}</p>
          <p className="font-normal text-neutral-400 text-[9px]">
            {_.round(base).toLocaleString()}
            <span className="text-genshin-cryo">{` +${_.round(bonus).toLocaleString()}`}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-flow-col grid-cols-2 p-4 font-bold text-white rounded-lg grid-rows-11 gap-y-1 gap-x-5 bg-primary-dark">
      <ExtraDataRow
        title="HP"
        base={stat?.BASE_HP}
        bonus={stat?.BASE_HP * stat?.getValue(Stats.P_HP) + stat?.getValue(Stats.HP)}
      />
      <ExtraDataRow
        title="ATK"
        base={stat?.BASE_ATK}
        bonus={stat?.BASE_ATK * stat?.getValue(Stats.P_ATK) + stat?.getValue(Stats.ATK)}
      />
      <ExtraDataRow
        title="DEF"
        base={stat?.BASE_DEF}
        bonus={stat?.BASE_DEF * stat?.getValue(Stats.P_DEF) + stat?.getValue(Stats.DEF)}
      />
      <DataRow title="Elemental Mastery" value={_.round(stat?.getEM())} />
      <DataRow title="CRIT Rate" value={toPercentage(stat?.getValue(Stats.CRIT_RATE))} />
      <DataRow title="CRIT DMG" value={toPercentage(stat?.getValue(Stats.CRIT_DMG))} />
      <DataRow title="Healing Bonus" value={toPercentage(stat?.getValue(Stats.HEAL))} />
      <DataRow title="Incoming Healing" value={toPercentage(stat?.getValue(Stats.I_HEALING))} />
      <DataRow title="Energy Recharge" value={toPercentage(stat?.getValue(Stats.ER))} />
      <DataRow title="CD Reduction" value={toPercentage(stat?.getValue(StatsObjectKeys.CD_RED))} />
      <DataRow title="ATK SPD" value={toPercentage(_.min([stat?.getValue(StatsObjectKeys.ATK_SPD), 1.6]))} />
      <DataRow title="Physical DMG%" value={toPercentage(stat?.getValue(Stats.PHYSICAL_DMG))} />
      <DataRow title="Pyro DMG%" value={toPercentage(stat?.getValue(Stats.PYRO_DMG))} />
      <DataRow title="Hydro DMG%" value={toPercentage(stat?.getValue(Stats.HYDRO_DMG))} />
      <DataRow title="Cryo DMG%" value={toPercentage(stat?.getValue(Stats.CRYO_DMG))} />
      <DataRow title="Electro DMG%" value={toPercentage(stat?.getValue(Stats.ELECTRO_DMG))} />
      <DataRow title="Anemo DMG%" value={toPercentage(stat?.getValue(Stats.ANEMO_DMG))} />
      <DataRow title="Geo DMG%" value={toPercentage(stat?.getValue(Stats.GEO_DMG))} />
      <DataRow title="Dendro DMG%" value={toPercentage(stat?.getValue(Stats.DENDRO_DMG))} />
      <DataRow title="DMG%" value={toPercentage(stat?.getValue(Stats.ALL_DMG))} />
      <DataRow title="Shield Strength" value={toPercentage(stat?.getValue(Stats.SHIELD))} />
      <DataRow title="DMG Mitigation" value={toPercentage(stat?.getValue(StatsObjectKeys.DMG_REDUCTION))} />
    </div>
  )
})
