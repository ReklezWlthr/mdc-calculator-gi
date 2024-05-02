import { Element, ICharacter, WeaponType } from '@src/domain/genshin/constant'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export interface TeamStoreType {
  characters: ICharacter[]
  setMember: (index: number, character: ICharacter) => void
  setMemberInfo: (index: number, info: Partial<ICharacter>) => void
  hydrate: (data: TeamStoreType) => void
}

export class Team {
  characters: ICharacter[]

  constructor() {
    this.characters = Array<ICharacter>(4)

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

  hydrate = (data: TeamStoreType) => {
    if (!data) return

    this.characters = data.characters || Array(4)
  }
}
