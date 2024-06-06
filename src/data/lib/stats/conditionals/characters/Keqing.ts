import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Keqing = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Yunlai Swordsmanship`,
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
      title: `Stellar Restoration`,
      content: `Hurls a Lightning Stiletto that annihilates her opponents like the swift thunder.
      <br />When the Stiletto hits its target, it deals <b class="text-genshin-electro">Electro DMG</b> to opponents in a small AoE, and places a Stiletto Mark on the spot hit.
      <br />
      <br /><b>Hold</b>
      <br />Hold to adjust the direction in which the Stiletto shall be thrown.
      <br />Stilettos thrown by the Hold attack mode can be suspended in mid-air, allowing Keqing to jump to them when using Stellar Restoration a second time.
      <br />
      <br /><b>Lightning Stiletto</b>
      <br />If Keqing uses Stellar Restoration again or uses a Charged Attack while its duration lasts, it will clear the Stiletto Mark and produce different effects:
      <br />- If she uses Stellar Restoration again, she will blink to the location of the Mark and unleash one slashing attack that deals <b class="text-genshin-electro">AoE Electro DMG</b>. When blinking to a Stiletto that was thrown from a Holding attack, Keqing can leap across obstructing terrain.
      <br />- If Keqing uses a Charged Attack, she will ignite a series of thundering cuts at the Mark's location, dealing <b class="text-genshin-electro">AoE Electro DMG</b>.
      `,
    },
    burst: {
      title: `Starward Sword`,
      content: `Keqing unleashes the power of lightning, dealing <b class="text-genshin-electro">Electro DMG</b> in an AOE.
      <br />She then blends into the shadow of her blade, striking a series of thunderclap-blows to nearby opponents simultaneously that deal multiple instances of <b class="text-genshin-electro">Electro DMG</b>.
      <br />The final attack deals massive <b class="text-genshin-electro">AoE Electro DMG</b>.`,
    },
    a1: {
      title: `A1: Thundering Penance`,
      content: `After recasting Stellar Restoration while a Lightning Stiletto is present, Keqing's weapon gains an <b class="text-genshin-electro">Electro Infusion</b> for <span class="text-desc">5</span>s.`,
    },
    a4: {
      title: `A4: Aristocratic Dignity`,
      content: `When casting Starward Sword, Keqing's CRIT Rate is increased by <span class="text-desc">15%</span>, and her Energy Recharge is increased by <span class="text-desc">15%</span>. This effect lasts for <span class="text-desc">8</span>s.`,
    },
    util: {
      title: `Land's Overseer`,
      content: `When dispatched on an expedition in Liyue, time consumed is reduced by <span class="text-desc">25%</span>.`,
    },
    c1: {
      title: `C1: Thundering Might`,
      content: `Recasting Stellar Restoration while a Lightning Stiletto is present causes Keqing to deal <span class="text-desc">50%</span> of her ATK as <b class="text-genshin-electro">AoE Electro DMG</b> at the start point and terminus of her Blink.`,
    },
    c2: {
      title: `C2: Keen Extraction`,
      content: `When Keqing's Normal and Charged Attacks hit opponents affected by <b class="text-genshin-electro">Electro</b>, they have a <span class="text-desc">50%</span> chance of producing an Elemental Particle.
      <br />This effect can only occur once every <span class="text-desc">5</span>s.`,
    },
    c3: {
      title: `C3: Foreseen Reformation`,
      content: `Increases the Level of Starward Sword by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Attunement`,
      content: `For 10s after Keqing triggers an <b class="text-genshin-electro">Electro</b>-related Elemental Reaction, her ATK is increased by <span class="text-desc">25%</span>.`,
    },
    c5: {
      title: `C5: Beckoning Stars`,
      content: `Increases the Level of Stellar Restoration by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Tenacious Star`,
      content: `When initiating a Normal Attack, a Charged Attack, Elemental Skill or Elemental Burst, Keqing gains a <span class="text-desc">6%</span> <b class="text-genshin-electro">Electro DMG Bonus</b> for 8s.
      <br />Effects triggered by Normal Attacks, Charged Attacks, Elemental Skills and Elemental Bursts are considered independent entities.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'keq_infusion',
      text: `A1 Electro Infusion`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'keq_a4',
      text: `A4 Burst Buffs`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'keq_c4',
      text: `C4 ATK Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'number',
      id: 'keq_c6',
      text: `C6 Electro DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: 4,
      min: 0,
      max: 4,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 40

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4102, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4102, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5444, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [1]',
          value: [{ scaling: calcScaling(0.3148, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [2]',
          value: [{ scaling: calcScaling(0.344, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.6699, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.768, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.86, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Lightning Stiletto DMG',
          value: [{ scaling: calcScaling(0.504, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Slashing DMG',
          value: [{ scaling: calcScaling(1.68, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Thunderclap Slash DMG [x2]',
          value: [{ scaling: calcScaling(0.84, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.88, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Consecutive Slash DMG [x8]',
          value: [{ scaling: calcScaling(0.24, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Last Attack DMG',
          value: [{ scaling: calcScaling(1.888, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.keq_infusion) base.infuse(Element.ELECTRO)
      if (form.keq_a4) {
        base[Stats.CRIT_RATE] += 0.15
        base[Stats.ER] += 0.15
      }
      if (c >= 1)
        base.SKILL_SCALING.push({
          name: 'C1 Blink DMG',
          value: [{ scaling: 0.5, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        })
      if (form.keq_c4) base[Stats.P_ATK] += 0.25
      if (form.keq_c6) base[Stats.ELECTRO_DMG] += 0.06 * form.keq_c6

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Keqing
