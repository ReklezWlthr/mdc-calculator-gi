import { IContent } from '@src/domain/genshin/conditional'
import { StatsObject } from '../baseConstant'
import { Element, Stats } from '@src/domain/genshin/constant'
import { BaseReactionDmg } from '@src/domain/genshin/scaling'
import _ from 'lodash'
import { calcAdditive, calcAmplifying } from '@src/core/utils/data_format'

const Reactions: (level: number, element: Element, swirl: Element, stat: StatsObject) => IContent[] = (
  level,
  element,
  swirl,
  stat
) => {
  const amp = calcAmplifying(stat?.[Stats.EM] || 0)
  const add = calcAdditive(stat?.[Stats.EM] || 0)
  const base = BaseReactionDmg[level - 1]

  return [
    {
      type: 'element',
      id: 'swirl',
      text: `Swirled Element`,
      title: `Swirled Element`,
      content: `The target element Swirled by this character. Should not be confused with <b>Elemental Absorption</b>.
      <br />Elemental damage caused by Swirl can trigger chain Reactions that scale with this character's Elemental Mastery.`,
      show: element === Element.ANEMO,
      default: Element.PYRO,
    },
    {
      type: 'toggle',
      id: 'melt_forward',
      text: `Forward Melt`,
      title: `Forward Melt`,
      content: `Increase <b class="text-genshin-pyro">Pyro DMG</b> by <span class="text-desc">${parseFloat(
        (2 * (1 + stat?.MELT_DMG + amp)).toFixed(2)
      )}</span> times. Can be applied to Swirl and Burning.`,
      show: _.includes([element, swirl], Element.PYRO) || element === Element.PYRO,
      default: false,
    },
    {
      type: 'toggle',
      id: 'melt_reverse',
      text: `Reverse Melt`,
      title: `Reverse Melt`,
      content: `Increase <b class="text-genshin-cryo">Cryo DMG</b> by <span class="text-desc">${parseFloat(
        (1.5 * (1 + stat?.MELT_DMG + amp)).toFixed(2)
      )}</span> times.`,
      show: _.includes([element, swirl], Element.CRYO),
      default: false,
    },
    {
      type: 'toggle',
      id: 'vape_forward',
      text: `Forward Vaporize`,
      title: `Forward Vaporize`,
      content: `Increase <b class="text-genshin-hydro">Hydro DMG</b> by <span class="text-desc">${parseFloat(
        (2 * (1 + stat?.VAPE_DMG + amp)).toFixed(2)
      )}</span> times.`,
      show: _.includes([element, swirl], Element.HYDRO),
      default: false,
    },
    {
      type: 'toggle',
      id: 'vape_reverse',
      text: `Reverse Vaporize`,
      title: `Reverse Vaporize`,
      content: `Increase <b class="text-genshin-pyro">Pyro DMG</b> by <span class="text-desc">${parseFloat(
        (1.5 * (1 + stat?.VAPE_DMG + amp)).toFixed(2)
      )}</span> times. Can be applied to Swirl and Burning.`,
      show: _.includes([element, swirl], Element.PYRO) || element === Element.PYRO,
      default: false,
    },
    {
      type: 'toggle',
      id: 'spread',
      text: `Spread`,
      title: `Spread`,
      content: `Increase <b class="text-genshin-dendro">Dendro Base DMG</b> by <span class="text-desc">${_.round(
        1.25 * base * (1 + stat?.SPREAD_DMG + add)
      ).toLocaleString()}</span>.`,
      show: element === Element.DENDRO,
      default: false,
    },
    {
      type: 'toggle',
      id: 'aggravate',
      text: `Aggravate`,
      title: `Aggravate`,
      content: `Increase <b class="text-genshin-electro">Electro Base DMG</b> by <span class="text-desc">${_.round(
        1.15 * base * (1 + stat?.AGGRAVATE_DMG + add)
      ).toLocaleString()}</span>.`,
      show: _.includes([element, swirl], Element.ELECTRO),
      default: false,
    },
  ]
}

export default Reactions
