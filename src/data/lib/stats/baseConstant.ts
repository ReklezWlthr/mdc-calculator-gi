import { calcScaling } from '@src/core/utils/data_format'
import { IScaling } from '@src/domain/conditional'
import { Element, Stats, TalentProperty, WeaponType } from '@src/domain/constant'
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

export interface StatsArray {
  name: string
  source: string
  value: number
  base?: string | number
  multiplier?: string | number
  flat?: number | string
}

export const baseStatsObject = {
  // Base Stats
  BASE_ATK_C: 0,
  BASE_ATK_L: 0,
  BASE_ATK: 0,
  BASE_HP: 0,
  BASE_DEF: 0,

  // Meta
  MAX_ENERGY: 0,
  NAME: '',
  WEAPON: null as WeaponType,
  ELEMENT: null as Element,

  // Basic Stats
  [Stats.ATK]: [] as StatsArray[],
  [Stats.HP]: [] as StatsArray[],
  [Stats.DEF]: [] as StatsArray[],
  [Stats.P_ATK]: [] as StatsArray[],
  [Stats.P_HP]: [] as StatsArray[],
  [Stats.P_DEF]: [] as StatsArray[],
  [Stats.CRIT_RATE]: [{ name: 'Base Value', source: 'Self', value: 0.05 }] as StatsArray[],
  [Stats.CRIT_DMG]: [{ name: 'Base Value', source: 'Self', value: 0.5 }] as StatsArray[],
  [Stats.EM]: [] as StatsArray[],
  [Stats.ER]: [{ name: 'Base Value', source: 'Self', value: 1 }] as StatsArray[],
  [Stats.HEAL]: [] as StatsArray[],
  [Stats.I_HEALING]: [] as StatsArray[],
  [Stats.SHIELD]: [] as StatsArray[],

  X_EM: [] as StatsArray[],

  // DMG Bonuses
  [Stats.ANEMO_DMG]: [] as StatsArray[],
  [Stats.PYRO_DMG]: [] as StatsArray[],
  [Stats.HYDRO_DMG]: [] as StatsArray[],
  [Stats.ELECTRO_DMG]: [] as StatsArray[],
  [Stats.CRYO_DMG]: [] as StatsArray[],
  [Stats.GEO_DMG]: [] as StatsArray[],
  [Stats.DENDRO_DMG]: [] as StatsArray[],
  [Stats.PHYSICAL_DMG]: [] as StatsArray[],
  [Stats.ALL_DMG]: [] as StatsArray[],

  PHYSICAL_CD: [] as StatsArray[],
  PYRO_CD: [] as StatsArray[],
  HYDRO_CD: [] as StatsArray[],
  CRYO_CD: [] as StatsArray[],
  ELECTRO_CD: [] as StatsArray[],
  ANEMO_CD: [] as StatsArray[],
  GEO_CD: [] as StatsArray[],
  DENDRO_CD: [] as StatsArray[],

  PHYSICAL_F_DMG: [] as StatsArray[],
  PYRO_F_DMG: [] as StatsArray[],
  HYDRO_F_DMG: [] as StatsArray[],
  GEO_F_DMG: [] as StatsArray[],
  ANEMO_F_DMG: [] as StatsArray[],
  CRYO_F_DMG: [] as StatsArray[],

  // Hidden Stats
  ATK_SPD: [{ name: 'Base Value', source: 'Self', value: 1 }] as StatsArray[],
  CHARGE_ATK_SPD: [{ name: 'Base Value', source: 'Self', value: 1 }] as StatsArray[],
  DEF_PEN: [] as StatsArray[],
  DEF_REDUCTION: [] as StatsArray[],
  CD_RED: [] as StatsArray[],
  SKILL_CD_RED: [] as StatsArray[],
  BURST_CD_RED: [] as StatsArray[],

  // RES PEN
  ALL_TYPE_RES_PEN: [] as StatsArray[],
  PHYSICAL_RES_PEN: [] as StatsArray[],
  PYRO_RES_PEN: [] as StatsArray[],
  HYDRO_RES_PEN: [] as StatsArray[],
  CRYO_RES_PEN: [] as StatsArray[],
  ELECTRO_RES_PEN: [] as StatsArray[],
  ANEMO_RES_PEN: [] as StatsArray[],
  GEO_RES_PEN: [] as StatsArray[],
  DENDRO_RES_PEN: [] as StatsArray[],

  VULNERABILITY: [] as StatsArray[],

  // RES
  ALL_TYPE_RES: [] as StatsArray[],
  PHYSICAL_RES: [] as StatsArray[],
  PYRO_RES: [] as StatsArray[],
  HYDRO_RES: [] as StatsArray[],
  CRYO_RES: [] as StatsArray[],
  ELECTRO_RES: [] as StatsArray[],
  ANEMO_RES: [] as StatsArray[],
  GEO_RES: [] as StatsArray[],
  DENDRO_RES: [] as StatsArray[],

  // Talent Boosts
  BASIC_DMG: [] as StatsArray[],
  CHARGE_DMG: [] as StatsArray[],
  PLUNGE_DMG: [] as StatsArray[],
  SKILL_DMG: [] as StatsArray[],
  BURST_DMG: [] as StatsArray[],

  ELEMENTAL_NA_DMG: [] as StatsArray[], // Only used by Candace

  BASIC_F_DMG: [] as StatsArray[],
  CHARGE_F_DMG: [] as StatsArray[],
  PLUNGE_F_DMG: [] as StatsArray[],
  SKILL_F_DMG: [] as StatsArray[],
  BURST_F_DMG: [] as StatsArray[],

  BASIC_CR: [] as StatsArray[],
  CHARGE_CR: [] as StatsArray[],
  PLUNGE_CR: [] as StatsArray[],
  SKILL_CR: [] as StatsArray[],
  BURST_CR: [] as StatsArray[],

  BASIC_CD: [] as StatsArray[],
  CHARGE_CD: [] as StatsArray[],
  PLUNGE_CD: [] as StatsArray[],
  SKILL_CD: [] as StatsArray[],
  BURST_CD: [] as StatsArray[],

  // Reaction
  BURNING_DMG: [] as StatsArray[],
  BLOOM_DMG: [] as StatsArray[],
  HYPERBLOOM_DMG: [] as StatsArray[],
  BURGEON_DMG: [] as StatsArray[],
  VAPE_DMG: [] as StatsArray[],
  MELT_DMG: [] as StatsArray[],
  AGGRAVATE_DMG: [] as StatsArray[],
  SPREAD_DMG: [] as StatsArray[],
  SUPERCONDUCT_DMG: [] as StatsArray[],
  TASER_DMG: [] as StatsArray[],
  OVERLOAD_DMG: [] as StatsArray[],
  SHATTER_DMG: [] as StatsArray[],

  SWIRL_DMG: [] as StatsArray[],
  PYRO_SWIRL_DMG: [] as StatsArray[],
  HYDRO_SWIRL_DMG: [] as StatsArray[],
  ELECTRO_SWIRL_DMG: [] as StatsArray[],
  CRYO_SWIRL_DMG: [] as StatsArray[],

  CORE_CR: [] as StatsArray[],
  CORE_CD: [] as StatsArray[],

  PYRO_MULT: [] as StatsArray[], // Vape + Melt
  HYDRO_MULT: [] as StatsArray[], // Vape
  CRYO_MULT: [] as StatsArray[], // Melt
  DENDRO_F_DMG: [] as StatsArray[], // Spread
  ELECTRO_F_DMG: [] as StatsArray[], // Aggravate

  // Mitigation
  DMG_REDUCTION: [] as StatsArray[],
  M_DMG_REDUCTION: [] as StatsArray[], // Dehya's Skill gives multiplicative bonus instead
  ATK_REDUCTION: [] as StatsArray[],

  INFUSION: null,
  INFUSION_LOCKED: false,

  // Multipliers
  BASIC_SCALING: [] as IScaling[],
  CHARGE_SCALING: [] as IScaling[],
  PLUNGE_SCALING: [] as IScaling[],
  SKILL_SCALING: [] as IScaling[],
  BURST_SCALING: [] as IScaling[],
  A1_SCALING: [] as IScaling[],
  A4_SCALING: [] as IScaling[],

  getAtk: function (exclude?: boolean) {
    return (
      this.BASE_ATK * (1 + _.sumBy(this[Stats.P_ATK], 'value')) +
      _.sumBy(this[Stats.ATK], 'value') +
      (exclude ? 0 : this.getValue('X_ATK'))
    )
  },
  getHP: function (exclude?: boolean) {
    return (
      this.BASE_HP * (1 + _.sumBy(this[Stats.P_HP], 'value')) +
      _.sumBy(this[Stats.HP], 'value') +
      (exclude ? 0 : this.getValue('X_HP'))
    )
  },
  getDef: function () {
    return this.BASE_DEF * (1 + _.sumBy(this[Stats.P_DEF], 'value')) + _.sumBy(this[Stats.DEF], 'value')
  },
  getEM: function (exclude?: boolean) {
    return _.sumBy(this[Stats.EM], 'value') + (exclude ? 0 : this.getValue('X_EM'))
  },
  getValue: function (key: string, exclude?: StatsArray[]) {
    return (
      _.sumBy(
        _.size(exclude)
          ? _.filter(this[key], (item) => _.every(exclude, (e) => !(e.source === item.source && e.name === item.name)))
          : this[key],
        'value'
      ) || 0
    )
  },

  CALLBACK: [] as ((base: any, all: any[]) => any)[],

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
export type StatsObjectKeysT = keyof typeof baseStatsObject

export const StatsObjectKeys = _.mapValues(baseStatsObject, (_, key) => key)
