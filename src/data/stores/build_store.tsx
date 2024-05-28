import { IBuild } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { DefaultWeapon } from './team_store'

enableStaticRendering(typeof window === 'undefined')

export const DefaultBuild = {
  weapon: DefaultWeapon,
  artifacts: Array(5),
}

export interface BuildStoreType {
  builds: IBuild[]
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  saveBuild: (build: IBuild) => boolean
  editBuild: (bId: string, build: Partial<IBuild>) => boolean
  deleteBuild: (bId: string) => boolean
  setDefault: (bId: string) => void
  hydrateBuilds: (data: IBuild[]) => void
  hydrate: (data: BuildStoreType) => void
}

export class Build {
  builds: IBuild[]

  constructor() {
    this.builds = []

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  saveBuild = (build: IBuild) => {
    if (!build) return false
    this.builds = [...this.builds, build]
    return true
  }

  editBuild = (bId: string, build: Partial<IBuild>) => {
    if (!build || !bId) return false
    const index = _.findIndex(this.builds, ['id', bId])
    this.builds[index] = { ...this.builds[index], ...build }
    return true
  }

  deleteBuild = (bId: string) => {
    if (!bId) return false
    const index = _.findIndex(this.builds, ['id', bId])
    this.builds.splice(index, 1)
    this.builds = [...this.builds]
    return true
  }

  setDefault = (bId: string) => {
    if (!bId) return
    const selected = _.find(this.builds, ['id', bId])
    const others = _.filter(this.builds, (item) => item.id !== bId && selected.cId === item.cId)
    selected.isDefault = true
    _.forEach(others, (item) => (item.isDefault = false))
    this.builds = [...this.builds]
  }

  hydrateBuilds = (data: IBuild[]) => {
    this.builds = data || []
  }

  hydrate = (data: BuildStoreType) => {
    if (!data) return

    this.builds = data.builds || Array(4)
  }
}
