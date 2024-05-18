import { calcScaling } from '@src/core/utils/data_format'
import { IScaling } from '@src/domain/genshin/conditional'
import { Element, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'
import _ from 'lodash'

export const getPlungeScaling = (
  type: 'catalyst' | 'base' | 'claymore' | 'hutao' | 'diluc' | 'high' | 'razor',
  level: number,
  element: Element = Element.PHYSICAL,
  additionalScaling: { scaling: number; multiplier: Stats }[] = [],
  flat: number = 0,
  bonus: number = 0
) => {
  const plungeTypes = {
    catalyst: [0.5683, 1.1363, 1.4193],
    base: [0.6393, 1.2784, 1.5968], //Sword, Bow and Polearm
    claymore: [0.7459, 1.4914, 1.8629],
    hutao: [0.6542, 1.3081, 1.6339],
    high: [0.8183, 1.6363, 2.0439], //Xiao and Itto
    razor: [0.8205, 1.6406, 2.0492],
    diluc: [0.8951, 1.7897, 2.2355],
  }
  return [
    {
      name: 'Plunge DMG',
      scale: Stats.ATK,
      value: [
        { scaling: calcScaling(plungeTypes[type]?.[0] || 0, level, 'physical', '1'), multiplier: Stats.ATK },
        ...additionalScaling,
      ],
      element,
      property: TalentProperty.PA,
      bonus,
    },
    {
      name: 'Low Plunge DMG',
      scale: Stats.ATK,
      value: [
        { scaling: calcScaling(plungeTypes[type]?.[1] || 0, level, 'physical', '1'), multiplier: Stats.ATK },
        ...additionalScaling,
      ],
      element,
      property: TalentProperty.PA,
      bonus,
    },
    {
      name: 'High Plunge DMG',
      scale: Stats.ATK,
      value: [
        { scaling: calcScaling(plungeTypes[type]?.[2] || 0, level, 'physical', '1'), multiplier: Stats.ATK },
        ...additionalScaling,
      ],
      element,
      property: TalentProperty.PA,
      bonus,
    },
  ]
}

export const baseStatsObject = {
  // Base Stats
  BASE_ATK: 0,
  BASE_HP: 0,
  BASE_DEF: 0,

  // Basic Stats
  [Stats.ATK]: 0,
  [Stats.HP]: 0,
  [Stats.DEF]: 0,
  [Stats.P_ATK]: 0,
  [Stats.P_HP]: 0,
  [Stats.P_DEF]: 0,
  [Stats.CRIT_RATE]: 0.05,
  [Stats.CRIT_DMG]: 0.5,
  [Stats.EM]: 0,
  [Stats.ER]: 1,
  [Stats.HEAL]: 0,
  [Stats.I_HEALING]: 0,
  [Stats.SHIELD]: 0,

  // DMG Bonuses
  [Stats.ANEMO_DMG]: 0,
  [Stats.PYRO_DMG]: 0,
  [Stats.HYDRO_DMG]: 0,
  [Stats.ELECTRO_DMG]: 0,
  [Stats.CRYO_DMG]: 0,
  [Stats.GEO_DMG]: 0,
  [Stats.DENDRO_DMG]: 0,
  [Stats.PHYSICAL_DMG]: 0,
  [Stats.ALL_DMG]: 0,

  PHYSICAL_CD: 0,
  PYRO_CD: 0,
  HYDRO_CD: 0,
  CRYO_CD: 0,
  ELECTRO_CD: 0,
  ANEMO_CD: 0,
  GEO_CD: 0,
  DENDRO_CD: 0,

  ANEMO_F_DMG: 0,
  CRYO_F_DMG: 0,

  // Hidden Stats
  ATK_SPD: 1,
  CHARGE_ATK_SPD: 1,
  DEF_PEN: 0,
  DEF_REDUCTION: 0,
  CD_RED: 0,
  SKILL_CD_RED: 0,
  BURST_CD_RED: 0,

  // RES PEN
  ALL_TYPE_RES_PEN: 0,
  PHYSICAL_RES_PEN: 0,
  PYRO_RES_PEN: 0,
  HYDRO_RES_PEN: 0,
  CRYO_RES_PEN: 0,
  ELECTRO_RES_PEN: 0,
  ANEMO_RES_PEN: 0,
  GEO_RES_PEN: 0,
  DENDRO_RES_PEN: 0,

  VULNERABILITY: 0,

  // RES
  ALL_TYPE_RES: 0,
  PHYSICAL_RES: 0,
  PYRO_RES: 0,
  HYDRO_RES: 0,
  CRYO_RES: 0,
  ELECTRO_RES: 0,
  ANEMO_RES: 0,
  GEO_RES: 0,
  DENDRO_RES: 0,

  // Talent Boosts
  BASIC_DMG: 0,
  CHARGE_DMG: 0,
  PLUNGE_DMG: 0,
  SKILL_DMG: 0,
  BURST_DMG: 0,

  ELEMENTAL_NA_DMG: 0, // Only used by Candace

  BASIC_F_DMG: 0,
  CHARGE_F_DMG: 0,
  PLUNGE_F_DMG: 0,
  SKILL_F_DMG: 0,
  BURST_F_DMG: 0,

  BASIC_CR: 0,
  CHARGE_CR: 0,
  PLUNGE_CR: 0,
  SKILL_CR: 0,
  BURST_CR: 0,

  BASIC_CD: 0,
  CHARGE_CD: 0,
  PLUNGE_CD: 0,
  SKILL_CD: 0,
  BURST_CD: 0,

  // Reaction
  BURNING_DMG: 0,
  BLOOM_DMG: 0,
  HYPERBLOOM_DMG: 0,
  BURGEON_DMG: 0,
  VAPE_DMG: 0,
  MELT_DMG: 0,
  AGGRAVATE_DMG: 0,
  SPREAD_DMG: 0,
  SUPERCONDUCT_DMG: 0,
  TASER_DMG: 0,
  OVERLOAD_DMG: 0,
  SHATTER_DMG: 0,

  SWIRL_DMG: 0,
  PYRO_SWIRL_DMG: 0,
  HYDRO_SWIRL_DMG: 0,
  ELECTRO_SWIRL_DMG: 0,
  CRYO_SWIRL_DMG: 0,

  CORE_CR: 0,
  CORE_CD: 0,

  PYRO_MULT: 0, // Vape + Melt
  HYDRO_MULT: 0, // Vape
  CRYO_MULT: 0, // Melt
  DENDRO_F_DMG: 0, // Spread
  ELECTRO_F_DMG: 0, // Aggravate

  // Mitigation
  DMG_REDUCTION: 0,
  ATK_REDUCTION: 0,

  INFUSION: null,
  INFUSION_LOCKED: false,

  MAX_ENERGY: 60,

  // Multipliers
  BASIC_SCALING: [] as IScaling[],
  CHARGE_SCALING: [] as IScaling[],
  PLUNGE_SCALING: [] as IScaling[],
  SKILL_SCALING: [] as IScaling[],
  BURST_SCALING: [] as IScaling[],
  A1_SCALING: [] as IScaling[],
  A4_SCALING: [] as IScaling[],

  getAtk: function () {
    return this.BASE_ATK * (1 + this[Stats.P_ATK]) + this[Stats.ATK]
  },
  getHP: function () {
    return this.BASE_HP * (1 + this[Stats.P_HP]) + this[Stats.HP]
  },
  getDef: function () {
    return this.BASE_DEF * (1 + this[Stats.P_DEF]) + this[Stats.DEF]
  },

  //util
  infuse: function (infusion: Element, lock: boolean = false) {
    if (lock) {
      // If infusion cannot be overridden, lock infusion
      this.INFUSION = infusion
      this.INFUSION_LOCKED = true
      return
    }
    if (this.INFUSION_LOCKED) return // If already infused and cannot override, return
    // Check Frozen aura
    if (
      (this.INFUSION === Element.HYDRO && infusion === Element.CRYO) ||
      (this.INFUSION === Element.CRYO && infusion === Element.HYDRO)
    )
      return (this.INFUSION = Element.CRYO)
    // Continue with normal infusion priority
    const infusionPriority = [
      Element.HYDRO,
      Element.PYRO,
      Element.CRYO,
      Element.ELECTRO,
      Element.GEO,
      Element.ANEMO,
      Element.DENDRO,
    ]
    const currentPriority = _.indexOf(infusionPriority, this.INFUSION)
    const newPriority = _.indexOf(infusionPriority, infusion)
    if (currentPriority < 0 || newPriority < currentPriority) this.INFUSION = infusion
  },
}

export const TalentStatMap = {
  [TalentProperty.NA]: 'BASIC',
  [TalentProperty.CA]: 'CHARGE',
  [TalentProperty.PA]: 'PLUNGE',
  [TalentProperty.SKILL]: 'SKILL',
  [TalentProperty.BURST]: 'BURST',
}

export type StatsObject = typeof baseStatsObject
export type StatsObjectKeys = keyof typeof baseStatsObject
