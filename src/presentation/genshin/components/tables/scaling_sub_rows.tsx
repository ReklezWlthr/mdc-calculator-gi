import { IScaling } from '@src/domain/genshin/conditional'
import { Element, StatIcons, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { Tooltip } from '@src/presentation/components/tooltip'
import { toPercentage } from '@src/core/utils/converter'
import { StatsObject } from '@src/data/lib/stats/baseConstant'
import { TalentStatMap } from '../../../../data/lib/stats/baseConstant'

interface ScalingSubRowsProps {
  scaling: IScaling
  stats: StatsObject
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
    stats.INFUSION &&
    scaling.element === Element.PHYSICAL
      ? stats.INFUSION
      : scaling.element

  const talentDmg = stats[`${TalentStatMap[scaling.property]}_DMG`] || 0
  const talentFlat = stats[`${TalentStatMap[scaling.property]}_F_DMG`] || 0
  const talentCr = stats[`${TalentStatMap[scaling.property]}_CR`] || 0
  const talentCd = stats[`${TalentStatMap[scaling.property]}_CD`] || 0
  const elementCd = stats[`${element.toUpperCase()}_CD`] || 0
  const elementFlat = stats[`${element.toUpperCase()}_F_DMG`] || 0 // Faruzan & Shenhe
  const elementNa = element !== Element.PHYSICAL && scaling.property === TalentProperty.NA ? stats.ELEMENTAL_NA_DMG : 0

  const statForScale = {
    [Stats.ATK]: stats.getAtk(),
    [Stats.DEF]: stats.getDef(),
    [Stats.HP]: stats.getHP(),
    [Stats.EM]: stats[Stats.EM],
  }

  const bonusDMG =
    (scaling.bonus || 0) +
    (TalentProperty.SHIELD === scaling.property
      ? 0
      : TalentProperty.HEAL === scaling.property
      ? stats[Stats.HEAL]
      : stats[Stats.ALL_DMG] + stats[`${element} DMG%`] + elementNa + talentDmg + stats.VULNERABILITY) // Vulnerability effectively stacks with DMG Bonuses
  const dmg =
    (_.sumBy(scaling.value, (item) => item.scaling * (item.override || statForScale[item.multiplier])) +
      (scaling.flat || 0) +
      elementFlat +
      talentFlat) *
    (1 + bonusDMG) *
    (scaling.multiplier || 1)
  const totalCr = _.max([_.min([stats[Stats.CRIT_RATE] + (scaling.cr || 0) + talentCr, 1]), 0])
  const totalCd = stats[Stats.CRIT_DMG] + (scaling.cd || 0) + talentCd + elementCd
  const totalFlat = (scaling.flat || 0) + elementFlat + talentFlat

  const scalingArray = _.map(
    scaling.value,
    (item) =>
      `<span class="inline-flex items-center h-4">(<b class="inline-flex items-center h-4"><img class="w-4 h-4 mx-1" src="/icons/${
        StatIcons[item.multiplier]
      }" />${_.round(
        item.override || statForScale[item.multiplier]
      ).toLocaleString()}</b><span class="mx-1"> \u{00d7} </span><b>${toPercentage(item.scaling, 2)}</b>)</span>`
  )
  const baseScaling = _.join(scalingArray, ' + ')
  const shouldWrap = !!totalFlat || scaling.value.length > 1
  const baseWithFlat = totalFlat ? _.join([baseScaling, _.round(totalFlat).toLocaleString()], ' + ') : baseScaling

  const formulaString = `<b class="${propertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg
  ).toLocaleString()}</b> = ${shouldWrap ? `(${baseWithFlat})` : baseWithFlat}${
    bonusDMG > 0 ? ` \u{00d7} (1 + <b class="${elementColor[scaling.element]}">${toPercentage(bonusDMG)}</b>)` : ''
  }${scaling.multiplier > 0 ? ` \u{00d7} <b class="text-indigo-300">${toPercentage(scaling.multiplier, 2)}</b>` : ''}`

  const critString = `<b class="${propertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg * (1 + totalCd)
  ).toLocaleString()}</b> = <b>${_.round(dmg).toLocaleString()}</b> \u{00d7} (1 + <b>${toPercentage(totalCd)}</b>)`

  const avgString = `<b class="${propertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg * (1 + totalCd * totalCr)
  ).toLocaleString()}</b> = <b>${_.round(dmg).toLocaleString()}</b> \u{00d7} (1 + <b>${toPercentage(
    totalCd
  )}</b> \u{00d7} <b>${toPercentage(totalCr)}</b>)`

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
                Talent-Exclusive Bonus: <span className="text-yellow">{toPercentage(scaling.bonus)}</span>
              </p>
            )}
            {!!stats[`${element} DMG%`] && (
              <p className="text-xs">
                {element} Bonus: <span className="text-yellow">{toPercentage(stats[`${element} DMG%`])}</span>
              </p>
            )}
            {!!(talentDmg || elementNa) && (
              <p className="text-xs">
                {scaling.property} Bonus: <span className="text-yellow">{toPercentage(talentDmg + elementNa)}</span>
              </p>
            )}
            {!!stats.VULNERABILITY && (
              <p className="text-xs">
                Vulnerability Bonus: <span className="text-yellow">{toPercentage(stats.VULNERABILITY)}</span>
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
                  Talent-Exclusive CRIT DMG: <span className="text-yellow">{toPercentage(scaling.cd)}</span>
                </p>
              )}
              {!!elementCd && (
                <p className="text-xs">
                  {element} CRIT DMG: <span className="text-yellow">{toPercentage(elementCd)}</span>
                </p>
              )}
              {!!talentCd && (
                <p className="text-xs">
                  {scaling.property} CRIT DMG: <span className="text-yellow">{toPercentage(talentCd)}</span>
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
                  Talent-Exclusive CRIT Rate: <span className="text-yellow">{toPercentage(scaling.cr)}</span>
                </p>
              )}
              {!!talentCr && (
                <p className="text-xs">
                  {scaling.property} CRIT Rate: <span className="text-yellow">{toPercentage(talentCr)}</span>
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
