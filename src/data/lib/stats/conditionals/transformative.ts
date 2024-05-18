import { IContent } from '@src/domain/genshin/conditional'
import { StatsObject } from '../baseConstant'
import { Element, Stats } from '@src/domain/genshin/constant'
import { BaseReactionDmg } from '@src/domain/genshin/scaling'
import _ from 'lodash'
import { calcTransformative } from '@src/core/utils/data_format'

const Transformative = (level: number, element: Element, stat: StatsObject, nilou?: boolean, nahida?: boolean) => {
  const emBonus = calcTransformative(stat?.[Stats.EM] || 0)
  const base = BaseReactionDmg[level - 1]

  return [
    {
      name: 'Electro-Charged',
      element: Element.ELECTRO,
      show: _.includes([Element.HYDRO, Element.ELECTRO, Element.ANEMO], element),
      dmg: 1.2 * base * (1 + emBonus + stat?.TASER_DMG),
      amp: 0,
    },
    {
      name: 'Superconduct',
      element: Element.CRYO,
      show: _.includes([Element.CRYO, Element.ELECTRO, Element.ANEMO], element),
      dmg: 0.5 * base * (1 + emBonus + stat?.SUPERCONDUCT_DMG),
      amp: 0,
    },
    {
      name: nilou ? 'Bloom: Bountiful Core' : 'Bloom',
      element: Element.DENDRO,
      show: _.includes([Element.HYDRO, Element.DENDRO, Element.ANEMO], element),
      dmg: 2 * base * (1 + emBonus + stat?.BLOOM_DMG),
      amp: nahida ? 2 : 0,
    },
    {
      name: 'Hyperbloom',
      element: Element.DENDRO,
      show: _.includes([Element.ELECTRO, Element.ANEMO], element),
      dmg: 3 * base * (1 + emBonus + stat?.HYPERBLOOM_DMG),
      amp: nahida ? 2 : 0,
    },
    {
      name: 'Burgeon',
      element: Element.DENDRO,
      show: _.includes([Element.PYRO, Element.ANEMO], element),
      dmg: 3 * base * (1 + emBonus + stat?.BURGEON_DMG),
      amp: nahida ? 2 : 0,
    },
    {
      name: 'Burning',
      element: Element.DENDRO,
      show: _.includes([Element.DENDRO, Element.PYRO, Element.ANEMO], element),
      dmg: 0.25 * base * (1 + emBonus + stat?.BURNING_DMG),
      amp: 0,
    },
    {
      name: 'Overloaded',
      element: Element.PYRO,
      show: _.includes([Element.PYRO, Element.ELECTRO, Element.ANEMO], element),
      dmg: 2 * base * (1 + emBonus + stat?.OVERLOAD_DMG),
      amp: 0,
    },
    {
      name: 'Swirl',
      element: Element.ELECTRO,
      show: element === Element.ANEMO,
      dmg: 0.6 * base * (1 + emBonus + stat?.SWIRL_DMG),
      amp: 0,
    },
    {
      name: 'Shattered',
      element: Element.PHYSICAL,
      show: true,
      dmg: 1.5 * base * (1 + emBonus + stat?.SHATTER_DMG),
      amp: 0,
    },
  ]
}

export default Transformative
