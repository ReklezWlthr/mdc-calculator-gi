import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ganyu = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Liutian Archery`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, an icy aura will accumulate on the arrowhead before the arrow is fired. Has different effects based on how long the energy has been charged:
      <br />Charge Level 1: Fires off an icy arrow that deals <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />Charge Level 2: Fires off a Frostflake Arrow that deals <b class="text-genshin-cryo">Cryo DMG</b>. The Frostflake Arrow blooms after hitting its target, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Trail of the Qilin`,
      content: `Leaving a single Ice Lotus behind, Ganyu dashes backward, shunning all impurity and dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b>Ice Lotus</b>
      <br />- Continuously taunts surrounding opponents, attracting them to attack it.
      <br />- Endurance scales based on Ganyu's Max HP.
      <br />- Blooms profusely when destroyed or once its duration ends, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.`,
    },
    burst: {
      title: `Celestial Shower`,
      content: `Coalesces atmospheric frost and snow to summon a Sacred Cryo Pearl that exorcises evil.
      <br />During its ability duration, the Sacred Cryo Pearl will continuously rain down shards of ice, striking opponents within an AoE and dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      `,
    },
    a1: {
      title: `A1: Undivided Heart`,
      content: `After firing a Frostflake Arrow, the CRIT Rate of subsequent Frostflake Arrows and their resulting bloom effects is increased by <span class="text-desc">20%</span> for <span class="text-desc">5</span>s.`,
    },
    a4: {
      title: `A4: Harmony between Heaven and Earth`,
      content: `Celestial Shower grants a <span class="text-desc">20%</span> <b class="text-genshin-cryo">Cryo DMG Bonus</b> to active members in the AoE.`,
    },
    util: {
      title: 'Preserved for the Hunt',
      content: `Refunds <span class="text-desc">15%</span> of the ore used when crafting Bow-type weapons.`,
    },
    c1: {
      title: `C1: Dew-Drinker`,
      content: `Taking DMG from a Charge Level 2 Frostflake Arrow or Frostflake Arrow Bloom decreases opponents' <b class="text-genshin-cryo">Cryo RES</b> by <span class="text-desc">15%</span> for <span class="text-desc">6</span>s.
      <br />A hit regenerates <span class="text-desc">2</span> Energy for Ganyu. This effect can only occur once per Charge Level 2 Frostflake Arrow, regardless if Frostflake Arrow itself or its Bloom hit the target.`,
    },
    c2: {
      title: `C2: The Auspicious`,
      content: `Trail of the Qilin gains <span class="text-desc">1</span> additional charge.`,
    },
    c3: {
      title: `C3: Cloud-Strider`,
      content: `Increases the Level of Celestial Shower by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Westward Sojourn`,
      content: `Opponents standing within the AoE of Celestial Shower take increased DMG. This effect strengthens over time.
      <br />Increased DMG taken begins at <span class="text-desc">5%</span> and increases by <span class="text-desc">5%</span> every <span class="text-desc">3</span>s, up to a maximum of 25%.
      <br />The effect lingers for <span class="text-desc">3</span>s after the opponent leaves the AoE.`,
    },
    c5: {
      title: `C5: The Merciful`,
      content: `Increases the Level of Trail of the Qilin by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: The Clement`,
      content: `Using Trail of the Qilin causes the next Frostflake Arrow shot within <span class="text-desc">30</span>s to not require charging.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ganyu_a1',
      text: `Enhanced Frostflake Arrow`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ganyu_a4',
      text: `A4 Cryo DMG Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ganyu_c1',
      text: `C1 Cryo RES Shred`,
      ...talents.c1,
      show: c >= 1,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'ganyu_c4',
      text: `C4 Vulnerability Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 5,
      min: 0,
      max: 5,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'ganyu_a4')]

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
          value: [{ scaling: calcScaling(0.3173, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.356, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4549, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.4549, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.4825, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '6-Hit',
          value: [{ scaling: calcScaling(0.5762, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
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
          name: 'Aimed Shot Charge Level 1',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
        {
          name: 'Frostflake Arrow DMG',
          value: [{ scaling: calcScaling(1.28, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
          cr: form.ganyu_a1 ? 0.2 : 0,
        },
        {
          name: 'Frostflake Arrow Bloom DMG',
          value: [{ scaling: calcScaling(2.176, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
          cr: form.ganyu_a1 ? 0.2 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG [x2]',
          value: [{ scaling: calcScaling(1.32, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Ice Shard DMG`,
          value: [{ scaling: calcScaling(0.7027, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.ganyu_a4) base[Stats.CRYO_DMG] += 0.2
      if (form.ganyu_c1) base.CRYO_RES_PEN += 0.15
      if (form.ganyu_c4) base.VULNERABILITY += 0.5 * form.ganyu_a4

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.ganyu_c1) base.CRYO_RES_PEN += 0.15
      if (form.ganyu_c4) base.VULNERABILITY += 0.5 * form.ganyu_a4

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ganyu
