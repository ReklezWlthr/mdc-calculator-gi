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

  const element =
    _.includes([TalentProperty.NA, TalentProperty.CA, TalentProperty.PA], scaling.property) &&
    stats.infusion &&
    scaling.element === Element.PHYSICAL
      ? stats.infusion
      : scaling.element

  const bonusDMG =
    (scaling.bonus || 0) +
    (TalentProperty.SHIELD === scaling.property
      ? 0
      : TalentProperty.HEAL === scaling.property
      ? stats.heal
      : stats.dmg + stats[element.toLowerCase()] + (stats.talent[scaling.property]?.dmg || 0))
  const dmg =
    _.sumBy(scaling.value, (item) => item.scaling * (item.override || stats[StatNameMap[item.multiplier]])) *
    (1 + bonusDMG)
  const totalCr = _.min([stats.cRate + (scaling.cr || 0) + (stats.talent[scaling.property]?.cr || 0), 1])
  const totalCd = stats.cDmg + (scaling.cd || 0) + (stats.talent[scaling.property]?.cd || 0)

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

  const critString = `<b class="${propertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg * (1 + totalCd)
  )}</b> = <b>${_.round(dmg)}</b> \u{00d7} (1 + <b>${toPercentage(totalCd)}</b>)`

  const avgString = `<b class="${propertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg * (1 + totalCd * totalCr)
  )}</b> = <b>${_.round(dmg)}</b> \u{00d7} (1 + <b>${toPercentage(totalCd)}</b> \u{00d7} <b>${toPercentage(
    totalCr
  )}</b>)`

  return (
    <div className="grid items-center grid-cols-8 gap-2 pr-2">
      <p className="col-span-2 text-center">{scaling.property}</p>
      <p className={classNames('col-span-1 text-center', elementColor[element])}>{element}</p>
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
            {!!stats[element.toLowerCase()] && (
              <p className="text-xs">
                {element} Bonus: <span className="text-yellow">{toPercentage(stats[element.toLowerCase()])}</span>
              </p>
            )}
            {!!stats.talent[scaling.property]?.dmg && (
              <p className="text-xs">
                {scaling.property} Bonus:{' '}
                <span className="text-yellow">{toPercentage(stats.talent[scaling.property]?.dmg)}</span>
              </p>
            )}
          </div>
        }
        style="w-[400px]"
      >
        <p className="col-span-1 text-center text-gray">{_.round(dmg)}</p>
      </Tooltip>
      {_.includes([TalentProperty.HEAL, TalentProperty.SHIELD], scaling.property) ? (
        <p className="col-span-1 text-center text-gray">-</p>
      ) : (
        <Tooltip
          title={'CRIT: ' + scaling.name}
          body={
            <div className="space-y-1">
              <p dangerouslySetInnerHTML={{ __html: critString }} />
              {!!scaling.cd && (
                <p className="text-xs">
                  Exclusive CRIT DMG: <span className="text-yellow">{toPercentage(scaling.cd)}</span>
                </p>
              )}
              {!!stats.talent[scaling.property]?.cd && (
                <p className="text-xs">
                  {scaling.property} CRIT DMG:{' '}
                  <span className="text-yellow">{toPercentage(stats.talent[scaling.property]?.cd)}</span>
                </p>
              )}
            </div>
          }
          style="w-[400px]"
        >
          <p className="col-span-1 text-center text-gray">{_.round(dmg * (1 + totalCd))}</p>
        </Tooltip>
      )}
      {_.includes([TalentProperty.HEAL, TalentProperty.SHIELD], scaling.property) ? (
        <p className={classNames('col-span-1 font-bold text-center', propertyColor[scaling.property] || 'text-red')}>
          {_.round(dmg)}
        </p>
      ) : (
        <Tooltip
          title={'Average: ' + scaling.name}
          body={
            <div className="space-y-1">
              <p dangerouslySetInnerHTML={{ __html: avgString }} />
              {!!scaling.cr && (
                <p className="text-xs">
                  Exclusive CRIT Rate: <span className="text-yellow">{toPercentage(scaling.cr)}</span>
                </p>
              )}
              {!!stats.talent[scaling.property]?.cr && (
                <p className="text-xs">
                  {scaling.property} CRIT Rate:{' '}
                  <span className="text-yellow">{toPercentage(stats.talent[scaling.property]?.cr)}</span>
                </p>
              )}
            </div>
          }
          style="w-[400px]"
        >
          <p className={classNames('col-span-1 font-bold text-center', propertyColor[scaling.property] || 'text-red')}>
            {_.round(dmg * (1 + totalCd * totalCr))}
          </p>
        </Tooltip>
      )}
      <p className="col-span-2 text-xs truncate" title={scaling.name}>
        {scaling.name}
      </p>
    </div>
  )
})
