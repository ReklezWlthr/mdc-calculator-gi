import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerGrass = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Foreign Fieldcleaver`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Razorgrass Blade`,
      content: `With a flourish of your blade, you unleash a spray of razor-sharp leaves that go before you and deal <b class="text-genshin-dendro">Dendro DMG</b>.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Surgent Manifestation`,
      content: `Calling upon the might of the flora all around you, you create a Lea Lotus Lamp.
      <br />This Lamp will deal continuous <b class="text-genshin-dendro">Dendro DMG</b> to opponents within its AoE.
      <br />
      <br /><b>Lotuslight Transfiguration</b>
      <br />The Lea Lotus Lamp will undergo the following changes after it comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-electro">Electro</b>/<b class="text-genshin-pyro">Pyro</b>:
      <br />- <b class="text-genshin-hydro">Hydro</b>: the Lamp's AoE and the AoE of its attacks are increased.
      <br />- <b class="text-genshin-electro">Electro</b>: the Lamp's ATK SPD is increased.
      <br />- <b class="text-genshin-pyro">Pyro</b>: the Lamp will explode after a short delay and then disappear, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />The Lea Lotus Lamp can only undergo one Lotuslight Transfiguration in its duration.
      <br />
      <br />Only one Lamp created by the Traveler can exist at any one time.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Verdant Overgrowth`,
      content: `Lea Lotus Lamp will obtain one level of Overflowing Lotuslight every second it is on the field, increasing the Elemental Mastery of active character(s) within its AoE by <span class="text-desc">6</span>. Overflowing Lotuslight has a maximum of <span class="text-desc">10</span> stacks.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Verdant Luxury`,
      content: `Every point of Elemental Mastery the Traveler possesses increases the DMG dealt by Razorgrass Blade by <span class="text-desc">0.15%</span> and the DMG dealt by Surgent Manifestation by <span class="text-desc">0.1%</span>.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Symbiotic Creeper`,
      content: `After Razorgrass Blade hits an opponent, it will regenerate <span class="text-desc">3.5</span> Energy for the Traveler.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Green Resilience`,
      content: `Lea Lotus Lamp's duration is increased by <span class="text-desc">3</span>s.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Whirling Weeds`,
      content: `Increases the Level of Razorgrass Blade by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Treacle Grass`,
      content: `After the Lea Lotus Lamp triggers a Lotuslight Transfiguration, it will obtain <span class="text-desc">5</span> stacks of the Overflowing Lotuslight effect from the Passive Talent "Verdant Overgrowth."
      <br />You must have unlocked this Passive Talent first.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Viridian Transience`,
      content: `Increases the Level of Surgent Manifestation by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Withering Aggregation`,
      content: `The <b class="text-genshin-dendro">Dendro DMG Bonus</b> of the character under the effect of Overflowing Lotuslight as created by the Lea Lotus Lamp is increased by <span class="text-desc">12%</span>. If the Lamp has experienced a Lotuslight Transfiguration previously, the character will also gain <span class="text-desc">12%</span> DMG Bonus for the corresponding element.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'dmc_a1',
      text: `A1 Bonus EM`,
      ...talents.a1,
      show: a >= 1,
      default: 10,
      min: c >= 4 ? 5 : 0,
      max: 10,
    },
    {
      type: 'toggle',
      id: 'dmc_c6',
      text: `C6 DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'dmc_a1'),
    {
      type: 'element',
      id: 'dmc_c6_transfig',
      text: `C6 Transfiguration Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: Element.HYDRO,
      options: [
        { name: 'None', value: 'none' },
        { name: Element.HYDRO, value: Element.HYDRO },
        { name: Element.ELECTRO, value: Element.ELECTRO },
        { name: Element.PYRO, value: Element.PYRO },
      ],
    },
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.445, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.434, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.53, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.583, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.708, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.559, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.607, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Lea Lotus Lamp Attack DMG',
          value: [{ scaling: calcScaling(0.8016, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Explosion DMG',
          value: [{ scaling: calcScaling(4.008, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.dmc_a1) base[Stats.EM] += form.dmc_a1 * 6
      if (form.dmc_a6) base[Stats.DENDRO_DMG].push({value: 0.12, name: '', source: ``})

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.dmc_c6_transfig) base[Stats[`${form.dmc_c6_transfig.toUpperCase()}_DMG`]].push({value: 0.12, name: '', source: ``})

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        base.SKILL_DMG.push({value: 0.0015, name: '', source: ``}) * base[Stats.EM]
        base.BURST_DMG.push({value: 0.001, name: '', source: ``}) * base[Stats.EM]
      }

      return base
    },
  }
}

export default TravelerGrass
