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
  weapon: WeaponType
  element: Element
  level: number
  ascension: number
  cons: number
  rarity: number
  stat: ICharacterStats
  equipments: {
    weapon: IWeapon
    artifacts: []
  }
}

export interface IWeapon {
  name: string
  rarity: number
  tier: number
  ascStat: string
  level: number
  ascension: number
  refinement: number
  baseStat: number
  baseAtk: number
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

export const AscensionStat = Object.freeze({
  1: 'HP',
  2: 'ATK',
  3: 'DEF',
  4: 'CRIT Rate',
  5: 'CRIT DMG',
  6: 'Energy Recharge',
  7: 'Elemental Mastery',
  8: 'Physical DMG%',
  9: 'Pyro DMG%',
  10: 'Hydro DMG%',
  11: 'Cryo DMG%',
  12: 'Electro DMG%',
  13: 'Dendro DMG%',
  14: 'Geo DMG%',
  15: 'Anemo DMG%',
})

export const Region = Object.freeze({
  1: 'Monstadt',
  2: 'Liyue',
  3: 'Inazuma',
  4: 'Sumeru',
  5: 'Fontaine',
  6: 'Natlan',
  7: 'Scheznaya',
})

export const AscensionOptions = [
  {
    name: 'A0',
    value: '0',
  },
  {
    name: 'A1',
    value: '1',
  },
  {
    name: 'A2',
    value: '2',
  },
  {
    name: 'A3',
    value: '3',
  },
  {
    name: 'A4',
    value: '4',
  },
  {
    name: 'A5',
    value: '5',
  },
  {
    name: 'A6',
    value: '6',
  },
]

export const ConstellationOptions = [
  {
    name: 'C0',
    value: '0',
  },
  {
    name: 'C1',
    value: '1',
  },
  {
    name: 'C2',
    value: '2',
  },
  {
    name: 'C4',
    value: '4',
  },
  {
    name: 'C6',
    value: '6',
  },
]
