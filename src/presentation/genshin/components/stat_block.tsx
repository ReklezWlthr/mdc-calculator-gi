import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { getBaseStat } from '@src/core/utils/data_format'
import _ from 'lodash'
import { toPercentage } from '@src/core/utils/converter'

interface StatBlockProps {
  index: number
}

export const StatBlock = observer((props: StatBlockProps) => {
  const { teamStore } = useStore()
  const char = teamStore.characters[props.index]

  const DataRow = ({ title, value }: { title: string; value: number | string }) => {
    return (
      <div className="flex items-center gap-2 text-xs">
        <p className="shrink-0">{title}</p>
        <hr className="w-full border border-primary-border" />
        <p className="font-normal text-gray">{value}</p>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-flow-col grid-cols-2 p-4 font-bold text-white rounded-lg grid-rows-10 gap-y-3 gap-x-5 bg-primary-dark">
      <DataRow title="HP" value={getBaseStat(char?.stat?.baseHp, char?.level, char?.stat?.ascHp, char?.ascension, char?.rarity)} />
      <DataRow
        title="ATK"
        value={getBaseStat(char?.stat?.baseAtk, char?.level, char?.stat?.ascAtk, char?.ascension, char?.rarity)}
      />
      <DataRow
        title="DEF"
        value={getBaseStat(char?.stat?.baseDef, char?.level, char?.stat?.ascDef, char?.ascension, char?.rarity)}
      />
      <DataRow title="Elemental Mastery" value={0} />
      <DataRow title="CRIT Rate" value={toPercentage(0.05)} />
      <DataRow title="CRIT DMG" value={toPercentage(0.5)} />
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
