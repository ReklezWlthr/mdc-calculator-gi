import { Stats } from '@src/domain/genshin/constant'

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
  BASIC_SCALING: [],
  CHARGE_SCALING: [],
  PLUNGE_SCALING: [],
  SKILL_SCALING: [],
  BURST_SCALING: [],
}

export type StatsObject = typeof baseStatsObject
