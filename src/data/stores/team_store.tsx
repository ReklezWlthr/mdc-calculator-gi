import { Element, ITeamChar, IWeapon, IWeaponEquip, WeaponType } from '@src/domain/genshin/constant'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export interface TeamStoreType {
  characters: ITeamChar[]
  setMember: (index: number, character: ITeamChar) => void
  setMemberInfo: (index: number, info: Partial<ITeamChar>) => void
  setWeapon: (index: number, info: Partial<IWeaponEquip>) => void
  hydrate: (data: TeamStoreType) => void
}

export class Team {
  characters: ITeamChar[]

  constructor() {
    this.characters = Array(4).fill({
      level: 1,
      ascension: 0,
      cons: 0,
      character: null,
      equipments: {
        weapon: {
          level: 1,
          ascension: 0,
          refinement: 1,
        },
        artifacts: [],
      },
    })

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  setMember = (index: number, character: ITeamChar) => {
    if (index < 0 || index > 4) return
    this.characters[index] = character
  }

  setMemberInfo = (index: number, info: Partial<ITeamChar>) => {
    if (index < 0 || index > 4) return
    this.characters[index] = { ...this.characters[index], ...info }
  }

  setWeapon = (index: number, info: Partial<IWeaponEquip>) => {
    if (index < 0 || index > 4) return
    this.characters[index].equipments.weapon = { ...this.characters[index].equipments.weapon, ...info }
  }

  hydrate = (data: TeamStoreType) => {
    if (!data) return

    this.characters = data.characters || Array(4)
  }
}
