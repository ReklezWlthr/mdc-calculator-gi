import { observer } from 'mobx-react-lite'
import _ from 'lodash'
import { toPercentage } from '@src/core/utils/converter'

import { StatsObject } from '@src/data/lib/stats/baseConstant'
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
    <div className="grid w-full grid-flow-col grid-cols-2 p-4 font-bold text-white rounded-lg grid-rows-10 gap-y-1 gap-x-5 bg-primary-dark">
      <ExtraDataRow title="HP" base={stat?.BASE_HP} bonus={stat?.BASE_HP * stat?.[Stats.P_HP] + stat?.[Stats.HP]} />
      <ExtraDataRow
        title="ATK"
        base={stat?.BASE_ATK}
        bonus={stat?.BASE_ATK * stat?.[Stats.P_ATK] + stat?.[Stats.ATK]}
      />
      <ExtraDataRow
        title="DEF"
        base={stat?.BASE_DEF}
        bonus={stat?.BASE_DEF * stat?.[Stats.P_DEF] + stat?.[Stats.DEF]}
      />
      <DataRow title="Elemental Mastery" value={_.round(stat?.[Stats.EM])} />
      <DataRow title="CRIT Rate" value={toPercentage(stat?.[Stats.CRIT_RATE])} />
      <DataRow title="CRIT DMG" value={toPercentage(stat?.[Stats.CRIT_DMG])} />
      <DataRow title="Healing Bonus" value={toPercentage(stat?.[Stats.HEAL])} />
      <DataRow title="Incoming Healing" value={toPercentage(stat?.[Stats.I_HEALING])} />
      <DataRow title="Energy Recharge" value={toPercentage(stat?.[Stats.ER])} />
      <DataRow title="CD Reduction" value={toPercentage(0)} />
      <DataRow title="Physical DMG%" value={toPercentage(stat?.[Stats.PHYSICAL_DMG])} />
      <DataRow title="Pyro DMG%" value={toPercentage(stat?.[Stats.PYRO_DMG])} />
      <DataRow title="Hydro DMG%" value={toPercentage(stat?.[Stats.HYDRO_DMG])} />
      <DataRow title="Cryo DMG%" value={toPercentage(stat?.[Stats.CRYO_DMG])} />
      <DataRow title="Electro DMG%" value={toPercentage(stat?.[Stats.ELECTRO_DMG])} />
      <DataRow title="Anemo DMG%" value={toPercentage(stat?.[Stats.ANEMO_DMG])} />
      <DataRow title="Geo DMG%" value={toPercentage(stat?.[Stats.GEO_DMG])} />
      <DataRow title="Dendro DMG%" value={toPercentage(stat?.[Stats.DENDRO_DMG])} />
      <DataRow title="DMG%" value={toPercentage(stat?.[Stats.ALL_DMG])} />
      <DataRow title="Shield Strength" value={toPercentage(stat?.[Stats.SHIELD])} />
    </div>
  )
})
