import { StatsObject, StatsObjectKeys, TalentStatMap } from '@src/data/lib/stats/baseConstant'
import { IScaling } from '@src/domain/conditional'
import { Element, StatIcons, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import _ from 'lodash'
import { CalculatorStore } from '@src/data/stores/calculator_store'
import React from 'react'
import { SetupStore } from '@src/data/stores/setup_store'

export const PropertyColor = {
  [TalentProperty.HEAL]: 'text-heal',
  [TalentProperty.SHIELD]: 'text-indigo-300',
}

export const BaseElementColor = {
  [Element.PHYSICAL]: 'text-gray',
  [Element.ANEMO]: 'text-genshin-anemo',
  [Element.PYRO]: 'text-genshin-pyro',
  [Element.HYDRO]: 'text-genshin-hydro',
  [Element.CRYO]: 'text-genshin-cryo',
  [Element.ELECTRO]: 'text-genshin-electro',
  [Element.GEO]: 'text-genshin-geo',
  [Element.DENDRO]: 'text-genshin-dendro',
}

export const ElementColor = {
  ...BaseElementColor,
  ...PropertyColor,
}

export const damageStringConstruct = (
  team: { name: string; stats: StatsObject }[],
  calculatorStore: CalculatorStore | SetupStore,
  scaling: IScaling,
  stats: StatsObject,
  level: number
) => {
  if (!scaling || !stats || !level) return

  const element =
    _.includes([TalentProperty.NA, TalentProperty.CA, TalentProperty.PA], scaling.property) &&
    stats.INFUSION &&
    scaling.element === Element.PHYSICAL
      ? stats.INFUSION
      : scaling.element || ''

  const talentDmg = stats.getValue(`${TalentStatMap[scaling.property]}_DMG`) || 0
  const talentFlat = stats.getValue(`${TalentStatMap[scaling.property]}_F_DMG`) || 0
  const talentCr = stats.getValue(`${TalentStatMap[scaling.property]}_CR`) || 0
  const talentCd = stats.getValue(`${TalentStatMap[scaling.property]}_CD`) || 0
  const elementDmg =
    stats.getValue(`${element} DMG%`) + (element !== Element.PHYSICAL ? stats.getValue(Stats.ELEMENTAL_DMG) : 0)
  const elementCd = stats.getValue(`${element.toUpperCase()}_CD`) || 0
  const elementFlat = stats.getValue(`${element.toUpperCase()}_F_DMG`) || 0 // Faruzan & Shenhe
  const elementNa =
    element !== Element.PHYSICAL && scaling.property === TalentProperty.NA
      ? stats.getValue(StatsObjectKeys.ELEMENTAL_NA_DMG)
      : 0
  const elementMult = stats.getValue(`${element.toUpperCase()}_MULT`) || 1
  const defPen = (stats.getValue(StatsObjectKeys.DEF_PEN) || 0) + (scaling.defPen || 0)

  const defMult = calculatorStore.getDefMult(level, defPen, stats.getValue(StatsObjectKeys.DEF_REDUCTION)) || 1
  const resMult = calculatorStore.getResMult(
    element,
    (stats.getValue(`${element.toUpperCase()}_RES_PEN`) || 0) + (stats.getValue(StatsObjectKeys.ALL_TYPE_RES_PEN) || 0)
  )
  const isDamage = !_.includes([TalentProperty.SHIELD, TalentProperty.HEAL], scaling.property)
  const enemyMod = isDamage ? (scaling.property === TalentProperty.STATIC ? 1 : defMult) * resMult : 1

  const statForScale = {
    [Stats.ATK]: stats.getAtk(),
    [Stats.DEF]: stats.getDef(),
    [Stats.HP]: stats.getHP(),
    [Stats.EM]: stats.getEM(),
  }

  const healing = stats.getValue(Stats.HEAL) + (scaling.self ? stats.getValue(Stats.I_HEALING) : 0)
  const bonusDMG =
    (scaling.bonus || 0) +
    (TalentProperty.SHIELD === scaling.property
      ? 0
      : TalentProperty.HEAL === scaling.property
      ? healing
      : stats.getValue(Stats.ALL_DMG) +
        elementDmg +
        elementNa +
        talentDmg +
        stats.getValue(StatsObjectKeys.VULNERABILITY)) // Vulnerability effectively stacks with DMG Bonuses
  const raw =
    _.sumBy(scaling.value, (item) => item.scaling * (item.override || statForScale[item.multiplier])) +
    (scaling.flat || 0) +
    elementFlat +
    talentFlat
  const dmg =
    raw *
    (1 + bonusDMG) *
    (scaling.multiplier || 1) *
    elementMult *
    enemyMod *
    (calculatorStore.mode === 'total' ? scaling.hit || 1 : 1)

  const totalCr =
    scaling.property === TalentProperty.CRIT
      ? 1
      : _.max([_.min([stats.getValue(Stats.CRIT_RATE) + (scaling.cr || 0) + talentCr, 1]), 0])
  const totalCd =
    scaling.property === TalentProperty.CRIT
      ? 0
      : stats.getValue(Stats.CRIT_DMG) + (scaling.cd || 0) + talentCd + elementCd
  const totalFlat = (scaling.flat || 0) + elementFlat + talentFlat

  const totalCrit = _.round(dmg * (1 + totalCd))
  const totalAvg = _.round(dmg * (1 + totalCd * totalCr))

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

  const formulaString = `<b class="${PropertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg
  ).toLocaleString()}</b> = ${shouldWrap ? `(${baseWithFlat})` : baseWithFlat}${
    scaling.hit && calculatorStore.mode === 'total'
      ? ` \u{00d7} <b class="text-desc">${scaling.hit}</b> <i class="text-[10px]">HITS</i>`
      : ''
  }${bonusDMG > 0 ? ` \u{00d7} (1 + <b class="${ElementColor[scaling.element]}">${toPercentage(bonusDMG)}</b>)` : ''}${
    scaling.multiplier > 0 ? ` \u{00d7} <b class="text-indigo-300">${toPercentage(scaling.multiplier, 2)}</b>` : ''
  }${elementMult > 1 ? ` \u{00d7} <b class="text-amber-400">${toPercentage(elementMult, 2)}</b>` : ''}${
    isDamage
      ? `${
          scaling.property !== TalentProperty.STATIC
            ? ` \u{00d7} <b class="text-orange-300">${toPercentage(defMult, 2)}</b> <i class="text-[10px]">DEF</i>`
            : ''
        }  \u{00d7} <b class="text-teal-200">${toPercentage(resMult, 2)}</b> <i class="text-[10px]">RES</i>`
      : ''
  }`

  const critString = `<b class="${PropertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg * (1 + totalCd)
  ).toLocaleString()}</b> = <b>${_.round(
    dmg
  ).toLocaleString()}</b> \u{00d7} <span class="inline-flex items-center h-4">(1 + <b class="inline-flex items-center h-4"><img class="w-4 h-4 mx-1" src="/icons/stat_crit_dmg.png" />${toPercentage(
    totalCd
  )}</b>)</span>`

  const avgString = `<b class="${PropertyColor[scaling.property] || 'text-red'}">${_.round(
    dmg * (1 + totalCd * totalCr)
  ).toLocaleString()}</b> = <b>${_.round(
    dmg
  ).toLocaleString()}</b> \u{00d7} <span class="inline-flex items-center h-4">(1 + <b class="inline-flex items-center h-4"><img class="w-4 h-4 mx-1" src="/icons/stat_crit_dmg.png" />${toPercentage(
    totalCd
  )}</b><span class="ml-1"> \u{00d7} </span><b class="inline-flex items-center h-4"><img class="w-4 h-4 mx-1" src="/icons/stat_crit_rate.png" />${toPercentage(
    totalCr
  )}</b>)</span>`

  const DmgBody = (
    <div className="space-y-1">
      <p dangerouslySetInnerHTML={{ __html: formulaString }} />
      {!!scaling.bonus && (
        <p className="text-xs">
          Talent-Exclusive Bonus: <span className="text-desc">{toPercentage(scaling.bonus)}</span>
        </p>
      )}
      {!!elementDmg && (
        <p className="text-xs">
          {element} Bonus: <span className="text-desc">{toPercentage(elementDmg)}</span>
        </p>
      )}
      {!!(talentDmg || elementNa) && (
        <p className="text-xs">
          {scaling.property} Bonus: <span className="text-desc">{toPercentage(talentDmg + elementNa)}</span>
        </p>
      )}
      {!!stats.getValue(StatsObjectKeys.VULNERABILITY) && (
        <p className="text-xs">
          Vulnerability Bonus:{' '}
          <span className="text-desc">{toPercentage(stats.getValue(StatsObjectKeys.VULNERABILITY))}</span>
        </p>
      )}
      {scaling.property === TalentProperty.SHIELD && (
        <>
          <p className="text-xs">
            Off-Element Absorption:{' '}
            <span className="text-desc">{_.round(dmg * (1 + stats.getValue(Stats.SHIELD))).toLocaleString()}</span>
          </p>
          <p className="text-xs">
            On-Element Absorption:{' '}
            <span className="text-desc">
              {_.round(dmg * (2.5 * (1 + stats.getValue(Stats.SHIELD)))).toLocaleString()}
            </span>
          </p>
          <p className="text-xs">
            Geo Shield Absorption:{' '}
            <span className="text-desc">
              {_.round(dmg * (1.5 * (1 + stats.getValue(Stats.SHIELD)))).toLocaleString()}
            </span>
          </p>
        </>
      )}
      {scaling.property === TalentProperty.HEAL && !scaling.self && (
        <div className="space-y-1 text-xs">
          <b>✦ Teammate Incoming Healing ✦</b>
          {_.map(
            team,
            (item) =>
              item && (
                <p key={item.name}>
                  {item.name}:{' '}
                  <span className="text-desc">
                    {_.round(
                      raw * (1 + stats.getValue(Stats.HEAL) + item.stats?.getValue(Stats.I_HEALING))
                    ).toLocaleString()}
                  </span>
                </p>
              )
          )}
        </div>
      )}
    </div>
  )

  const CritBody = (
    <div className="space-y-1">
      <p dangerouslySetInnerHTML={{ __html: critString }} />
      {!!scaling.cd && (
        <p className="text-xs">
          Talent-Exclusive CRIT DMG: <span className="text-desc">{toPercentage(scaling.cd)}</span>
        </p>
      )}
      {!!elementCd && (
        <p className="text-xs">
          {element} CRIT DMG: <span className="text-desc">{toPercentage(elementCd)}</span>
        </p>
      )}
      {!!talentCd && (
        <p className="text-xs">
          {scaling.property} CRIT DMG: <span className="text-desc">{toPercentage(talentCd)}</span>
        </p>
      )}
    </div>
  )

  const AvgBody = (
    <div className="space-y-1">
      <p dangerouslySetInnerHTML={{ __html: avgString }} />
      {!!scaling.cr && (
        <p className="text-xs">
          Talent-Exclusive CRIT Rate: <span className="text-desc">{toPercentage(scaling.cr)}</span>
        </p>
      )}
      {!!talentCr && (
        <p className="text-xs">
          {scaling.property} CRIT Rate: <span className="text-desc">{toPercentage(talentCr)}</span>
        </p>
      )}
    </div>
  )

  return {
    string: { formulaString, critString, avgString },
    component: {
      DmgBody,
      CritBody,
      AvgBody,
    },
    number: { dmg, totalCrit, totalAvg },
    element,
  }
}

export type StringConstructor = ReturnType<typeof damageStringConstruct>
