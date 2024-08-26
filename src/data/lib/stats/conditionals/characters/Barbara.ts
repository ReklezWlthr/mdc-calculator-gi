import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Barbara = (c: number, a: number, t: ITalentLevel) => {
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
      trace: `Normal Attack`,
      title: `Whisper of Water`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 water splash attacks that deal <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-hydro">AoE Hydro DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the might of Hydro, Barbara plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Let the Show Begin♪`,
      content: `Summons water droplets resembling musical notes that form a Melody Loop, dealing <b class="text-genshin-hydro">Hydro DMG</b> to surrounding opponents and applying the <b class="text-genshin-hydro">Wet</b> status to them.
      <br />
      <br /><b>Melody Loop</b>
      <br />- On hit, Barbara's Normal Attacks heal your own party members and nearby teammates for a certain amount of HP, which scales with Barbara's Max HP.
      <br />- On hit, Barbara's Charged Attack generates 4 times the amount of healing.
      <br />- Periodically regenerates your own active character's HP.
      <br />- Applies the <b class="text-genshin-hydro">Wet</b> status to the character and to opponents who come in contact with them.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Shining Miracle♪`,
      content: `Heals your own party members and nearby teammates for a large amount of HP that scales with Barbara's Max HP.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Glorious Season`,
      content: `The Stamina Consumption of characters within Let the Show Begin♪'s Melody Loop is reduced by <span class="text-desc">12%</span>.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Encore`,
      content: `When your active character gains an Elemental Orb/Particle, the duration of the Melody Loop of Let the Show Begin♪ is extended by <span class="text-desc">1</span>s.
      <br />The maximum extension is <span class="text-desc">5</span>s.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `With My Whole Heart♪`,
      content: `When Perfect Cooking is achieved on a dish with restorative effects, Barbara has a <span class="text-desc">12%</span> chance to obtain double the product.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Gleeful Songs`,
      content: `Barbara regenerates <span class="text-desc">1</span> Energy every <span class="text-desc">10</span>s.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Vitality Burst`,
      content: `Decreases the CD of Let the Show Begin♪ by <span class="text-desc">15%</span>.
      <br />During the ability's duration, your active character gains a <span class="text-desc">15%</span> <b class="text-genshin-hydro">Hydro DMG Bonus</b>.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Star of Tomorrow`,
      content: `Increases the Level of Shining Miracle♪ by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Attentiveness Be My Power`,
      content: `Every opponent Barbara hits with her Charged Attack regenerates <span class="text-desc">1</span> Energy for her.
      A maximum of <span class="text-desc">5</span> energy can be regenerated in this manner with any one Charged Attack.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `The Purest Companionship`,
      content: `Increases the Level of Let the Show Begin♪ by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Dedicating Everything to You`,
      content: `When Barbara is in the party but not on the field, and one of your own party members falls:
      <br />- Automatically revives the fallen character.
      <br />- Fully restores the revived character's HP to <span class="text-desc">100%</span>.
      <br />This effect can only occur once every <span class="text-desc">15</span> mins.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'bar_burst',
      text: `Burst Hydro DMG`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'bar_burst')]

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
          value: [{ scaling: calcScaling(0.3784, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3552, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4104, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.552, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.6624, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.HYDRO)
      base.SKILL_SCALING = [
        {
          name: 'Droplet DMG',
          value: [{ scaling: calcScaling(0.584, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Healing Per Hit',
          value: [{ scaling: calcScaling(0.0075, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(72.2, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Healing Per Charged Hit',
          value: [{ scaling: calcScaling(0.0075, skill, 'elemental', '1') * 4, multiplier: Stats.HP }],
          flat: calcScaling(72.2, skill, 'special', 'flat') * 4,
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Continuous Healing',
          value: [{ scaling: calcScaling(0.04, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(385.18, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Healing',
          value: [{ scaling: calcScaling(0.176, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1694, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (form.bar_burst) base[Stats.HYDRO_DMG] += 0.15

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.bar_burst) base[Stats.HYDRO_DMG] += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Barbara
