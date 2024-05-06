import { Element, IArtifactEquip, ITeamChar, IWeapon, IWeaponEquip, WeaponType } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export const DefaultWeapon = {
  level: 1,
  ascension: 0,
  refinement: 1,
  data: null,
}

export const DefaultCharacter = {
  level: 1,
  ascension: 0,
  cons: 0,
  data: null,
  equipments: {
    weapon: DefaultWeapon,
    artifacts: Array(5),
  },
}

export interface TeamStoreType {
  characters: ITeamChar[]
  hydrated: boolean
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  setMember: (index: number, character: ITeamChar) => void
  setMemberInfo: (index: number, info: Partial<ITeamChar>) => void
  setWeapon: (index: number, info: Partial<IWeaponEquip>) => void
  setArtifact: (cId: string, type: number, aId: string) => void
  hydrateCharacters: (data: ITeamChar[]) => void
  hydrate: (data: TeamStoreType) => void
}

export class Team {
  characters: ITeamChar[]
  hydrated: boolean = false

  constructor() {
    this.characters = Array(4).fill(DefaultCharacter)

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
    this.characters[index] = { ...this.characters[index] }
  }

  setArtifact = (cId: string, type: number, aId: string | null) => {
    const index = _.findIndex(this.characters, ['id', cId])
    if (index < 0) return
    this.characters[index].equipments.artifacts[type - 1] = aId
    this.characters[index] = { ...this.characters[index] }
  }

  hydrateCharacters = (data: ITeamChar[]) => {
    if (!data) return
    this.characters = data
  }

  hydrate = (data: TeamStoreType) => {
    if (!data) return

    this.characters = data.characters || Array(4)
  }
}
