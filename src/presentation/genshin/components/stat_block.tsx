import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { getBaseStat, getWeaponBase } from '@src/core/utils/data_format'
import _ from 'lodash'
import { toPercentage } from '@src/core/utils/converter'
import { useStat } from '@src/core/hooks/useStat'

interface StatBlockProps {
  index: number
}

export const StatBlock = observer((props: StatBlockProps) => {
  const stat = useStat(props.index)

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
          <p className="font-normal text-gray">{_.floor(base + bonus).toLocaleString()}</p>
          <p className="font-normal text-neutral-400 text-[9px]">
            {base.toLocaleString()}
            <span className="text-genshin-hydro">{` (+${_.floor(bonus).toLocaleString()})`}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-flow-col grid-cols-2 p-4 font-bold text-white rounded-lg grid-rows-10 gap-y-1 gap-x-5 bg-primary-dark">
      <ExtraDataRow title="HP" base={stat?.baseHp} bonus={stat?.baseHp * stat?.pHp} />
      <ExtraDataRow title="ATK" base={stat?.baseAtk} bonus={stat?.baseAtk * stat?.pAtk} />
      <ExtraDataRow title="DEF" base={stat?.baseDef} bonus={stat?.baseDef * stat?.pDef} />
      <DataRow title="Elemental Mastery" value={0} />
      <DataRow title="CRIT Rate" value={toPercentage(stat?.cRate)} />
      <DataRow title="CRIT DMG" value={toPercentage(stat?.cDmg)} />
      <DataRow title="Healing Bonus" value={toPercentage(0)} />
      <DataRow title="Incoming Healing" value={toPercentage(0)} />
      <DataRow title="Energy Recharge" value={toPercentage(1)} />
      <DataRow title="CD Reduction" value={toPercentage(0)} />
      <DataRow title="Physical DMG%" value={toPercentage(0)} />
      <DataRow title="Pyro DMG%" value={toPercentage(0)} />
      <DataRow title="Hydro DMG%" value={toPercentage(0)} />
      <DataRow title="Cryo DMG%" value={toPercentage(0)} />
      <DataRow title="Electro DMG%" value={toPercentage(0)} />
      <DataRow title="Anemo DMG%" value={toPercentage(0)} />
      <DataRow title="Geo DMG%" value={toPercentage(0)} />
      <DataRow title="Dendro DMG%" value={toPercentage(0)} />
      <DataRow title="DMG%" value={toPercentage(0)} />
      <DataRow title="Shield Strength" value={toPercentage(0)} />
    </div>
  )
})
