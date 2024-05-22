import { Element, ICharStore } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { StatsObject } from '../lib/stats/baseConstant'

enableStaticRendering(typeof window === 'undefined')

export interface CharacterStoreType {
  form: Record<string, any>[]
  computedStats: StatsObject[]
  selected: number
  res: Record<Element, number>
  level: number
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  initForm: (initData: Record<string, any>[]) => void
  setFormValue: (index: number, key: string, value: any) => void
  setRes: (element: Element, value: number) => void
  hydrate: (data: CharacterStoreType) => void
}

export class CalculatorStore {
  form: Record<string, any>[]
  computedStats: StatsObject[]
  res: Record<Element, number>
  level: number
  selected: number

  constructor() {
    this.form = Array(4)
    this.computedStats = Array(4)
    this.selected = 0
    this.level = 1
    this.res = {
      [Element.ANEMO]: 10,
      [Element.PYRO]: 10,
      [Element.HYDRO]: 10,
      [Element.CRYO]: 10,
      [Element.ELECTRO]: 10,
      [Element.GEO]: 10,
      [Element.DENDRO]: 10,
      [Element.PHYSICAL]: 10,
    }

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  initForm = (initData: Record<string, any>[]) => {
    const mergedData = _.map(initData, (item, index) =>
      _.mapValues(item, (value, key) => {
        const old = this.form[index]?.[key]
        return _.isUndefined(old) ? value : old
      })
    )
    this.form = _.cloneDeep(mergedData)
  }

  setFormValue = (index: number, key: string, value: any) => {
    this.form[index][key] = value
    this.form = _.cloneDeep(this.form)
  }

  setRes = (element: Element, value: number) => {
    this.res[element] = value
  }

  getDefMult = (level: number, defPen: number = 0, defRed: number = 0) => {
    return (level + 100) / ((this.level + 100) * (1 - defPen) * (1 - defRed) + level + 100)
  }

  getResMult = (element: Element, resPen: number) => {
    const res = this.res[element] / 100 - resPen
    if (res < 0) return 1 - res / 2
    if (res >= 0.75) return 1 / (4 * res + 1)
    return 1 - res
  }

  hydrate = (data: CharacterStoreType) => {
    if (!data) return

    this.form = data.form || []
  }
}
