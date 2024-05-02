export enum GenshinPage {
  TEAM = 'team',
  DMG = 'dmg',
  ER = 'er',
  IMPORT = 'import',
}

export enum WeaponType {
  SWORD = 'Sword',
  BOW = 'Bow',
  CATALYST = 'Catalyst',
  POLEARM = 'Polearm',
  CLAYMORE = 'Claymore',
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

export const AscensionStat = Object.freeze({
  1: 'HP',
  2: 'ATK',
  3: 'DEF',
  4: 'CRIT Rate',
  5: 'CRIT DMG',
  6: 'Energy Recharge',
  7: 'Elemental Mastery',
  8: 'Physical DMG Bonus',
  9: 'Pyro DMG Bonus',
  10: 'Hydro DMG Bonus',
  11: 'Cryo DMG Bonus',
  12: 'Electro DMG Bonus',
  13: 'Dendro DMG Bonus',
  14: 'Geo DMG Bonus',
  15: 'Anemo DMG Bonus',
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
