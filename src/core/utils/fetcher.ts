import { Element, WeaponIcon, WeaponType } from '@src/domain/constant'

export const getEmote = (emote: string) => `https://cdn.wanderer.moe/genshin-impact/emotes/${emote}.png`

export const getElementImage = (value: Element) =>
  `https://cdn.wanderer.moe/genshin-impact/elements/${value?.toLowerCase()}.png`

export const getWeaponImage = (value: WeaponType) => `https://homdgcat.wiki/homdgcat-res/AvatarSkill/${WeaponIcon[value]}`
