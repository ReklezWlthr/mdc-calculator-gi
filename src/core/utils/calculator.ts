import {
  correctSubStat,
  getBaseStat,
  getMainStat,
  getResonanceCount,
  getSetCount,
  getWeaponBase,
  getWeaponBonus,
} from '../utils/data_format'
import _ from 'lodash'
import { Element, IArtifactEquip, ITeamChar, IWeaponEquip, Stats } from '@src/domain/genshin/constant'
import { AscensionGrowth } from '@src/domain/genshin/scaling'
import { findCharacter, findWeapon } from '../utils/finder'
import { ArtifactSets } from '@src/data/db/genshin/artifacts'
import { baseStatsObject, StatsObject } from '@src/data/lib/stats/baseConstant'

export const calculateOutOfCombat = (
  conditionals: StatsObject,
  selected: number,
  team: ITeamChar[],
  artifacts: IArtifactEquip[]
) => {
  let base = calculateBase(conditionals, team[selected], team[selected]?.equipments?.weapon)
  base = addArtifactStats(base, artifacts)
  base = addResonance(base, team)

  return base
}

export const calculateBase = (conditionals: StatsObject, char: ITeamChar, weapon: IWeaponEquip) => {
  const character = findCharacter(char?.cId)
  const weaponData = findWeapon(weapon?.wId)

  const charBaseAtk = getBaseStat(
    character?.stat?.baseAtk,
    char?.level,
    character?.stat?.ascAtk,
    char?.ascension,
    character?.rarity
  )
  const weaponBaseAtk = getWeaponBase(weaponData?.tier, weapon?.level, weapon?.ascension, weaponData?.rarity)
  const weaponSecondary = getWeaponBonus(weaponData?.baseStat, weapon?.level)

  // Get Base
  conditionals.BASE_ATK = charBaseAtk + weaponBaseAtk
  conditionals.BASE_HP = getBaseStat(
    character?.stat?.baseHp,
    char?.level,
    character?.stat?.ascHp,
    char?.ascension,
    character?.rarity
  )
  conditionals.BASE_DEF = getBaseStat(
    character?.stat?.baseDef,
    char?.level,
    character?.stat?.ascDef,
    char?.ascension,
    character?.rarity
  )

  // Get Ascension
  conditionals[weaponData?.ascStat] += weaponSecondary
  conditionals[character?.stat?.ascStat] +=
    _.max([0, char?.ascension - 2]) * AscensionGrowth[character?.stat?.ascStat]?.[character?.rarity - 4]

  // Kokomi Passive
  if (character?.id === '10000054') {
    conditionals[Stats.CRIT_RATE] -= 1
    conditionals[Stats.HEAL] += 0.25
  }

  // Xingqiu A4
  if (character?.id === '10000025' && char?.ascension >= 4) {
    conditionals[Stats.HYDRO_DMG] += 0.2
  }

  return conditionals
}

export const addArtifactStats = (conditionals: StatsObject, artifacts: IArtifactEquip[]) => {
  const setBonus = getSetCount(artifacts)
  _.forEach(artifacts, (item) => {
    conditionals[item.main] += getMainStat(item.main, item.quality, item.level)
    _.forEach(item.subList, (sub) => {
      conditionals[sub.stat] += correctSubStat(sub.stat, sub.value)
    })
  })
  _.forEach(setBonus, (value, key) => {
    if (value >= 2) {
      const bonuses = _.find(ArtifactSets, ['id', key])?.bonus
      _.forEach(bonuses, (item) => {
        conditionals[item.stat] += item.value
      })
    }
  })

  return conditionals
}

export const addResonance = (conditionals: StatsObject, team: ITeamChar[]) => {
  const resonance = getResonanceCount(team)

  if (resonance[Element.PYRO] >= 2) conditionals[Stats.P_ATK] = +0.25
  if (resonance[Element.HYDRO] >= 2) conditionals[Stats.P_HP] = +0.25
  if (resonance[Element.DENDRO] >= 2) conditionals[Stats.EM] = +50
  if (resonance[Element.GEO] >= 2) conditionals[Stats.SHIELD] = +0.15

  return conditionals
}

export const getTeamOutOfCombat = (chars: ITeamChar[], artifacts: IArtifactEquip[]) => {
  return [
    calculateOutOfCombat(
      _.cloneDeep(baseStatsObject),
      0,
      chars,
      _.filter(artifacts, (item) => _.includes(chars?.[0]?.equipments?.artifacts, item.id))
    ),
    calculateOutOfCombat(
      _.cloneDeep(baseStatsObject),
      1,
      chars,
      _.filter(artifacts, (item) => _.includes(chars?.[1]?.equipments?.artifacts, item.id))
    ),
    calculateOutOfCombat(
      _.cloneDeep(baseStatsObject),
      2,
      chars,
      _.filter(artifacts, (item) => _.includes(chars?.[2]?.equipments?.artifacts, item.id))
    ),
    calculateOutOfCombat(
      _.cloneDeep(baseStatsObject),
      3,
      chars,
      _.filter(artifacts, (item) => _.includes(chars?.[3]?.equipments?.artifacts, item.id))
    ),
  ]
}
