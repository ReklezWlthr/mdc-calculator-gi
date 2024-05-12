import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { StatObjectT } from '@src/core/hooks/useStat'
import { toPercentage } from '@src/core/utils/converter'
import { IContent } from '@src/domain/genshin/conditional'

const Nahida = (c: number, a: number, stat: StatObjectT) => {
  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'nahida_a1',
      text: `Compassion Illuminated`,
      title: 'A1: Compassion Illuminated',
      content: `When unleashing Illusory Heart, the Shrine of Maya will gain the following effects:
      <br />The Elemental Mastery of the active character within the field will be increased by <span class="text-yellow">25%</span> of the Elemental Mastery of the party member with the highest Elemental Mastery.
      <br />You can gain a maximum of <span class="text-yellow">250</span> Elemental Mastery in this manner.`,
      show: a >= 1,
      value: [{ name: 'Elemental Mastery', value: 0.25, formatter: _.floor }],
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'nahida_a4')]

  return {
    content,
    teammateContent,
    preCompute: (form: Record<string, any>) => {
      const base = _.cloneDeep(baseStatsObject)

      base.BASIC_SCALING = [
        { name: '1-Hit', value: 0.403 * stat.atk, element: Element.PHYSICAL, property: TalentProperty.NA },
        { name: '2-Hit', value: 0.3697 * stat.atk, element: Element.PHYSICAL, property: TalentProperty.NA },
        { name: '3-Hit', value: 0.4587 * stat.atk, element: Element.PHYSICAL, property: TalentProperty.NA },
        { name: '4-Hit', value: 0.5841 * stat.atk, element: Element.PHYSICAL, property: TalentProperty.NA },
      ]
      base.CHARGE_SCALING = [
        { name: 'Charged Attack', value: 1.32 * stat.atk, element: Element.PHYSICAL, property: TalentProperty.CA },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', stat.atk)
      base.SKILL_SCALING = [
        { name: 'Press DMG', value: 0.984 * stat.atk, element: Element.DENDRO, property: TalentProperty.SKILL },
        { name: 'Hold DMG', value: 1.304 * stat.atk, element: Element.DENDRO, property: TalentProperty.SKILL },
        {
          name: 'Tri-Karma Purification DMG',
          value: 1.032 * stat.atk + 2.064 * stat.em,
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
          bonus: a >= 4 ? 0.001 * _.max([stat.em - 200, 0]) : 0,
          cr: a >= 4 ? 0.0003 * _.max([stat.em - 200, 0]) : 0,
        },
      ]

      if (form.dustOfPurification) base[Stats.ALL_DMG] += 0.17
      if (form.homuncularNature) base[Stats.EM] += 250
      if (form.descentOfDivinity) base.PLUNGE_DMG += 0.3

      return base
    },
    preComputeShared: (base: StatsObject, form: Record<string, any>) => {
      if (form.dustOfPurification) base[Stats.ALL_DMG] += 0.17
      if (form.homuncularNature) base[Stats.EM] += 250
      if (form.descentOfDivinity) base.PLUNGE_DMG += 0.3

      return base
    },
  }
}

export default Nahida
