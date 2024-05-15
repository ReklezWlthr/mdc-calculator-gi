import { useStore } from '@src/data/providers/app_store_provider'
import {
  correctSubStat,
  getBaseStat,
  getMainStat,
  getResonanceCount,
  getSetCount,
  getWeaponBase,
  getWeaponBonus,
} from '../utils/data_format'
import { useCallback } from 'react'
import _ from 'lodash'
import { Element, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { AscensionGrowth } from '@src/domain/genshin/scaling'
import { findCharacter, findWeapon } from '../utils/finder'
import { ArtifactSets } from '@src/data/db/genshin/artifacts'
import { StatsObject } from '@src/data/lib/stats/baseConstant'

export const useStat = (
  cId: string,
  cLevel: number,
  cAsc: number,
  wId: string,
  wLevel: number,
  wAsc: number,
  artifacts?: string[],
  conditionals?: StatsObject
) => {
  const { artifactStore, teamStore } = useStore()

  const character = findCharacter(cId)
  const weapon = findWeapon(wId)

  const charBaseAtk = getBaseStat(character?.stat?.baseAtk, cLevel, character?.stat?.ascAtk, cAsc, character?.rarity)
  const weaponBaseAtk = getWeaponBase(weapon?.tier, wLevel, wAsc, weapon?.rarity)
  const weaponSecondary = getWeaponBonus(weapon?.baseStat, wLevel)

  const artifactData = _.map(artifacts, (aId) => _.find(artifactStore.artifacts, ['id', aId]))
  const setBonus = getSetCount(artifactStore.artifacts, artifacts)
  const resonance = getResonanceCount(teamStore.characters)

  const getTotalStat = useCallback(
    (stat: string) => {
      const fromWeapon = weapon?.ascStat === stat ? weaponSecondary : 0
      const fromAscension =
        (character?.stat?.ascStat === stat ? _.max([0, cAsc - 2]) : 0) *
        AscensionGrowth[character?.stat?.ascStat]?.[character?.rarity - 4]

      const fromMainStat = _.sum(
        _.map(
          _.filter(artifactData, (item) => item?.main === stat),
          (item) => getMainStat(item.main, item.quality, item.level)
        )
      )
      const fromSubStat = _.sum(
        _.map(artifactData, (item) =>
          _.sumBy(_.filter(item?.subList, ['stat', stat]), (sub) => correctSubStat(sub.stat, sub.value))
        )
      )
      const fromSetBonus = _.sum(
        _.map(setBonus, (value, key) => {
          if (value >= 2) {
            const bonuses = _.filter(_.find(ArtifactSets, ['id', key])?.bonus, ['stat', stat])
            return _.sumBy(bonuses, 'value')
          }
          return 0
        })
      )

      return _.sum([fromWeapon, fromAscension, fromMainStat, fromSubStat, fromSetBonus, conditionals?.[stat]])
    },
    [weapon, character, artifactData, conditionals]
  )

  const preCalculated = {
    baseAtk: charBaseAtk + weaponBaseAtk,
    baseHp: getBaseStat(character?.stat?.baseHp, cLevel, character?.stat?.ascHp, cAsc, character?.rarity),
    baseDef: getBaseStat(character?.stat?.baseDef, cLevel, character?.stat?.ascDef, cAsc, character?.rarity),
    pAtk: getTotalStat(Stats.P_ATK) + (resonance[Element.PYRO] >= 2 ? 0.25 : 0),
    pHp: getTotalStat(Stats.P_HP) + (resonance[Element.HYDRO] >= 2 ? 0.25 : 0),
    pDef: getTotalStat(Stats.P_DEF),
    fAtk: getTotalStat(Stats.ATK),
    fHp: getTotalStat(Stats.HP),
    fDef: getTotalStat(Stats.DEF),
    em: getTotalStat(Stats.EM) + (resonance[Element.DENDRO] >= 2 ? 50 : 0),
  }

  return {
    ...preCalculated,
    atk: preCalculated.baseAtk * (1 + preCalculated.pAtk) + preCalculated.fAtk,
    hp: preCalculated.baseHp * (1 + preCalculated.pHp) + preCalculated.fHp,
    def: preCalculated.baseDef * (1 + preCalculated.pDef) + preCalculated.fDef,
    cRate: 0.05 + getTotalStat(Stats.CRIT_RATE) - (character?.id === '10000054' ? 1 : 0),
    cDmg: 0.5 + getTotalStat(Stats.CRIT_DMG),
    er: 1 + getTotalStat(Stats.ER),
    iHeal: getTotalStat(Stats.I_HEALING),
    heal: getTotalStat(Stats.HEAL) + (character?.id === '10000054' ? 0.25 : 0),
    physical: getTotalStat(Stats.PHYSICAL_DMG),
    pyro: getTotalStat(Stats.PYRO_DMG),
    hydro: getTotalStat(Stats.HYDRO_DMG),
    cryo: getTotalStat(Stats.CRYO_DMG),
    electro: getTotalStat(Stats.ELECTRO_DMG),
    geo: getTotalStat(Stats.GEO_DMG),
    dendro: getTotalStat(Stats.DENDRO_DMG),
    anemo: getTotalStat(Stats.ANEMO_DMG),
    shield: getTotalStat(Stats.SHIELD) + (resonance[Element.GEO] >= 2 ? 0.15 : 0),
    dmg: getTotalStat(Stats.ALL_DMG),
    reaction: {
      transformative: 16 * (preCalculated.em / (preCalculated.em + 2000)),
      crystallize: 4.44 * (preCalculated.em / (preCalculated.em + 1400)),
      additive: 5 * (preCalculated.em / (preCalculated.em + 1200)),
      amplifying: 2.78 * (preCalculated.em / (preCalculated.em + 1400)),
    },
    infusion: conditionals?.INFUSION,
    talent: {
      [TalentProperty.NA]: {
        dmg: conditionals?.BASIC_DMG,
        cd: conditionals?.BASIC_CD,
        cr: conditionals?.BASIC_CR,
      },
      [TalentProperty.CA]: {
        dmg: conditionals?.CHARGE_DMG,
        cd: conditionals?.CHARGE_CD,
        cr: conditionals?.CHARGE_CR,
      },
      [TalentProperty.PA]: {
        dmg: conditionals?.PLUNGE_DMG,
        cd: conditionals?.PLUNGE_CD,
        cr: conditionals?.PLUNGE_CR,
      },
      [TalentProperty.SKILL]: {
        dmg: conditionals?.SKILL_DMG,
        cd: conditionals?.SKILL_CD,
        cr: conditionals?.SKILL_CR,
      },
      [TalentProperty.BURST]: {
        dmg: conditionals?.BURST_DMG,
        cd: conditionals?.BURST_CD,
        cr: conditionals?.BURST_CR,
      },
    },
  }
}

export const StatNameMap = {
  [Stats.ATK]: 'atk',
  [Stats.HP]: 'hp',
  [Stats.DEF]: 'def',
  [Stats.EM]: 'em',
}

export type StatObjectT = ReturnType<typeof useStat>
