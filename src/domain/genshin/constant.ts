export enum GenshinPage {
  TEAM = 'team',
  DMG = 'dmg',
  ER = 'er',
  IMPORT = 'import',
  MY_CHAR = 'myChar',
  INVENTORY = 'inventory',
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

export interface ITeamChar {
  level: number
  ascension: number
  cons: number
  cId: string
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
  rarity: (3 | 4 | 5)[]
  bonus: { stat: Stats; value: number }[]
  desc: string[]
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
  PA = 'Plunge Attack',
  SKILL = 'Elemental Skill',
  BURST = 'Elemental Burst',
  HEAL = 'Heal',
  SHIELD = 'Shield'
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
]

export const ConstellationOptions = [
  { name: 'C0', value: '0' },
  { name: 'C1', value: '1' },
  { name: 'C2', value: '2' },
  { name: 'C4', value: '4' },
  { name: 'C6', value: '6' },
]

export const RefinementOptions = [
  { name: 'R1', value: '1' },
  { name: 'R2', value: '2' },
  { name: 'R3', value: '3' },
  { name: 'R4', value: '4' },
  { name: 'R5', value: '5' },
]

export const PropMap = {
  level: 4001,
  ascension: 1002,
}
