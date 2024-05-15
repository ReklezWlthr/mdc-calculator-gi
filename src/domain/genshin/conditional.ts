import { Element, Stats, TalentProperty } from './constant'

export interface IScaling {
  name: string
  scale?: Stats
  value: { scaling: number; multiplier: Stats; override?: number }[]
  element: Element | 'Heal' | 'Shield'
  property: TalentProperty
  multiplier?: number
  flat?: number
  bonus?: number //Bonus dmg for each component
  cr?: number //Bonus crit rate for each component
  cd?: number //Bonus crit dmg for each component
}

export interface IContent {
  type?: 'toggle' | 'number'
  id: string
  text: string
  title: string
  content: string
  show: boolean
  default?: number | boolean
  max?: number
  min?: number
  debuff?: boolean
}

export interface ITalent {
  [key: string]: { title: string; content: string; upgrade?: string[] }
}
