import { Element, Stats, TalentProperty } from './constant'

export interface IScaling {
  name: string
  scale?: Stats
  value: number
  element: Element | 'Heal' | 'Shield'
  property: TalentProperty
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
  value: { name: string; value: number; formatter: Function }[]
  default?: number | boolean
  max?: number
  min?: number
}

export interface ITalent {
  [key: string]: { title: string; content: string; upgrade?: string[] }
}
