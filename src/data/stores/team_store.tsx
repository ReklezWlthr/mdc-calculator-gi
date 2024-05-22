import {
  Element,
  IArtifactEquip,
  IBuild,
  ITeamChar,
  IWeapon,
  IWeaponEquip,
  WeaponType,
} from '@src/domain/genshin/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { DefaultBuild } from './build_store'

enableStaticRendering(typeof window === 'undefined')

export const DefaultWeapon = {
  level: 1,
  ascension: 0,
  refinement: 1,
  wId: null,
}

export const DefaultCharacter = {
  level: 1,
  ascension: 0,
  cons: 0,
  cId: null,
  equipments: {
    weapon: DefaultWeapon,
    artifacts: Array(5),
  },
  talents: {
    normal: 1,
    skill: 1,
    burst: 1,
  },
}

export interface TeamStoreType {
  characters: ITeamChar[]
  selected: number
  hydrated: boolean
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  setMember: (index: number, character: ITeamChar) => void
  setTalentLevel: (index: number, type: 'normal' | 'skill' | 'burst', level: number) => void
  setMemberInfo: (index: number, info: Partial<ITeamChar>) => void
  setWeapon: (index: number, info: Partial<IWeaponEquip>) => void
  setArtifact: (index: number, type: number, aId: string) => void
  unequipAll: (index: number) => void
  hydrateCharacters: (data: ITeamChar[]) => void
  hydrate: (data: TeamStoreType) => void
}

export class Team {
  characters: ITeamChar[]
  selected: number
  hydrated: boolean = false

  constructor() {
    this.characters = Array(4).fill(DefaultCharacter)
    this.selected = 0

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
    if (info?.equipments?.artifacts)
      _.forEach(info.equipments.artifacts, (aId) =>
        _.forEach(this.characters, (character, cI) => {
          if (cI !== index) character.equipments.artifacts = _.without(character.equipments.artifacts, aId)
        })
      )
    this.characters[index] = { ...this.characters[index], ...info }
  }

  equipBuild = (index: number, build: IBuild) => {
    if (!build) return
    this.characters[index].equipments = { weapon: build.weapon, artifacts: build.artifacts }
    this.characters[index] = { ...this.characters[index] }
  }

  setTalentLevel = (index: number, type: 'normal' | 'skill' | 'burst', level: number) => {
    if (!type) return
    this.characters[index].talents = { ...this.characters[index].talents, [type]: level }
    this.characters[index] = { ...this.characters[index] }
  }

  unequipAll = (index: number) => {
    if (index < 0 || index > 4) return
    this.characters[index].equipments = DefaultBuild
    this.characters[index] = { ...this.characters[index] }
  }

  setWeapon = (index: number, info: Partial<IWeaponEquip>) => {
    if (index < 0 || index > 4) return
    this.characters[index].equipments.weapon = { ...this.characters[index].equipments.weapon, ...info }
    this.characters[index] = { ...this.characters[index] }
  }

  setArtifact = (index: number, type: number, aId: string | null) => {
    if (index < 0) return
    _.forEach(this.characters, (character, i) => {
      if (i === index) {
        character.equipments.artifacts[type - 1] = aId
      } else {
        character.equipments.artifacts = _.without(character.equipments.artifacts, aId)
      }
    })
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
