import { ITeamChar } from '@src/domain/constant'
import { StatsObject } from '../lib/stats/baseConstant'
import { EnergyMeta } from '../stores/energy_store'
import _ from 'lodash'

export interface EnergyCallbackProps {
  totalRotation: number
  char: ITeamChar
  stats: StatsObject
  generator: EnergyMeta
  receiver: EnergyMeta
}

export interface IAutoEnergy {
  name: string
  source: string
  getEnergy: (props: EnergyCallbackProps) => number
}

export const AutoEnergy: IAutoEnergy[] = [
  {
    name: `Dori's Burst`,
    source: '10000068',
    getEnergy: (props) => {
      const base = 1.5 + 0.1 * _.min([props.char.talents.burst + (props.char.cons >= 3 ? 3 : 0), 10])
      const uptime = _.min([20, props.totalRotation])
      const energy = ((base / 2) * uptime) / (props.totalRotation * _.max([1, props.generator.rpb]))
      return energy * props.receiver.fieldTime * _.max([1, props.receiver.rpb])
    },
  },
  {
    name: `Dori's A4`,
    source: '10000068',
    getEnergy: (props) => {
      if (props.receiver.cId !== '10000068' || props.char.ascension < 4) return 0
      return 5 * props.receiver.skill[0].proc * _.max([1, props.receiver.rpb])
    },
  },
  {
    name: `Albedo's C1`,
    source: '10000038',
    getEnergy: (props) => {
      if (props.receiver.cId !== '10000038' || props.char.cons < 1) return 0
      const base = 1.2
      const uptime = _.min([30 * props.generator.skill[0].proc, props.totalRotation]) * _.max([1, props.generator.rpb])
      const energy = (base / 2) * uptime
      return energy
    },
  },
  {
    name: `Barbara's C1`,
    source: '10000014',
    getEnergy: (props) => {
      if (props.receiver.cId !== '10000014' || props.char.cons < 1) return 0
      return _.floor(props.totalRotation / 10)
    },
  },
]
