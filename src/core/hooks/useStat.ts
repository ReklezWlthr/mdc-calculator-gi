import { useStore } from '@src/data/providers/app_store_provider'
import { getBaseStat, getMainStat, getWeaponBase, getWeaponBonus } from '../utils/data_format'
import { toPercentage } from '../utils/converter'
import { useCallback } from 'react'
import _ from 'lodash'
import { Stats } from '@src/domain/genshin/constant'
import { AscensionGrowth } from '@src/domain/genshin/scaling'

export const useStat = (index: number) => {
  const { teamStore, artifactStore } = useStore()
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
      const fromAscension =
        (char?.data?.stat?.ascStat === stat ? _.max([0, char?.ascension - 2]) : 0) *
        AscensionGrowth[char?.data?.stat?.ascStat]?.[char?.data?.rarity - 4]

      const artifacts = _.filter(
        _.map(char?.equipments?.artifacts, (aId) => _.find(artifactStore.artifacts, ['id', aId])),
        (item) => item?.main === stat
      )
      const fromMainStat = _.sum(_.map(artifacts, (item) => getMainStat(item.main, item.quality, item.level)))

      return _.sum([fromWeapon, fromAscension, fromMainStat])
    },
    [weapon, char]
  )

  return {
    charBaseAtk,
    weaponBaseAtk,
    weaponSecondary: {
      stat: weapon?.data?.ascStat,
      raw: weaponSecondary,
      formatted:
        weapon?.data?.ascStat === Stats.EM
          ? _.round(weaponSecondary).toLocaleString()
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
    fAtk: getTotalStat(Stats.ATK),
    fHp: getTotalStat(Stats.HP),
    fDef: getTotalStat(Stats.DEF),
    cRate: 0.05 + getTotalStat(Stats.CRIT_RATE) - (char?.data?.codeName === 'Kokomi' ? 1 : 0),
    cDmg: 0.5 + getTotalStat(Stats.CRIT_DMG),
    em: getTotalStat(Stats.EM),
    er: 1 + getTotalStat(Stats.ER),
    heal: getTotalStat(Stats.HEAL) + (char?.data?.codeName === 'Kokomi' ? 0.25 : 0),
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
