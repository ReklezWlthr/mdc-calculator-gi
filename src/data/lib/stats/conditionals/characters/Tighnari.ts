import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Tighnari = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      title: `Khanda Barrier-Buster`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, the power of Dendro will accumulate on the arrowhead before the arrow is fired. Has different effects based on how long the energy has been charged:
      <br />- Charge Level 1: Fires off an arrow carrying the power of flora that deals <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />- Charge Level 2: Fires off a Wreath Arrow that deals <b class="text-genshin-dendro">Dendro DMG</b>. Upon hit, the Wreath Arrow will create <span class="text-yellow">4</span> Clusterbloom Arrows that will track nearby opponents automatically and deal <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Vijnana-Phala Mine`,
      content: `Tighnari throws a Vijnana Stormheart ahead that deals <b class="text-genshin-dendro">AoE Dendro DMG</b>, creating a Vijnana-Khanda Field that creates mysterious illusions that taunt opponents and draw their fire.
      <br />Additionally, Tighnari gains the Vijnana Suffusion effect, which will decrease the Wreath Arrow's charging time by <span class="text-yellow">2.4</span>s. This effect will dissipate once the skill duration ends or after Tighnari has fired <span class="text-yellow">3</span> Wreath Arrows.`,
    },
    burst: {
      title: `Fashioner's Tanglevine Shaft`,
      content: `Combines the power of all seeds to fire <span class="text-yellow">6</span> Tanglevine Shafts that can track opponents and deal <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />After they hit, the Tanglevine Shafts will create a secondary wave of Tanglevine Shafts that can also track nearby opponents and deal <b class="text-genshin-dendro">Dendro DMG</b> on hit.
      `,
    },
    a1: {
      title: `A1: Keen Sight`,
      content: `After Tighnari fires a Wreath Arrow, his Elemental Mastery is increased by <span class="text-yellow">50</span> for <span class="text-yellow">4</span>s.`,
    },
    a4: {
      title: `A4: Scholarly Blade`,
      content: `For every point of Elemental Mastery Tighnari possesses, his Charged Attack and Fashioner's Tanglevine Shaft DMG are increased by <span class="text-yellow">0.06%</span>.
      <br />The maximum DMG Bonus obtainable this way is <span class="text-yellow">60%</span>.`,
      value: [
        {
          name: 'Current Bonus DMG',
          value: { stat: Stats.EM, scaling: (em) => toPercentage(_.min([0.0006 * em, 0.6])) },
        },
      ],
    },
    c1: {
      title: `C1: Beginnings Determined at the Roots`,
      content: `Tighnari's Charged Attack CRIT Rate is increased by <span class="text-yellow">15%</span>.`,
    },
    c2: {
      title: `C2: Origins Known From the Stem`,
      content: `When there are opponents within the Vijnana-Khanda Field created by Vijnana-Phala Mine, Tighnari gains <span class="text-yellow">20%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b>.
      <br />The effect will last up to <span class="text-yellow">6</span>s if the field's duration ends or if it no longer has opponents within it.`,
    },
    c3: {
      title: `C3: Fortunes Read Amongst the Branches`,
      content: `Increases the Level of Fashioner's Tanglevine Shaft by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Withering Glimpsed in the Leaves`,
      content: `When Fashioner's Tanglevine Shaft is unleashed, all nearby party members gain <span class="text-yellow">60</span> Elemental Mastery for <span class="text-yellow">8</span>s. If the Fashioner's Tanglevine Shaft triggers a Burning, Bloom, Quicken, or Spread reaction, their Elemental Mastery will be further increased by <span class="text-yellow">60</span>. This latter case will also refresh the buff state's duration.`,
    },
    c5: {
      title: `C5: Comprehension Amidst the Flowers`,
      content: `Increases the Level of Vijnana-Phala Mine by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: Karma Adjudged From the Leaden Fruit`,
      content: `Wreath Arrow's charging time is decreased by <span class="text-yellow">0.9</span>s, and will produce <span class="text-yellow">1</span> additional Clusterbloom Arrow upon hit. This arrow deals <span class="text-yellow">150%</span> of Tighnari's ATK as DMG.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'tigh_a1',
      text: `A1 EM Buff`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'tigh_c2',
      text: `C2 Dendro DMG Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'number',
      id: 'tigh_c4',
      text: `C4 EM Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 2,
      min: 0,
      max: 2,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'tigh_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4463, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4197, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.2645, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6863, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Aimed Shot',
          value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Level 1 Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Wreath Arrow DMG',
          value: [{ scaling: calcScaling(0.872, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Clusterbloom Arrow DMG',
          value: [{ scaling: calcScaling(0.386, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.496, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Tanglevine Shaft DMG [x6]`,
          value: [{ scaling: calcScaling(0.5562, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Secondary Tanglevine Shaft DMG [x6]`,
          value: [{ scaling: calcScaling(0.6798, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.tigh_a1) base[Stats.EM] += 50
      if (c >= 1) base.CHARGE_CR += 0.15
      if (form.tigh_c2) base[Stats.DENDRO_DMG] += 0.2
      if (form.tigh_c4) base[Stats.EM] += 60 * form.tigh_c4

      if (c >= 6)
        base.CHARGE_SCALING.push({
          name: 'C6 Clusterbloom Arrow DMG',
          value: [{ scaling: 1.5, multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.tigh_c4) base[Stats.EM] += 60 * form.tigh_c4

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        const a4Bonus = _.min([0.0006 * base[Stats.EM], 0.6])
        base.CHARGE_DMG += a4Bonus
        base.BURST_DMG += a4Bonus
      }

      return base
    },
  }
}

export default Tighnari
