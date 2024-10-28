import { Element, WeaponIcon, WeaponType } from '@src/domain/constant'

export const getEmote = (emote: string) => `https://cdn.wanderer.moe/genshin-impact/emotes/${emote}.png`

export const getElementImage = (value: string) =>
  `https://cdn.wanderer.moe/genshin-impact/elements/${value?.toLowerCase()}.png`

export const getTalentWeaponImage = (value: string) => `/asset/talent/${WeaponIcon[value]}`

export const getAvatar = (path: string) => `/asset/avatar/portrait/UI_AvatarIcon_${path}.png`

export const getSideAvatar = (path: string) => (path ? `/asset/avatar/side/UI_AvatarIcon_Side_${path}.png` : '')

export const getGachaAvatar = (path: string) => (path ? `/asset/avatar/gacha/UI_Gacha_AvatarImg_${path}.webp` : '')

export const getTalentIcon = (path: string) => `/asset/talent/${path}.png`

export const getWeaponImage = (path: string, awaken: boolean) => `/asset/weapon/${path}${awaken ? '_Awaken' : ''}.webp`

export const getArtifactImage = (path: string, type: number) => `/asset/artifact/${path}_${type}.png`

export const getEnemyImage = (path: string) => `/asset/monster/${path}.png`
