import { IContent } from '@src/domain/conditional'
import { StatsObject, StatsObjectKeys } from '../baseConstant'
import { Element, Stats } from '@src/domain/constant'
import { BaseReactionDmg } from '@src/domain/scaling'
import _ from 'lodash'
import { calcTransformative } from '@src/core/utils/data_format'

const Transformative = (element: Element, stat: StatsObject, swirl: Element, nilou?: boolean) => {
  const emBonus = calcTransformative(stat?.getEM() || 0)

  return [
    {
      name: 'Swirl',
      element: swirl,
      show: element === Element.ANEMO,
      mult: 0.6,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.SWIRL_DMG),
      amp:
        swirl === Element.PYRO
          ? stat?.getValue(StatsObjectKeys.PYRO_MULT) || 1
          : swirl === Element.CRYO
          ? stat?.getValue(StatsObjectKeys.CRYO_MULT) || 1
          : swirl === Element.HYDRO
          ? stat?.getValue(StatsObjectKeys.HYDRO_MULT) || 1
          : 1,
      cd: 0,
      add: swirl === Element.ELECTRO ? stat?.getValue(StatsObjectKeys.ELECTRO_F_DMG) : 0,
      resPen: swirl ? stat?.getValue(`${swirl.toUpperCase()}_RES_PEN`) : 0,
    },
    {
      name: 'Electro-Charged',
      element: Element.ELECTRO,
      show: _.includes([Element.HYDRO, Element.ELECTRO, Element.ANEMO], element),
      // mult: 1.2,
      mult: 2,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.TASER_DMG),
      cd: 0,
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.ELECTRO_RES_PEN),
    },
    {
      name: 'Superconduct',
      element: Element.CRYO,
      show: _.includes([Element.CRYO, Element.ELECTRO, Element.ANEMO], element),
      // mult: 0.5,
      mult: 1.5,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.SUPERCONDUCT_DMG),
      cd: 0,
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.CRYO_RES_PEN),
    },
    {
      name: nilou ? 'Bloom: Bountiful Core' : 'Bloom',
      element: Element.DENDRO,
      show: _.includes([Element.HYDRO, Element.DENDRO, Element.ANEMO], element),
      mult: 2,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.BLOOM_DMG),
      cd: stat?.getValue(StatsObjectKeys.CORE_CD),
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.DENDRO_RES_PEN),
    },
    {
      name: 'Hyperbloom',
      element: Element.DENDRO,
      show: _.includes([Element.ELECTRO, Element.ANEMO], element),
      mult: 3,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.HYPERBLOOM_DMG),
      cd: stat?.getValue(StatsObjectKeys.CORE_CD),
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.DENDRO_RES_PEN),
    },
    {
      name: 'Burgeon',
      element: Element.DENDRO,
      show: _.includes([Element.PYRO, Element.ANEMO], element),
      mult: 3,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.BURGEON_DMG),
      cd: stat?.getValue(StatsObjectKeys.CORE_CD),
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.DENDRO_RES_PEN),
    },
    {
      name: 'Burning',
      element: Element.PYRO,
      show: _.includes([Element.DENDRO, Element.PYRO, Element.ANEMO], element),
      mult: 0.25,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.BURNING_DMG),
      cd: stat?.getValue(StatsObjectKeys.CORE_CD) || 0,
      amp: stat?.getValue(StatsObjectKeys.PYRO_MULT) || 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.PYRO_RES_PEN),
    },
    {
      name: 'Overloaded',
      element: Element.PYRO,
      show: _.includes([Element.PYRO, Element.ELECTRO, Element.ANEMO], element),
      // mult: 2,
      mult: 2.75,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.OVERLOAD_DMG),
      cd: 0,
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.PYRO_RES_PEN),
    },
    {
      name: 'Shattered',
      element: Element.PHYSICAL,
      show: true,
      // mult: 1.5,
      mult: 3,
      emBonus,
      dmg: stat?.getValue(StatsObjectKeys.SHATTER_DMG),
      cd: 0,
      amp: 1,
      add: 0,
      resPen: stat?.getValue(StatsObjectKeys.PHYSICAL_RES_PEN),
    },
  ]
}

export default Transformative

export type TransformativeT = {
  name: string
  element: Element
  show: boolean
  mult: number
  emBonus: number
  dmg: number
  amp: number
  cd: number
  add: number
}
