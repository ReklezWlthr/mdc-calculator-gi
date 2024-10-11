import { StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'

export enum GenshinPage {
  TEAM = 'team',
  DMG = 'dmg',
  ER = 'er',
  IMPORT = 'import',
  BUILD = 'build',
  INVENTORY = 'inventory',
  CHAR = 'char',
}

export enum Tags {
  ON_FIELD = 'On-Field DPS',
  OFF_FIELD = 'Off-Field DPS',
  APP = 'Applicator',
  BURST = 'Burst Reliant',
  AMP = 'Amplify',
  HEAL = 'Heal',
  SHIELD = 'Shield',
  CONTROL = 'Control',
  BATTERY = 'Battery',
  EXPLORATION = 'Exploration',
}

export interface ICharacterStats {
  baseAtk: number
  baseHp: number
  baseDef: number
  ascAtk: number
  ascHp: number
  ascDef: number
  ascStat: string
}

export interface ICharacter {
  name: string
  weapon: WeaponType
  element: Element
  rarity: number
  stat: ICharacterStats
  codeName: string
}

export interface ITalentLevel {
  normal: number
  skill: number
  burst: number
}

export interface ICharStoreBase {
  level: number
  ascension: number
  cons: number
  cId: string
  talents: ITalentLevel
}

export interface ICharStore extends ICharStoreBase {
  // id: string
}

export interface ITeamChar extends ICharStoreBase {
  equipments: { weapon: IWeaponEquip; artifacts: string[] }
}

export interface IBuild {
  id: string
  name: string
  cId: string
  isDefault: boolean
  weapon: IWeaponEquip
  artifacts: string[]
}

export interface IArtifact {
  id: string
  name: string
  icon: string
  rarity: (2 | 3 | 4 | 5)[]
  bonus: { stat: Stats; value: number }[]
  half?: (conditionals: StatsObject) => StatsObject
  add?: (conditionals: StatsObject, weapon: WeaponType, team: ITeamChar[]) => StatsObject
  desc: string[]
  set?: string[]
}

export interface IArtifactEquip {
  id: string
  setId: string
  level: number
  type: number
  main: Stats
  quality: number
  subList: { stat: Stats; value: number }[]
}

export interface IWeapon {
  name: string
  rarity: number
  tier: number
  ascStat: string
  baseStat: number
  icon: string
  type: string
}

export interface IWeaponEquip {
  level: number
  ascension: number
  refinement: number
  wId: string
}

export enum WeaponType {
  SWORD = 'Sword',
  BOW = 'Bow',
  CATALYST = 'Catalyst',
  POLEARM = 'Polearm',
  CLAYMORE = 'Claymore',
}

export const WeaponIcon = {
  [WeaponType.SWORD]: '/Skill_A_01.png',
  [WeaponType.CLAYMORE]: '/Skill_A_04.png',
  [WeaponType.POLEARM]: '/Skill_A_03.png',
  [WeaponType.BOW]: '/Skill_A_02.png',
  [WeaponType.CATALYST]: '/Skill_A_Catalyst_MD.png',
}

export const DefaultWeaponImage = {
  [WeaponType.SWORD]: 'UI_EquipIcon_Sword_Blunt',
  [WeaponType.CATALYST]: 'UI_EquipIcon_Catalyst_Apprentice',
  [WeaponType.CLAYMORE]: 'UI_EquipIcon_Claymore_Aniki',
  [WeaponType.POLEARM]: 'UI_EquipIcon_Pole_Gewalt',
  [WeaponType.BOW]: 'UI_EquipIcon_Bow_Hunters',
}

export const DefaultWeaponName = {
  [WeaponType.SWORD]: 'Dull Blade',
  [WeaponType.CATALYST]: "Apprentice's Notes",
  [WeaponType.CLAYMORE]: 'Waster Greatsword',
  [WeaponType.POLEARM]: "Beginner's Protector",
  [WeaponType.BOW]: "Hunter's Bow",
}

export enum TalentProperty {
  NA = 'Normal Attack',
  CA = 'Charged Attack',
  PA = 'Plunging Attack',
  SKILL = 'Elemental Skill',
  BURST = 'Elemental Burst',
  HEAL = 'Heal',
  SHIELD = 'Shield',
  ADD = 'Additional Attack',
  STATIC = 'Static Attack',
  CRIT = 'CRIT DMG',
}

export enum Element {
  PHYSICAL = 'Physical',
  PYRO = 'Pyro',
  CRYO = 'Cryo',
  HYDRO = 'Hydro',
  ELECTRO = 'Electro',
  ANEMO = 'Anemo',
  GEO = 'Geo',
  DENDRO = 'Dendro',
}

export enum Stats {
  HP = 'HP',
  ATK = 'ATK',
  DEF = 'DEF',
  P_HP = 'HP%',
  P_ATK = 'ATK%',
  P_DEF = 'DEF%',
  CRIT_RATE = 'CRIT Rate',
  CRIT_DMG = 'CRIT DMG',
  ER = 'Energy Recharge',
  EM = 'Elemental Mastery',
  PHYSICAL_DMG = 'Physical DMG%',
  PYRO_DMG = 'Pyro DMG%',
  HYDRO_DMG = 'Hydro DMG%',
  CRYO_DMG = 'Cryo DMG%',
  ELECTRO_DMG = 'Electro DMG%',
  DENDRO_DMG = 'Dendro DMG%',
  GEO_DMG = 'Geo DMG%',
  ANEMO_DMG = 'Anemo DMG%',
  HEAL = 'Healing Bonus',
  I_HEALING = 'Incoming Healing',
  SHIELD = 'Shield Strength',
  ALL_DMG = 'DMG%',
  ELEMENTAL_DMG = 'Elemental DMG%',
}

export const StatIcons = {
  [Stats.P_HP]: 'stat_p_hp.png',
  [Stats.P_ATK]: 'stat_p_atk.png',
  [Stats.P_DEF]: 'stat_p_def.png',
  [Stats.EM]: 'stat_em.png',
  [Stats.PHYSICAL_DMG]: 'stat_physical.png',
  [Stats.ATK]: 'stat_atk.png',
  [Stats.HP]: 'stat_hp.png',
  [Stats.DEF]: 'stat_def.png',
  [Stats.CRIT_RATE]: 'stat_crit_rate.png',
  [Stats.CRIT_DMG]: 'stat_crit_dmg.png',
  [Stats.HEAL]: 'stat_heal.png',
  [Stats.ER]: 'stat_er.png',
}

export const Region = Object.freeze({
  1: 'Monstadt',
  2: 'Liyue',
  3: 'Inazuma',
  4: 'Sumeru',
  5: 'Fontaine',
  6: 'Natlan',
  7: 'Scheznaya',
})

export const ArtifactPiece = Object.freeze({
  1: 'Goblet of Eonothem',
  2: 'Plume of Death',
  3: 'Circlet of Logos',
  4: 'Flower of Life',
  5: 'Sands of Eon',
})

export const AscensionOptions = [
  { name: 'A0', value: '0' },
  { name: 'A1', value: '1' },
  { name: 'A2', value: '2' },
  { name: 'A3', value: '3' },
  { name: 'A4', value: '4' },
  { name: 'A5', value: '5' },
  { name: 'A6', value: '6' },
].reverse()

export const ConstellationOptions = [
  { name: 'C0', value: '0' },
  { name: 'C1', value: '1' },
  { name: 'C2', value: '2' },
  { name: 'C3', value: '3' },
  { name: 'C4', value: '4' },
  { name: 'C5', value: '5' },
  { name: 'C6', value: '6' },
]

export const RefinementOptions = [
  { name: 'R1', value: '1' },
  { name: 'R2', value: '2' },
  { name: 'R3', value: '3' },
  { name: 'R4', value: '4' },
  { name: 'R5', value: '5' },
]

export const MainStatOptions = [
  { name: Stats.ATK, value: Stats.ATK, img: '/icons/stat_atk.png' },
  { name: Stats.HP, value: Stats.HP, img: '/icons/stat_hp.png' },
  { name: Stats.P_ATK, value: Stats.P_ATK, img: '/icons/stat_p_atk.png' },
  { name: Stats.P_HP, value: Stats.P_HP, img: '/icons/stat_p_hp.png' },
  { name: Stats.P_DEF, value: Stats.P_DEF, img: '/icons/stat_p_def.png' },
  { name: Stats.EM, value: Stats.EM, img: '/icons/stat_em.png' },
  { name: Stats.ER, value: Stats.ER, img: '/icons/stat_er.png' },
  { name: Stats.CRIT_RATE, value: Stats.CRIT_RATE, img: '/icons/stat_crit_rate.png' },
  { name: Stats.CRIT_DMG, value: Stats.CRIT_DMG, img: '/icons/stat_crit_dmg.png' },
  { name: Stats.PHYSICAL_DMG, value: Stats.PHYSICAL_DMG, img: '/icons/stat_physical.png' },
  {
    name: Stats.ANEMO_DMG,
    value: Stats.ANEMO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/anemo.png',
  },
  {
    name: Stats.PYRO_DMG,
    value: Stats.PYRO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/pyro.png',
  },
  {
    name: Stats.HYDRO_DMG,
    value: Stats.HYDRO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/hydro.png',
  },
  {
    name: Stats.CRYO_DMG,
    value: Stats.CRYO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/cryo.png',
  },
  {
    name: Stats.ELECTRO_DMG,
    value: Stats.ELECTRO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/electro.png',
  },
  {
    name: Stats.GEO_DMG,
    value: Stats.GEO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/geo.png',
  },
  {
    name: Stats.DENDRO_DMG,
    value: Stats.DENDRO_DMG,
    img: 'https://cdn.wanderer.moe/genshin-impact/elements/dendro.png',
  },
]

export const SubStatOptions = [
  { name: Stats.ATK, value: Stats.ATK, img: '/icons/stat_atk.png' },
  { name: Stats.HP, value: Stats.HP, img: '/icons/stat_hp.png' },
  { name: Stats.DEF, value: Stats.DEF, img: '/icons/stat_def.png' },
  { name: Stats.P_ATK, value: Stats.P_ATK, img: '/icons/stat_p_atk.png' },
  { name: Stats.P_HP, value: Stats.P_HP, img: '/icons/stat_p_hp.png' },
  { name: Stats.P_DEF, value: Stats.P_DEF, img: '/icons/stat_p_def.png' },
  { name: Stats.EM, value: Stats.EM, img: '/icons/stat_em.png' },
  { name: Stats.ER, value: Stats.ER, img: '/icons/stat_er.png' },
  { name: Stats.CRIT_RATE, value: Stats.CRIT_RATE, img: '/icons/stat_crit_rate.png' },
  { name: Stats.CRIT_DMG, value: Stats.CRIT_DMG, img: '/icons/stat_crit_dmg.png' },
]

export const PropMap = {
  level: 4001,
  ascension: 1002,
}

export const EnkaStatsMap = {
  FIGHT_PROP_HP: Stats.HP,
  FIGHT_PROP_ATTACK: Stats.ATK,
  FIGHT_PROP_DEFENSE: Stats.DEF,
  FIGHT_PROP_HP_PERCENT: Stats.P_HP,
  FIGHT_PROP_ATTACK_PERCENT: Stats.P_ATK,
  FIGHT_PROP_DEFENSE_PERCENT: Stats.P_DEF,
  FIGHT_PROP_CRITICAL: Stats.CRIT_RATE,
  FIGHT_PROP_CRITICAL_HURT: Stats.CRIT_DMG,
  FIGHT_PROP_CHARGE_EFFICIENCY: Stats.ER,
  FIGHT_PROP_HEAL_ADD: Stats.HEAL,
  FIGHT_PROP_ELEMENT_MASTERY: Stats.EM,
  FIGHT_PROP_PHYSICAL_ADD_HURT: Stats.PHYSICAL_DMG,
  FIGHT_PROP_FIRE_ADD_HURT: Stats.PYRO_DMG,
  FIGHT_PROP_ELEC_ADD_HURT: Stats.ELECTRO_DMG,
  FIGHT_PROP_WATER_ADD_HURT: Stats.HYDRO_DMG,
  FIGHT_PROP_WIND_ADD_HURT: Stats.ANEMO_DMG,
  FIGHT_PROP_ICE_ADD_HURT: Stats.CRYO_DMG,
  FIGHT_PROP_ROCK_ADD_HURT: Stats.GEO_DMG,
  FIGHT_PROP_GRASS_ADD_HURT: Stats.DENDRO_DMG,
}

export const EnkaArtifactTypeMap = {
  EQUIP_BRACER: 4,
  EQUIP_NECKLACE: 2,
  EQUIP_SHOES: 5,
  EQUIP_RING: 1,
  EQUIP_DRESS: 3,
}

export const TravelerIconName = {
  [Element.ANEMO]: 'PlayerWind',
  [Element.GEO]: 'PlayerRock',
  [Element.ELECTRO]: 'PlayerElectric',
  [Element.DENDRO]: 'PlayerGrass',
  [Element.HYDRO]: 'PlayerWater',
}

export const CustomConditionalMap = {
  MELT_DMG: 'Melt DMG%',
  VAPE_DMG: 'Vaporize DMG%',
  BURNING_DMG: 'Burning DMG%',
  BLOOM_DMG: 'Melt DMG%',
  HYPERBLOOM_DMG: 'Hyperbloom DMG%',
  BURGEON_DMG: 'Burgeon DMG%',
  SPREAD_DMG: 'Spread DMG%',
  AGGRAVATE_DMG: 'Aggravate DMG%',
  TASER_DMG: 'Electro-Charged DMG%',
  OVERLOAD_DMG: 'Overloaded DMG%',
  SHATTER_DMG: 'Shattered DMG%',
  SWIRL_DMG: 'Swirl DMG%',
  SUPERCONDUCT_DMG: 'Superconduct DMG%',
  PYRO_F_DMG: 'Pyro Flat DMG',
  CRYO_F_DMG: 'Cryo Flat DMG',
  HYDRO_F_DMG: 'Hydro Flat DMG',
  ELECTRO_F_DMG: 'Electro Flat DMG',
  ANEMO_F_DMG: 'Anemo Flat DMG',
  GEO_F_DMG: 'Geo Flat DMG',
  DENDRO_F_DMG: 'Dendro Flat DMG',
  BASIC_F_DMG: 'Normal Attack Flat DMG',
  CHARGE_F_DMG: 'Charged Attack Flat DMG',
  PLUNGE_F_DMG: 'Plunging Attack Flat DMG',
  SKILL_F_DMG: 'Elemental Skill Flat DMG',
  BURST_F_DMG: 'Elemental Burst Flat DMG',
  BASIC_CR: 'Normal Attack CRIT Rate',
  CHARGE_CR: 'Charged Attack CRIT Rate',
  PLUNGE_CR: 'Plunging Attack CRIT Rate',
  SKILL_CR: 'Elemental Skill CRIT Rate',
  BURST_CR: 'Elemental Burst CRIT Rate',
  BASIC_CD: 'Normal Attack CRIT DMG',
  CHARGE_CD: 'Charged Attack CRIT DMG',
  PLUNGE_CD: 'Plunging Attack CRIT DMG',
  SKILL_CD: 'Elemental Skill CRIT DMG',
  BURST_CD: 'Elemental Burst CRIT DMG',
  DEF_REDUCTION: 'DEF Reduction (%)',
  ALL_TYPE_RES_PEN: 'All Type RES Reduction',
  PHYSICAL_RES_PEN: 'Physical RES Reduction',
  PYRO_RES_PEN: 'Pyro RES Reduction',
  HYDRO_RES_PEN: 'Hydro RES Reduction',
  CRYO_RES_PEN: 'Cryo RES Reduction',
  ELECTRO_RES_PEN: 'Electro RES Reduction',
  ANEMO_RES_PEN: 'Anemo RES Reduction',
  GEO_RES_PEN: 'Geo RES Reduction',
  DENDRO_RES_PEN: 'Dendro RES Reduction',
}
