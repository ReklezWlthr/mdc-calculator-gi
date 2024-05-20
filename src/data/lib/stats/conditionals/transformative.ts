import { IContent } from '@src/domain/genshin/conditional'
import { StatsObject } from '../baseConstant'
import { Element, Stats } from '@src/domain/genshin/constant'
import { BaseReactionDmg } from '@src/domain/genshin/scaling'
import _ from 'lodash'
import { calcTransformative } from '@src/core/utils/data_format'

const Transformative = (level: number, element: Element, stat: StatsObject, swirl: Element, nilou?: boolean) => {
  const emBonus = calcTransformative(stat?.[Stats.EM] || 0)
  const base = BaseReactionDmg[level - 1]

  return [
    {
      name: 'Swirl',
      element: swirl,
      show: element === Element.ANEMO,
      dmg: 0.6 * base * (1 + emBonus + stat?.SWIRL_DMG),
      amp: swirl === Element.PYRO ? stat?.PYRO_MULT || 1 : 1,
      cd: 0,
      add: swirl === Element.ELECTRO ? stat?.ELECTRO_F_DMG : 0,
    },
    {
      name: 'Electro-Charged',
      element: Element.ELECTRO,
      show: _.includes([Element.HYDRO, Element.ELECTRO, Element.ANEMO], element),
      dmg: 1.2 * base * (1 + emBonus + stat?.TASER_DMG),
      cd: 0,
      amp: 1,
    },
    {
      name: 'Superconduct',
      element: Element.CRYO,
      show: _.includes([Element.CRYO, Element.ELECTRO, Element.ANEMO], element),
      dmg: 0.5 * base * (1 + emBonus + stat?.SUPERCONDUCT_DMG),
      cd: 0,
      amp: 1,
    },
    {
      name: nilou ? 'Bloom: Bountiful Core' : 'Bloom',
      element: Element.DENDRO,
      show: _.includes([Element.HYDRO, Element.DENDRO, Element.ANEMO], element),
      dmg: 2 * base * (1 + emBonus + stat?.BLOOM_DMG),
      cd: stat?.CORE_CD,
      amp: 1,
    },
    {
      name: 'Hyperbloom',
      element: Element.DENDRO,
      show: _.includes([Element.ELECTRO, Element.ANEMO], element),
      dmg: 3 * base * (1 + emBonus + stat?.HYPERBLOOM_DMG),
      cd: stat?.CORE_CD,
      amp: 1,
    },
    {
      name: 'Burgeon',
      element: Element.DENDRO,
      show: _.includes([Element.PYRO, Element.ANEMO], element),
      dmg: 3 * base * (1 + emBonus + stat?.BURGEON_DMG),
      cd: stat?.CORE_CD,
      amp: 1,
    },
    {
      name: 'Burning',
      element: Element.PYRO,
      show: _.includes([Element.DENDRO, Element.PYRO, Element.ANEMO], element),
      dmg: 0.25 * base * (1 + emBonus + stat?.BURNING_DMG),
      cd: stat?.CORE_CD,
      amp: 1,
    },
    {
      name: 'Overloaded',
      element: Element.PYRO,
      show: _.includes([Element.PYRO, Element.ELECTRO, Element.ANEMO], element),
      dmg: 2 * base * (1 + emBonus + stat?.OVERLOAD_DMG),
      cd: 0,
      amp: 1,
    },
    {
      name: 'Shattered',
      element: Element.PHYSICAL,
      show: true,
      dmg: 1.5 * base * (1 + emBonus + stat?.SHATTER_DMG),
      cd: 0,
      amp: 1,
    },
  ]
}

export default Transformative
