import { Element } from '@src/domain/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

const VarianceMultiplier = {
  average: 0,
  low: 0.5,
  worst: 1,
}

const OffFieldMultiplier = [0, 0.8, 0.7, 0.6]

const ExtraSkillProc = ['10000031']

export interface EnergyStoreType {
  meta: EnergyMeta[]
  mode: string
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  setMetaData: (index: number, path: _.PropertyPath, value: any) => void
  getEnergyFrom: (from: number, to: number) => number
  getTotalEnergy: (from: number) => number
  getFixedEnergy: (index: number) => number
  hydrate: (data: EnergyStoreType) => void
}

export interface SkillMeta {
  proc: number
  value: number
  feed: string
  percentage: number
  pps?: number
  variance: number
  duration?: number
}

export interface EnergyMeta {
  cId: string
  fieldTime: number
  rpb: number
  skill: SkillMeta[]
  favProc: number
  feedFav: string
  add: number
  element: Element
}

export class EnergyStore {
  meta: EnergyMeta[]
  mode: string

  constructor() {
    this.meta = Array(4).fill(null)
    this.mode = 'average'

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  setMetaData = (index: number, path: _.PropertyPath, value: any) => {
    _.set(this.meta[index], path, value)
  }

  getEnergyFrom = (from: number, to: number) => {
    const varMultiplier = VarianceMultiplier[this.mode]
    const totalRotation = _.sumBy(this.meta, (item) => item.fieldTime)
    const generator = this.meta[from]
    const receiver = this.meta[to]
    const receiverFieldTime = receiver?.fieldTime / totalRotation
    const elementMultiplier = receiver?.element === generator?.element ? 3 : 1
    const offFieldMultiplier = OffFieldMultiplier[_.size(_.filter(this.meta, (item) => !!item.cId)) - 1]

    //Check if the receiver is fed energy to or actually the generator
    const onFieldMultiplier = (skill: SkillMeta) =>
      receiver?.cId === skill?.feed
        ? skill?.percentage / 100 + (1 - skill?.percentage / 100) * offFieldMultiplier
        : receiver?.cId === generator?.cId
        ? 1 - skill?.percentage / 100 + (skill?.percentage / 100) * offFieldMultiplier
        : offFieldMultiplier
    //Divide total particle that can be gained per burst use by seconds
    const particlePerSec = (skill: SkillMeta) =>
      ((skill?.value * skill?.proc) / (totalRotation * generator?.rpb)) * (1 - skill?.variance * varMultiplier)

    const normalTotal = (skill: SkillMeta) =>
      totalRotation * (onFieldMultiplier(skill) * (particlePerSec(skill) * elementMultiplier))

    const turretTotal = (skill: SkillMeta) =>
      skill?.pps *
      _.min([
        skill?.duration * (skill?.proc + (_.includes(ExtraSkillProc, generator?.cId) ? 1 : 0)),
        generator?.rpb * totalRotation,
      ]) *
      (receiverFieldTime + (1 - receiverFieldTime) * offFieldMultiplier) *
      elementMultiplier *
      (1 - skill?.variance * varMultiplier)

    let energy = 0
    _.forEach(generator?.skill, (skill) => {
      energy += skill?.value ? normalTotal(skill) : turretTotal(skill)
    })

    if (generator?.favProc) {
      //Fav gives 3 Clear Particles with equate to 6 Energy
      energy += generator?.favProc * 6 * (generator?.feedFav === receiver?.cId ? 1 : offFieldMultiplier)
    }

    return energy
  }

  getTotalEnergy = (to: number) => {
    return _.sum(_.map(this.meta, (item, index) => (item?.cId ? this.getEnergyFrom(index, to) : 0)))
  }

  getFixedEnergy = (index: number) => {
    return _.sum([this.meta[index]?.add])
  }

  hydrate = (data: EnergyStoreType) => {
    if (!data) return
  }
}
