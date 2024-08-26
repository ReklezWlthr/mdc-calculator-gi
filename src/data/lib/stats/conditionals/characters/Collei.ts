import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Collei = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Supplicant's Bowmanship`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, Dendro energy will accumulate on the arrowhead. A fully charged arrow will deal <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Floral Brush`,
      content: `Throws out a Floral Ring that deals 1 instance of <b class="text-genshin-dendro">Dendro DMG</b> to targets it comes into contact with.
      <br />The Floral Ring will return after a set time, dealing <b class="text-genshin-dendro">Dendro DMG</b> once again.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Trump-Card Kitty`,
      content: `Trusty Cuilein-Anbar comes to save the day!
      <br />Throws the doll named Cuilein-Anbar, causing an explosion that deals <b class="text-genshin-dendro">AoE Dendro DMG</b>, creating a Cuilein-Anbar Zone. Cuilein-Anbar will bounce around within this zone, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Floral Sidewinder`,
      content: `If one of your party members has triggered Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon reactions before the Floral Ring returns, it will grant the character the Sprout effect upon return, which will continuously deal <b class="text-genshin-dendro">Dendro DMG</b> equivalent to <span class="text-desc">40%</span> of Collei's ATK to nearby opponents for <span class="text-desc">3</span>s.
      <br />If another Sprout effect is triggered during its initial duration, the initial effect will be removed. DMG dealt by Sprout is considered Elemental Skill DMG.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `The Languid Wood`,
      content: `When a character within the Cuilein-Anbar Zone triggers Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon reactions, the Zone's duration will be increased by <span class="text-desc">1</span>s.
      <br />A single Trump-Card Kitty can be extended by up to <span class="text-desc">3</span>s.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Gliding Champion of Sumeru`,
      content: `Decreases gliding Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Deepwood Patrol`,
      content: `When in the party and not on the field, Collei's Energy Recharge is increased by <span class="text-desc">20%</span>.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Through Hill and Copse`,
      content: `The Passive Talent Floral Sidewinder is changed to this:
      <br />The Floral Ring will grant the character the Sprout effect from Floral Sidewinder upon return, dealing <span class="text-desc">40%</span> of Collei's ATK as <b class="text-genshin-dendro">Dendro DMG</b> to nearby opponents for <span class="text-desc">3</span>s.
      <br />From the moment of using Floral Brush to the moment when this instance of Sprout effect ends, if any of your party members triggers Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon reactions, the Sprout effect will be extended by <span class="text-desc">3</span>s.
      <br />The Sprout effect can only be extended this way once. If another Sprout effect is triggered during its initial duration, the initial effect will be removed.
      <br />Requires you to have unlocked the Floral Sidewinder Passive Talent.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Scent of Summer`,
      content: `Increases the Level of Floral Brush by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Gift of the Woods`,
      content: `Using Trump-Card Kitty will increase all nearby characters' Elemental Mastery by <span class="text-desc">60</span> for <span class="text-desc">12</span>s (not including Collei herself).`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `All Embers`,
      content: `Increases the Level of Trump-Card Kitty by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Forest of Falling Arrows`,
      content: `When the Floral Ring hits, it will create a miniature Cuilein-Anbar that will deal <span class="text-desc">200%</span> of Collei's ATK as <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />Each Floral Brush can only create one such miniature Cuilein-Anbar.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'collei_c1',
      text: `Off-Field Energy Recharge`,
      ...talents.c1,
      show: c >= 1,
      default: false,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'collei_c4',
      text: `C4 EM Share`,
      ...talents.c4,
      show: c >= 4,
      default: true,
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
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.436, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4266, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5409, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6803, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          name: 'Fully-Charged Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG [x2]',
          value: [{ scaling: calcScaling(1.512, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Explosion DMG`,
          value: [{ scaling: calcScaling(2.0182, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Leap DMG [x12]`,
          value: [{ scaling: calcScaling(0.4325, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1)
        base.SKILL_SCALING.push({
          name: `Floral Sidewinder DMG`,
          value: [{ scaling: 0.4, multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        })

      if (form.collei_c1) base[Stats.ER] += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.collei_c4) base[Stats.EM] += 60

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Collei
