import { ICharStore } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { StatsObject } from '../lib/stats/baseConstant'

enableStaticRendering(typeof window === 'undefined')

export interface CharacterStoreType {
  form: Record<string, any>[]
  selected: number
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  initForm: (initData: Record<string, any>[]) => void
  hydrate: (data: CharacterStoreType) => void
}

export class CalculatorStore {
  form: Record<string, any>[]
  selected: number

  constructor() {
    this.form = []
    this.selected = 0

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  initForm = (initData: Record<string, any>[]) => {
    const mergedData = _.map(initData, (item, index) =>
      _.mapValues(item, (value, key) => this.form[index]?.[key] || value)
    )
    console.log(this.form, initData, mergedData)
    this.form = _.cloneDeep(mergedData)
  }

  setFormValue = (index: number, key: string, value: any) => {
    this.form[index][key] = value
    this.form = _.cloneDeep(this.form)
  }

  hydrate = (data: CharacterStoreType) => {
    if (!data) return

    this.form = data.form || []
  }
}
