import { StatObjectT } from '@src/core/hooks/useStat'
import { IScaling } from '@src/domain/genshin/conditional'
import { Element, StatIcons, TalentProperty } from '@src/domain/genshin/constant'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { StatNameMap } from '../../../../core/hooks/useStat'
import { Tooltip } from '@src/presentation/components/tooltip'
import { toPercentage } from '@src/core/utils/converter'

interface ScalingSubRowsProps {
  scaling: IScaling
  stats: StatObjectT
}

export const ScalingSubRows = observer(({ scaling, stats }: ScalingSubRowsProps) => {
  const propertyColor = {
    [TalentProperty.HEAL]: 'text-heal',
    [TalentProperty.SHIELD]: 'text-indigo-300',
  }

  const elementColor = {
    [Element.PHYSICAL]: 'text-gray',
    [Element.PYRO]: 'text-genshin-pyro',
    [Element.HYDRO]: 'text-genshin-hydro',
    [Element.CRYO]: 'text-genshin-cryo',
    [Element.ELECTRO]: 'text-genshin-electro',
    [Element.GEO]: 'text-genshin-geo',
    [Element.ANEMO]: 'text-genshin-anemo',
    [Element.DENDRO]: 'text-genshin-dendro',
    ...propertyColor,
  }

  const bonusDMG =
    TalentProperty.SHIELD === scaling.property
      ? 0
      : TalentProperty.HEAL === scaling.property
      ? (scaling.bonus || 0) + stats.heal
      : (scaling.bonus || 0) + stats.dmg + stats[scaling.element.toLowerCase()] + (stats.talent[scaling.property] || 0)
  const dmg =
    _.sumBy(scaling.value, (item) => item.scaling * (item.override || stats[StatNameMap[item.multiplier]])) *
    (1 + bonusDMG)
  const totalCr = stats.cRate + (scaling.cr || 0)
  const totalCd = stats.cDmg + (scaling.cd || 0)

  const scalingArray = _.map(
    scaling.value,
    (item) =>
      `<span class="inline-flex items-center h-4">(<b class="inline-flex items-center h-4"><img class="w-4 h-4 mx-1" src="/icons/${
        StatIcons[item.multiplier]
      }" />${_.round(
        item.override || stats[StatNameMap[item.multiplier]]
      ).toLocaleString()}</b><span class="mx-1"> \u{00d7} </span><b>${toPercentage(item.scaling)}</b>)</span>`
  )
  const baseScaling = _.join(scalingArray, ' + ')
  const shouldWrap = !!scaling.flat || scaling.value.length > 1
  const baseWithFlat = scaling.flat ? _.join([baseScaling, _.round(scaling.flat)], ' + ') : baseScaling

  const formulaString = `<b class="${propertyColor[scaling.property] || 'text-red'}">${_.round(dmg)}</b> = ${
    shouldWrap ? `(${baseWithFlat})` : baseWithFlat
  }${bonusDMG > 0 ? ` \u{00d7} (1 + <b class="${elementColor[scaling.element]}">${toPercentage(bonusDMG)}</b>)` : ''}${
    scaling.multiplier > 0 ? ` \u{00d7} <b class="text-indigo-300">${toPercentage(scaling.multiplier)}</b>` : ''
  }`

  return (
    <div className="grid items-center grid-cols-8 gap-2 pr-2">
      <p className="col-span-2 text-center">{scaling.property}</p>
      <p className={classNames('col-span-1 text-center', elementColor[scaling.element])}>{scaling.element}</p>
      <Tooltip
        title={scaling.name}
        body={
          <div className="space-y-1">
            <p dangerouslySetInnerHTML={{ __html: formulaString }} />
            {!!scaling.bonus && (
              <p className="text-xs">
                Exclusive Bonus: <span className="text-yellow">{toPercentage(scaling.bonus)}</span>
              </p>
            )}
            {!!stats[scaling.element.toLowerCase()] && (
              <p className="text-xs">
                {scaling.element} Bonus:{' '}
                <span className="text-yellow">{toPercentage(stats[scaling.element.toLowerCase()])}</span>
              </p>
            )}
            {!!stats.talent[scaling.property] && (
              <p className="text-xs">
                {scaling.property} Bonus: <span className="text-yellow">{toPercentage(stats.talent[scaling.property])}</span>
              </p>
            )}
          </div>
        }
        style="w-[400px]"
      >
        <p className="col-span-1 text-center text-gray">{_.round(dmg)}</p>
      </Tooltip>
      <p className="col-span-1 text-center text-gray">
        {_.includes([TalentProperty.HEAL, TalentProperty.SHIELD], scaling.property)
          ? '-'
          : _.round(dmg * (1 + totalCd))}
      </p>
      <p className={classNames('col-span-1 font-bold text-center', propertyColor[scaling.property] || 'text-red')}>
        {_.includes([TalentProperty.HEAL, TalentProperty.SHIELD], scaling.property)
          ? _.round(dmg)
          : _.round(dmg * (1 + totalCd * totalCr))}
      </p>
      <p className="col-span-2 text-xs truncate" title={scaling.name}>
        {scaling.name}
      </p>
    </div>
  )
})
