import { Element, Stats, TalentProperty } from './constant'

export interface ScalingT {
  name: string
  scale?: Stats
  value: number
  element: Element
  property: TalentProperty
}
