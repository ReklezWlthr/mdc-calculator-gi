import {
  AscensionScaling,
  FiveStarScaling,
  FourStarScaling,
  WeaponScaling,
  WeaponSecondaryScaling,
} from '@src/domain/genshin/scaling'
import _ from 'lodash'

export const findBaseLevel = (ascension: number) => {
  if (ascension < 0 || ascension > 6) return 0
  if (ascension === 0) return 1
  if (ascension === 1) return 20
  return (ascension + 2) * 10
}

export const findMaxLevel = (ascension: number) => {
  if (ascension < 0 || ascension > 6) return 0
  if (ascension === 0) return 20
  if (ascension === 1) return 40
  return findBaseLevel(ascension) + 10
}

export const isLevelInRange = (ascension: number, level: number) => {
  const low = findBaseLevel(ascension)
  const high = findMaxLevel(ascension)
  return level >= low && level <= high
}

export const getBaseStat = (base: number, level: number, ascBonus: number, ascension: number, rarity: number) => {
  if (rarity !== 4 && rarity !== 5) return 0
  const scaling = rarity === 4 ? FourStarScaling : FiveStarScaling
  return _.floor(base * scaling[level - 1] + ascBonus * AscensionScaling[ascension])
}

export const getWeaponBase = (tier: number, level: number, ascension: number, rarity: number) => {
  if (!_.includes([3, 4, 5], rarity)) return 0
  const base = WeaponScaling[rarity]?.base?.[tier - 1]
  const ascBonus = WeaponScaling[rarity]?.ascension?.[ascension]
  const scaling = WeaponScaling[rarity]?.level?.[tier]?.[level - 1]
  return _.round(base * scaling + ascBonus)
}

export const getWeaponBonus = (base: number, level: number) => {
  const index = _.floor(level / 5)
  const scaling = WeaponSecondaryScaling[index]
  return base * scaling
}
