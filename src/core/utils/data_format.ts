import { MainStatValue, SubStatMap } from '@src/domain/genshin/artifact'
import { IArtifactEquip, Stats } from '@src/domain/genshin/constant'
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
  return _.round(base * scaling[level - 1] + ascBonus * AscensionScaling[ascension])
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

export const getMainStat = (main: Stats, quality: number, level: number) => {
  const entry = _.find(MainStatValue, (item) => item.rarity === quality && _.includes(item.stat, main))
  return entry?.values?.[level]
}

export const getRolls = (stat: Stats, value: number) => {
  const low = _.find(SubStatMap, (item) => item.stat === stat)?.max * 0.7
  const roundValue = value / (_.includes([Stats.ATK, Stats.HP, Stats.DEF, Stats.EM], stat) ? 1 : 100)

  return _.min([6, _.max([roundValue > 0 ? 1 : 0, _.floor(roundValue / low)])])
}

export const correctSubStat = (stat: Stats, value: number) => {
  const data = _.find(SubStatMap, (item) => item.stat === stat)
  const max = data?.max
  const low = max * 0.7
  const bonus = max * 0.1

  const roundValue = value / (_.includes([Stats.ATK, Stats.HP, Stats.DEF, Stats.EM], stat) ? 1 : 100)

  const rolls = getRolls(stat, value)
  const accLow = low * rolls
  const bonusRolls = _.round((_.max([roundValue, accLow]) % accLow) / bonus)

  return accLow + bonus * bonusRolls
}

export const getSetCount = (artifacts: IArtifactEquip[], aIds: string[]) => {
  const artifactData = _.map(aIds, (aId) => _.find(artifacts, ['id', aId]))
  const setBonus: Record<string, number> = _.reduce(
    artifactData,
    (acc, curr) => {
      if (!curr) return acc
      acc[curr.setId] ? (acc[curr.setId] += 1) : (acc[curr.setId] = 1)
      return acc
    },
    {}
  )
  return setBonus
}
