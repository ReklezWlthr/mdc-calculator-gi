import { Element, ICharacter, IWeapon, WeaponType } from '@src/domain/genshin/constant'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export interface TeamStoreType {
  characters: ICharacter[]
  setMember: (index: number, character: ICharacter) => void
  setMemberInfo: (index: number, info: Partial<ICharacter>) => void
  setWeapon: (index: number, info: Partial<IWeapon>) => void
  hydrate: (data: TeamStoreType) => void
}

export class Team {
  characters: ICharacter[]

  constructor() {
    this.characters = Array(4).fill({
      level: 1,
      ascension: 0,
      cons: 0,
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

  setMember = (index: number, character: ICharacter) => {
    if (index < 0 || index > 4) return
    this.characters[index] = character
  }

  setMemberInfo = (index: number, info: Partial<ICharacter>) => {
    if (index < 0 || index > 4) return
    this.characters[index] = { ...this.characters[index], ...info }
  }

  setWeapon = (index: number, info: Partial<IWeapon>) => {
    if (index < 0 || index > 4) return
    this.characters[index].equipments.weapon = { ...this.characters[index].equipments.weapon, ...info }
  }

  hydrate = (data: TeamStoreType) => {
    if (!data) return

    this.characters = data.characters || Array(4)
  }
}
