import { ScalingT } from '@src/domain/genshin/conditional'
import { Element, Stats, TalentProperty } from '@src/domain/genshin/constant'
import _ from 'lodash'

export const getPlungeScaling = (
  type: 'catalyst' | 'base' | 'claymore' | 'hutao' | 'diluc' | 'high' | 'razor',
  atk: number
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
      value: atk * (plungeTypes[type]?.[0] || 0),
      element: Element.PHYSICAL,
      property: TalentProperty.PA,
    },
    {
      name: 'Low Plunge DMG',
      scale: Stats.ATK,
      value: atk * (plungeTypes[type]?.[1] || 0),
      element: Element.PHYSICAL,
      property: TalentProperty.PA,
    },
    {
      name: 'High Plunge DMG',
      scale: Stats.ATK,
      value: atk * (plungeTypes[type]?.[2] || 0),
      element: Element.PHYSICAL,
      property: TalentProperty.PA,
    },
  ]
}

export const baseStatsObject = {
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

  // Hidden Stats
  ATK_SPD: 1,
  CHARGE_ATK_SPD: 1,
  DEF_PEN: 0,

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

  // Multipliers
  BASIC_SCALING: [] as ScalingT[],
  CHARGE_SCALING: [] as ScalingT[],
  PLUNGE_SCALING: [] as ScalingT[],
  SKILL_SCALING: [] as ScalingT[],
  BURST_SCALING: [] as ScalingT[],
}

export type StatsObject = typeof baseStatsObject
