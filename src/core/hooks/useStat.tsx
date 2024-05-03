import { useStore } from '@src/data/providers/app_store_provider'
import { getBaseStat, getWeaponBase, getWeaponBonus } from '../utils/data_format'
import { toPercentage } from '../utils/converter'
import { useCallback } from 'react'
import _ from 'lodash'
import { Stats } from '@src/domain/genshin/constant'

export const useStat = (index: number) => {
  const { teamStore } = useStore()
  const char = teamStore.characters[index]
  const weapon = teamStore.characters[index]?.equipments?.weapon

  const charBaseAtk = getBaseStat(
    char?.data?.stat?.baseAtk,
    char?.level,
    char?.data?.stat?.ascAtk,
    char?.ascension,
    char?.data?.rarity
  )
  const weaponBaseAtk = getWeaponBase(weapon?.data?.tier, weapon?.level, weapon?.ascension, weapon?.data?.rarity)
  const weaponSecondary = getWeaponBonus(weapon?.data?.baseStat, weapon?.level)

  const getTotalStat = useCallback(
    (stat: string) => {
      const fromWeapon = weapon?.data?.ascStat === stat ? weaponSecondary : 0
      return _.sum([fromWeapon])
    },
    [weapon]
  )

  return {
    charBaseAtk,
    weaponBaseAtk,
    weaponSecondary: {
      stat: weapon?.data?.ascStat,
      raw: weaponSecondary,
      formatted:
        weapon?.data?.ascStat === Stats.EM
          ? weaponSecondary.toLocaleString()
          : toPercentage(weaponSecondary || 0),
    },
    baseAtk: charBaseAtk + weaponBaseAtk,
    baseHp: getBaseStat(
      char?.data?.stat?.baseHp,
      char?.level,
      char?.data?.stat?.ascHp,
      char?.ascension,
      char?.data?.rarity
    ),
    baseDef: getBaseStat(
      char?.data?.stat?.baseDef,
      char?.level,
      char?.data?.stat?.ascDef,
      char?.ascension,
      char?.data?.rarity
    ),
    pAtk: getTotalStat(Stats.P_ATK),
    pHp: getTotalStat(Stats.P_HP),
    pDef: getTotalStat(Stats.P_DEF),
    cRate: 0.05 + getTotalStat(Stats.CRIT_RATE),
    cDmg: 0.5 + getTotalStat(Stats.CRIT_DMG),
  }
}
