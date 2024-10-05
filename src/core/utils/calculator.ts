import {
  calcAdditive,
  calcAmplifying,
  correctSubStat,
  getBaseStat,
  getMainStat,
  getResonanceCount,
  getSetCount,
  getWeaponBase,
  getWeaponBonus,
} from '../utils/data_format'
import _ from 'lodash'
import { Element, IArtifactEquip, ITeamChar, IWeaponEquip, Stats, WeaponType } from '@src/domain/constant'
import { AscensionGrowth, BaseReactionDmg } from '@src/domain/scaling'
import { findCharacter, findWeapon } from '../utils/finder'
import { ArtifactSets } from '@src/data/db/artifacts'
import { baseStatsObject, StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import WeaponBonus from '@src/data/lib/stats/conditionals/weapons/weapon_bonus'

export const calculateOutOfCombat = (
  conditionals: StatsObject,
  selected: number,
  team: ITeamChar[],
  artifacts: IArtifactEquip[],
  applyResonance: boolean,
  includeTeam: boolean
) => {
  if (!_.size(team) || !team?.[selected]) return conditionals
  const base = calculateBase(conditionals, team[selected], team[selected]?.equipments?.weapon, includeTeam ? team : [])
  const withArtifacts = addArtifactStats(base, artifacts)
  const final = applyResonance ? addResonance(withArtifacts, team) : withArtifacts

  return final
}

export const calculateFinal = (conditionals: StatsObject) => {
  const cb = conditionals.CALLBACK
  let x = conditionals
  _.forEach(cb, (item) => {
    x = item(x, [])
  })
  return x
}

export const calculateBase = (conditionals: StatsObject, char: ITeamChar, weapon: IWeaponEquip, team: ITeamChar[]) => {
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
  const weaponBonus = _.find(WeaponBonus, (item) => item.id === weapon?.wId)

  conditionals.NAME = character?.name?.replaceAll(/\(\w+\)/g, '')?.trim()
  conditionals.ELEMENT = character?.element
  conditionals.WEAPON = character?.weapon
  conditionals.MAX_ENERGY = character?.stat?.energy

  // Get Base
  conditionals.BASE_ATK = charBaseAtk + weaponBaseAtk
  conditionals.BASE_ATK_C = charBaseAtk
  conditionals.BASE_ATK_L = weaponBaseAtk
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
  conditionals[weaponData?.ascStat]?.push({
    value: weaponSecondary,
    source: weaponData?.name,
    name: 'Secondary Stat',
  })
  conditionals[character?.stat?.ascStat]?.push({
    value: _.max([0, char?.ascension - 2]) * AscensionGrowth[character?.stat?.ascStat]?.[character?.rarity - 4],
    source: 'Self',
    name: 'Ascension Stat',
  })

  conditionals = weaponBonus?.scaling(conditionals, weapon?.refinement, team) || conditionals

  // Kokomi Passive
  if (character?.id === '10000054') {
    conditionals[Stats.CRIT_RATE].push({
      value: -1,
      source: 'Self',
      name: 'Utility Passive',
    })
    conditionals[Stats.HEAL].push({
      value: 0.25,
      source: 'Self',
      name: 'Utility Passive',
    })
  }

  // Anemo MC C2
  if (_.includes(['10000005-504', '10000005-704'], character?.id) && char?.ascension >= 2) {
    conditionals[Stats.ER].push({
      value: 0.16,
      source: 'Self',
      name: 'Constellation 2',
    })
  }

  // Xingqiu A4
  if (character?.id === '10000025' && char?.ascension >= 4) {
    conditionals[Stats.HYDRO_DMG].push({
      value: 0.2,
      source: 'Self',
      name: 'Ascension 4 Passive',
    })
  }

  return conditionals
}

export const addArtifactStats = (conditionals: StatsObject, artifacts: IArtifactEquip[]) => {
  const setBonus = getSetCount(artifacts)
  const main = _.reduce(
    artifacts,
    (acc, curr) => {
      if (!acc[curr?.main]) acc[curr?.main] = 0
      acc[curr?.main] += getMainStat(curr.main, curr.quality, curr.level)
      return acc
    },
    {} as Record<Stats, number>
  )
  _.forEach(main, (item, key) => {
    conditionals[key]?.push({
      name: `Main Stat`,
      source: 'Relic',
      value: item,
    })
  })
  const sub = _.reduce(
    _.flatMap(artifacts, (item) => item.subList),
    (acc, curr) => {
      if (!acc[curr?.stat]) acc[curr?.stat] = 0
      acc[curr?.stat] += correctSubStat(curr.stat, curr.value)
      return acc
    },
    {} as Record<Stats, number>
  )
  _.forEach(sub, (item, key) => {
    conditionals[key]?.push({
      name: `Sub Stat`,
      source: 'Relic',
      value: item,
    })
  })
  _.forEach(setBonus, (value, key) => {
    const artifact = _.find(ArtifactSets, ['id', key])
    const bonuses = artifact?.bonus
    if (value >= 2) {
      _.forEach(bonuses, (item) => {
        conditionals[item.stat]?.push({
          name: '2-Piece',
          source: artifact?.name,
          value: item.value,
        })
      })
    }
    if (value >= 4) {
      _.forEach(bonuses, (item) => {
        conditionals[item.stat]?.push({
          name: '2-Piece',
          source: artifact?.name,
          value: item.value,
        })
      })
    }
  })

  return conditionals
}

export const addResonance = (conditionals: StatsObject, team: ITeamChar[]) => {
  const resonance = getResonanceCount(team)

  if (resonance[Element.PYRO] >= 2)
    conditionals[Stats.P_ATK].push({
      value: 0.25,
      source: 'Team',
      name: 'Pyro Resonance',
    })
  if (resonance[Element.HYDRO] >= 2)
    conditionals[Stats.P_HP].push({
      value: 0.25,
      source: 'Team',
      name: 'Hydro Resonance',
    })
  if (resonance[Element.DENDRO] >= 2)
    conditionals[Stats.EM].push({
      value: 50,
      source: 'Team',
      name: 'Dendro Resonance',
    })
  if (resonance[Element.GEO] >= 2)
    conditionals[Stats.SHIELD].push({
      value: 0.15,
      source: 'Team',
      name: 'Geo Resonance',
    })

  return conditionals
}

export const getTeamOutOfCombat = (chars: ITeamChar[], artifacts: IArtifactEquip[]) => {
  const applyRes = _.size(_.filter(chars, (item) => !!item.cId)) >= 4
  return _.map(Array(4), (_v, i) =>
    calculateOutOfCombat(
      _.cloneDeep(baseStatsObject),
      i,
      chars,
      _.filter(artifacts, (item) => _.includes(chars?.[i]?.equipments?.artifacts, item.id)),
      applyRes,
      true
    )
  )
}

export const calculateReaction = (conditionals: StatsObject, form: Record<string, any>, level: number) => {
  const base = BaseReactionDmg[level - 1]

  if (form.melt_forward)
    conditionals.PYRO_MULT.push({
      value:
        2 *
        (1 + conditionals?.getValue(StatsObjectKeys.MELT_DMG) + calcAmplifying(conditionals?.getValue(Stats.EM) || 0)),
      name: 'Reaction',
      source: 'Forward Melt',
    })
  if (form.melt_reverse)
    conditionals.CRYO_MULT.push({
      value:
        1.5 *
        (1 + conditionals?.getValue(StatsObjectKeys.MELT_DMG) + calcAmplifying(conditionals?.getValue(Stats.EM) || 0)),
      name: 'Reaction',
      source: 'Reverse Melt',
    })
  if (form.vape_forward)
    conditionals.HYDRO_MULT.push({
      value:
        2 *
        (1 + conditionals?.getValue(StatsObjectKeys.VAPE_DMG) + calcAmplifying(conditionals?.getValue(Stats.EM) || 0)),
      name: 'Reaction',
      source: 'Forward Vape',
    })
  if (form.vape_reverse)
    conditionals.PYRO_MULT.push({
      value:
        1.5 *
        (1 + conditionals?.getValue(StatsObjectKeys.VAPE_DMG) + calcAmplifying(conditionals?.getValue(Stats.EM) || 0)),
      name: 'Reaction',
      source: 'Reverse Vape',
    })
  if (form.spread)
    conditionals.DENDRO_F_DMG.push({
      value:
        1.25 *
        base *
        (1 + conditionals?.getValue(StatsObjectKeys.SPREAD_DMG) + calcAdditive(conditionals?.getValue(Stats.EM) || 0)),
      name: 'Reaction',
      source: 'Spread',
    })
  if (form.aggravate)
    conditionals.ELECTRO_F_DMG.push({
      value:
        1.15 *
        base *
        (1 +
          conditionals?.getValue(StatsObjectKeys.AGGRAVATE_DMG) +
          calcAdditive(conditionals?.getValue(Stats.EM) || 0)),
      name: 'Reaction',
      source: 'Aggravate',
    })

  return conditionals
}
