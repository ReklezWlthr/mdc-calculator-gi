import { useStore } from '@src/data/providers/app_store_provider'
import { correctSubStat, getBaseStat, getMainStat, getWeaponBase, getWeaponBonus } from '../utils/data_format'
import { toPercentage } from '../utils/converter'
import { useCallback } from 'react'
import _ from 'lodash'
import { Stats } from '@src/domain/genshin/constant'
import { AscensionGrowth } from '@src/domain/genshin/scaling'
import { findCharacter, findWeapon } from '../utils/finder'

export const useStat = (
  cId: string,
  cLevel: number,
  cAsc: number,
  wId: string,
  wLevel: number,
  wAsc: number,
  artifacts?: string[]
) => {
  const { artifactStore } = useStore()

  const character = findCharacter(cId)
  const weapon = findWeapon(wId)

  const charBaseAtk = getBaseStat(character?.stat?.baseAtk, cLevel, character?.stat?.ascAtk, cAsc, character?.rarity)
  const weaponBaseAtk = getWeaponBase(weapon?.tier, wLevel, wAsc, weapon?.rarity)
  const weaponSecondary = getWeaponBonus(weapon?.baseStat, wLevel)

  const getTotalStat = useCallback(
    (stat: string) => {
      const fromWeapon = weapon?.ascStat === stat ? weaponSecondary : 0
      const fromAscension =
        (character?.stat?.ascStat === stat ? _.max([0, cAsc - 2]) : 0) *
        AscensionGrowth[character?.stat?.ascStat]?.[character?.rarity - 4]

      const artifactData = _.map(artifacts, (aId) => _.find(artifactStore.artifacts, ['id', aId]))
      const fromMainStat = _.sum(
        _.map(
          _.filter(artifactData, (item) => item?.main === stat),
          (item) => getMainStat(item.main, item.quality, item.level)
        )
      )
      const fromSubStat = _.sum(
        _.map(artifactData, (item) =>
          _.sumBy(_.filter(item?.subList, ['stat', stat]), (sub) => correctSubStat(sub.stat, sub.value))
        )
      )

      return _.sum([fromWeapon, fromAscension, fromMainStat, fromSubStat])
    },
    [weapon, character]
  )

  return {
    baseAtk: charBaseAtk + weaponBaseAtk,
    baseHp: getBaseStat(character?.stat?.baseHp, cLevel, character?.stat?.ascHp, cAsc, character?.rarity),
    baseDef: getBaseStat(character?.stat?.baseDef, cLevel, character?.stat?.ascDef, cAsc, character?.rarity),
    pAtk: getTotalStat(Stats.P_ATK),
    pHp: getTotalStat(Stats.P_HP),
    pDef: getTotalStat(Stats.P_DEF),
    fAtk: getTotalStat(Stats.ATK),
    fHp: getTotalStat(Stats.HP),
    fDef: getTotalStat(Stats.DEF),
    cRate: 0.05 + getTotalStat(Stats.CRIT_RATE) - (character?.codeName === 'Kokomi' ? 1 : 0),
    cDmg: 0.5 + getTotalStat(Stats.CRIT_DMG),
    em: getTotalStat(Stats.EM),
    er: 1 + getTotalStat(Stats.ER),
    heal: getTotalStat(Stats.HEAL) + (character?.codeName === 'Kokomi' ? 0.25 : 0),
    physical: getTotalStat(Stats.PHYSICAL_DMG),
    pyro: getTotalStat(Stats.PYRO_DMG),
    hydro: getTotalStat(Stats.HYDRO_DMG),
    cryo: getTotalStat(Stats.CRYO_DMG),
    electro: getTotalStat(Stats.ELECTRO_DMG),
    geo: getTotalStat(Stats.GEO_DMG),
    dendro: getTotalStat(Stats.DENDRO_DMG),
    anemo: getTotalStat(Stats.ANEMO_DMG),
  }
}
