import { Element, ICharStore } from '@src/domain/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { StatsObject, StatsObjectKeysT } from '../lib/stats/baseConstant'

enableStaticRendering(typeof window === 'undefined')

export interface CharacterStoreType {
  form: Record<string, any>[]
  computedStats: StatsObject[]
  selected: number
  res: Record<Element, number>
  level: number
  custom: { name: StatsObjectKeysT; value: number; debuff: boolean }[][]
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  initForm: (initData: Record<string, any>[]) => void
  setFormValue: (index: number, key: string, value: any) => void
  setCustomValue: (index: number, key: StatsObjectKeysT, value: any) => void
  removeCustomValue: (index: number, innerIndex: number) => void
  setRes: (element: Element, value: number) => void
  hydrate: (data: CharacterStoreType) => void
}

export class CalculatorStore {
  form: Record<string, any>[]
  computedStats: StatsObject[]
  res: Record<Element, number>
  level: number
  selected: number
  custom: { name: StatsObjectKeysT; value: number; debuff: boolean }[][]

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
    this.custom = Array(4)

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

  setCustomValue = (index: number, innerIndex: number, key: StatsObjectKeysT, value: any, debuff: boolean = false) => {
    if (innerIndex < 0) {
      this.custom[index] = [...(this.custom[index] || []), { name: key, value, debuff }]
    } else {
      this.custom[index].splice(innerIndex, 1, { name: key, value, debuff })
    }
    this.custom = _.cloneDeep(this.custom)
  }

  removeCustomValue = (index: number, innerIndex: number) => {
    this.custom[index].splice(innerIndex)
    this.custom = _.cloneDeep(this.custom)
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
