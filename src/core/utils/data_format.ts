import { MainStatValue, SubStatMap } from '@src/domain/genshin/artifact'
import { Element, IArtifactEquip, ICharacter, ITeamChar, Stats } from '@src/domain/genshin/constant'
import {
  AscensionScaling,
  FiveStarScaling,
  FourStarScaling,
  TalentScaling,
  WeaponScaling,
  WeaponSecondaryScaling,
} from '@src/domain/genshin/scaling'
import _ from 'lodash'
import { findCharacter } from './finder'
import { StatsObject } from '@src/data/lib/stats/baseConstant'

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
  return base * scaling[level - 1] + ascBonus * AscensionScaling[ascension]
}

export const getWeaponBase = (tier: number, level: number = 0, ascension: number = 0, rarity: number = 1) => {
  const base = WeaponScaling[rarity]?.base?.[tier - 1 || 0]
  const ascBonus = WeaponScaling[rarity]?.ascension?.[_.min([rarity === 1 ? 4 : 6, ascension])]
  const scaling = WeaponScaling[_.max([rarity, 3])]?.level?.[tier || 2]?.[_.min([rarity === 1 ? 70 : 90, level]) - 1]
  return base * scaling + ascBonus
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

export const getSetCount = (artifacts: IArtifactEquip[]) => {
  const setBonus: Record<string, number> = _.reduce(
    artifacts,
    (acc, curr) => {
      if (!curr) return acc
      acc[curr.setId] ? (acc[curr.setId] += 1) : (acc[curr.setId] = 1)
      return acc
    },
    {}
  )
  return setBonus
}

export const getResonanceCount = (chars: ITeamChar[]) => {
  if (_.size(chars) < 4) return {}
  const charData = _.map(chars, (item) => findCharacter(item.cId))
  const setBonus: Record<string, number> = _.reduce(
    charData,
    (acc, curr) => {
      if (!curr) return acc
      acc[curr.element] ? (acc[curr.element] += 1) : (acc[curr.element] = 1)
      return acc
    },
    {}
  )
  return setBonus
}

export const calcScaling = (base: number, level: number, type: 'physical' | 'elemental' | 'special', sub: string) => {
  return TalentScaling[type]?.[sub]?.[level - 1] * base
}

export const calcRefinement = (base: number, growth: number, refinement: number) => {
  return base + growth * (refinement - 1)
}

export const calcAmplifying = (em: number) => {
  return 2.78 * (em / (em + 1400))
}

export const calcAdditive = (em: number) => {
  return (em * 5) / (em + 1200)
}

export const calcTransformative = (em: number) => {
  return 16 * (em / (em + 2000))
}
