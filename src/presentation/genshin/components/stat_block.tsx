import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import _ from 'lodash'
import { toPercentage } from '@src/core/utils/converter'
import { useStat } from '@src/core/hooks/useStat'

interface StatBlockProps {
  index: number
}

export const StatBlock = observer((props: StatBlockProps) => {
  const { teamStore } = useStore()
  const char = teamStore.characters[props.index]

  const stat = useStat(
    char?.cId,
    char?.level,
    char?.ascension,
    char?.equipments?.weapon?.wId,
    char?.equipments?.weapon?.level,
    char?.equipments?.weapon?.ascension,
    char?.equipments?.artifacts
  )

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
      <ExtraDataRow title="HP" base={stat?.baseHp} bonus={stat?.baseHp * stat?.pHp + stat?.fHp} />
      <ExtraDataRow title="ATK" base={stat?.baseAtk} bonus={stat?.baseAtk * stat?.pAtk + stat?.fAtk} />
      <ExtraDataRow title="DEF" base={stat?.baseDef} bonus={stat?.baseDef * stat?.pDef + stat?.fDef} />
      <DataRow title="Elemental Mastery" value={_.round(stat?.em)} />
      <DataRow title="CRIT Rate" value={toPercentage(stat?.cRate)} />
      <DataRow title="CRIT DMG" value={toPercentage(stat?.cDmg)} />
      <DataRow title="Healing Bonus" value={toPercentage(stat?.heal)} />
      <DataRow title="Incoming Healing" value={toPercentage(0)} />
      <DataRow title="Energy Recharge" value={toPercentage(stat?.er)} />
      <DataRow title="CD Reduction" value={toPercentage(0)} />
      <DataRow title="Physical DMG%" value={toPercentage(stat?.physical)} />
      <DataRow title="Pyro DMG%" value={toPercentage(stat?.pyro)} />
      <DataRow title="Hydro DMG%" value={toPercentage(stat?.hydro)} />
      <DataRow title="Cryo DMG%" value={toPercentage(stat?.cryo)} />
      <DataRow title="Electro DMG%" value={toPercentage(stat?.electro)} />
      <DataRow title="Anemo DMG%" value={toPercentage(stat?.anemo)} />
      <DataRow title="Geo DMG%" value={toPercentage(stat?.geo)} />
      <DataRow title="Dendro DMG%" value={toPercentage(stat?.dendro)} />
      <DataRow title="DMG%" value={toPercentage(0)} />
      <DataRow title="Shield Strength" value={toPercentage(stat?.shield)} />
    </div>
  )
})
