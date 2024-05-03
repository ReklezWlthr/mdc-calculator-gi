import { useStore } from '@src/data/providers/app_store_provider'
import { getBaseStat, getWeaponBase } from '../utils/data_format'

export const useStat = (index: number) => {
  const { teamStore } = useStore()
  const char = teamStore.characters[index]
  const weapon = teamStore.characters[index]?.equipments?.weapon

  const charBaseAtk = getBaseStat(char?.stat?.baseAtk, char?.level, char?.stat?.ascAtk, char?.ascension, char?.rarity)
  const weaponBaseAtk = getWeaponBase(weapon?.tier, weapon?.level, weapon?.ascension, weapon?.rarity)

  return {
    charBaseAtk,
    weaponBaseAtk,
    baseAtk: charBaseAtk + weaponBaseAtk,
    baseHp: getBaseStat(char?.stat?.baseHp, char?.level, char?.stat?.ascHp, char?.ascension, char?.rarity),
    baseDef: getBaseStat(char?.stat?.baseDef, char?.level, char?.stat?.ascDef, char?.ascension, char?.rarity),
  }
}
