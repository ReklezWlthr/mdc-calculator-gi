import { IBuild, ISetup } from '@src/domain/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export interface SetupStoreType {
  setup: ISetup[]
  compare: ISetup[]
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  saveSetup: (setup: ISetup) => boolean
  deleteSetup: (sId: string) => boolean
  findSetup: (cId: string) => ISetup[]
  addCompare: (data: ISetup) => void
  updateCompare: (index: number, data: Partial<ISetup>) => void
  swapMainCompare: (newMainIndex: number) => ISetup
  hydrateSetup: (data: ISetup[]) => void
  hydrate: (data: SetupStoreType) => void
}

export class Setup {
  setup: ISetup[]
  compare: ISetup[]

  constructor() {
    this.setup = []
    this.compare = Array(1)

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  saveSetup = (setup: ISetup) => {
    if (!setup) return false
    this.setup = [...this.setup, setup]
    return true
  }

  deleteSetup = (sId: string) => {
    if (!sId) return false
    const index = _.findIndex(this.setup, ['id', sId])
    this.setup.splice(index, 1)
    this.setup = [...this.setup]
    return true
  }

  findSetup = (cId: string) => {
    return _.filter(this.setup, (item) =>
      _.includes(
        _.map(item.team, (char) => char.cId),
        cId
      )
    )
  }

  addCompare = (data: ISetup) => {
    this.compare.push(data)
    this.compare = _.cloneDeep(this.compare)
  }

  updateCompare = (index: number, data: Partial<ISetup>) => {
    this.compare[index] = { ...this.compare[index], ...data }
    this.compare = _.cloneDeep(this.compare)
  }

  swapMainCompare = (newMainIndex: number) => {
    if (newMainIndex <= 0) return
    ;[this.compare[0], this.compare[newMainIndex]] = [this.compare[newMainIndex], this.compare[0]]
    this.compare = _.cloneDeep(this.compare)
    return this.compare[0]
  }

  hydrateSetup = (data: ISetup[]) => {
    this.setup = data || []
  }

  hydrate = (data: SetupStoreType) => {
    if (!data) return

    this.setup = data.setup || []
  }
}
