import { MainStatValue, SubStatMap } from '@src/domain/artifact'
import { Element, IArtifactEquip, ICharacter, ITeamChar, Stats } from '@src/domain/constant'
import {
  AscensionScaling,
  FiveStarScaling,
  FourStarScaling,
  TalentScaling,
  WeaponScaling,
  WeaponSecondaryScaling,
} from '@src/domain/scaling'
import _ from 'lodash'
import { findCharacter } from './finder'

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

export const getBaseStat = (
  base: number,
  level: number = 1,
  ascBonus: number,
  ascension: number = 0,
  rarity: number
) => {
  if (rarity !== 4 && rarity !== 5) return 0
  const scaling = rarity === 4 ? FourStarScaling : FiveStarScaling
  return base * scaling[level - 1] + ascBonus * AscensionScaling[ascension]
}

export const getWeaponBase = (
  id: string,
  tier: number,
  level: number = 0,
  ascension: number = 0,
  rarity: number = 1
) => {
  if (id === '11412') {
    rarity = 3
    tier = 2
  }
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

export const findCoefficient = (min: number, bonus: number, value: number, precision: number) => {
  const minSum = 1
  const maxSum = 6

  const margin = 0.02

  const sumCo = (arr: number[]) => _.sum(_.map(arr, (item, index) => item * (min + bonus * index)))

  const results: { value: number; co: { a: number; b: number; c: number; d: number } }[] = []

  for (let a = 0; a <= maxSum; a++) {
    for (let b = 0; b <= maxSum; b++) {
      for (let c = 0; c <= maxSum; c++) {
        for (let d = 0; d <= maxSum; d++) {
          if (a + b + c + d >= minSum && a + b + c + d <= maxSum) {
            const rd = _.floor(value, precision)
            const rs = _.round(sumCo([a, b, c, d]), precision)
            const fs = _.floor(sumCo([a, b, c, d]), precision)
            results.push({ value: sumCo([a, b, c, d]), co: { a, b, c, d } })
            if (_.includes([rs, fs], rd)) {
              return { a, b, c, d }
            }
          }
        }
      }
    }
  }

  const sorted = _.orderBy(results, ['value'], ['desc'])
  const match = _.find(sorted, (v) => _.inRange(value, v.value * (1 - margin), v.value * (1 + margin)))
  console.log(value, match)

  return (
    match?.co || {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    }
  )
}

export const getRolls = (stat: Stats, value: number) => {
  const flat = _.includes([Stats.ATK, Stats.HP, Stats.DEF, Stats.EM], stat)
  const { min, bonus } = _.find(SubStatMap, (item) => item.stat === stat)

  const roundValue = value / (flat ? 1 : 100)

  return findCoefficient(min, bonus, roundValue, flat ? 0 : 3)
}

export const correctSubStat = (stat: Stats, value: number) => {
  const data = _.find(SubStatMap, (item) => item.stat === stat)
  const low = data?.min
  const bonus = data?.bonus

  const { a, b, c, d } = getRolls(stat, value)
  const accLow = low * a
  const accMed = (low + bonus) * b
  const accHigh = (low + bonus * 2) * c
  const accHighest = (low + bonus * 3) * d

  return accLow + accMed + accHigh + accHighest
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

export const formatWeaponString = (
  detail: string,
  properties: {
    base: number
    growth: number
  }[],
  r: number,
  showMax?: boolean
) =>
  _.reduce(
    Array.from(detail?.matchAll(/{{\d+}}\%?/g) || []),
    (acc, curr) => {
      const index = curr?.[0]?.match(/\d+/)?.[0]
      const isPercentage = !!curr?.[0]?.match(/\%$/)
      return _.replace(
        acc,
        curr[0],
        showMax
          ? `<span class="text-blue">${properties[index].base + properties[index].growth * (r - 1)}${
              isPercentage ? '%' : ''
            }</span> <span class="text-desc">(${properties[index].base + properties[index].growth * 4}${
              isPercentage ? '%' : ''
            })</span>`
          : `<span class="text-desc">${properties[index].base + properties[index].growth * (r - 1)}${
              isPercentage ? '%' : ''
            }</span>`
      )
    },
    detail
  )

export const swapElement = (array: any[], index1: number, index2: number) => {
  ;[array[index1], array[index2]] = [array[index2], array[index1]]
  return array
}

export const padArray = (array: any[], length: number, fill: any) => {
  return length > array.length ? array.concat(Array(length - array.length).fill(fill)) : array
}
