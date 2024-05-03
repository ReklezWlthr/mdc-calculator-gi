import { useStore } from '@src/data/providers/app_store_provider'
import { getBaseStat, getWeaponBase, getWeaponBonus } from '../utils/data_format'
import { toPercentage } from '../utils/converter'

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

  return {
    charBaseAtk,
    weaponBaseAtk,
    weaponSecondary: {
      raw: weaponSecondary,
      formatted:
        weapon?.data?.ascStat !== 'Elemental Mastery'
          ? toPercentage(weaponSecondary || 0)
          : weaponSecondary.toLocaleString(),
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
  }
}
