export enum GenshinPage {
  TEAM = 'team',
  DMG = 'dmg',
  ER = 'er',
  IMPORT = 'import',
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
  weapon: string
  element: string
  rarity: number
  stat: ICharacterStats
}

export interface ITeamChar {
  level: number
  ascension: number
  cons: number
  data: ICharacter
  equipments: {
    weapon: IWeaponEquip
    artifacts: []
  }
}

export interface IWeapon {
  name: string
  rarity: number
  tier: number
  ascStat: string
  baseStat: number
}

export interface IWeaponEquip {
  level: number
  ascension: number
  refinement: number
  data: IWeapon
}

export enum WeaponType {
  SWORD = 'Sword',
  BOW = 'Bow',
  CATALYST = 'Catalyst',
  POLEARM = 'Polearm',
  CLAYMORE = 'Claymore',
}

export const WeaponIcon = {
  [WeaponType.SWORD]: '/icons/sword_icon.png',
  [WeaponType.CLAYMORE]: '/icons/claymore_icon.png',
  [WeaponType.POLEARM]: '/icons/polearm_icon.png',
  [WeaponType.BOW]: '/icons/bow_icon.png',
  [WeaponType.CATALYST]: '/icons/catalyst_icon.png',
}

export enum Element {
  PYRO = 'Pyro',
  CRYO = 'Cryo',
  HYDRO = 'Hydro',
  ELECTRO = 'Electro',
  ANEMO = 'Anemo',
  GEO = 'Geo',
  DENDRO = 'Dendro',
}

export const ElementIcon = {
  [Element.ANEMO]: '/icons/element_anemo.png',
  [Element.PYRO]: '/icons/element_pyro.png',
  [Element.CRYO]: '/icons/element_cryo.png',
  [Element.HYDRO]: '/icons/element_hydro.png',
  [Element.GEO]: '/icons/element_geo.png',
  [Element.ELECTRO]: '/icons/element_electro.png',
  [Element.DENDRO]: '/icons/element_dendro.png',
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
  ELECTROL_DMG = 'Electro DMG%',
  DENDRO_DMG = 'Dendro DMG%',
  GEO_DMG = 'Geo DMG%',
  ANEMO_DMG = 'Anemo DMG%',
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
  1: 'Flower of Life',
  2: 'Plume of Death',
  3: 'Sands of Eon',
  4: 'Goblet of Eonothem',
  5: 'Circlet of Logos',
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
