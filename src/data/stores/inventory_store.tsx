import { Element, IArtifactEquip, ITeamChar, IWeapon, IWeaponEquip, WeaponType } from '@src/domain/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export interface InventoryStoreType {
  artifacts: IArtifactEquip[]
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  addArtifact: (artifact: IArtifactEquip) => boolean
  editArtifact: (aId: string, artifact: IArtifactEquip) => boolean
  deleteArtifact: (aId: string) => boolean
  hydrateArtifacts: (data: IArtifactEquip[]) => void
  hydrate: (data: InventoryStoreType) => void
}

export class Inventory {
  artifacts: IArtifactEquip[]

  constructor() {
    this.artifacts = []

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  addArtifact = (artifact: IArtifactEquip) => {
    if (!artifact) return false
    this.artifacts = [artifact, ...this.artifacts]
    return true
  }

  editArtifact = (aId: string, artifact: IArtifactEquip) => {
    if (!artifact || !aId) return false
    const index = _.findIndex(this.artifacts, ['id', aId])
    this.artifacts[index] = artifact
    return true
  }

  deleteArtifact = (aId: string) => {
    if (!aId) return false
    const index = _.findIndex(this.artifacts, ['id', aId])
    this.artifacts.splice(index, 1)
    this.artifacts = [...this.artifacts]
    return true
  }

  hydrateArtifacts = (data: IArtifactEquip[]) => {
    this.artifacts = data || []
  }

  hydrate = (data: InventoryStoreType) => {
    if (!data) return

    this.artifacts = data.artifacts || Array(4)
  }
}
