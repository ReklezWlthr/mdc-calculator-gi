import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kaveh = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Schematic Setup`,
      content: `<b>Normal Attack</b>
      <br />Uses Mehrak to perform up to 4 consecutive attacks.
      <br />
      <br /><b>Charged Attack</b>
      <br />Drains Stamina over time to perform continuous spinning attacks against all nearby opponents.
      <br />At the end of the sequence, performs a more powerful slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_04',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Artistic Ingenuity`,
      content: `Uses Mehrak's mapping ability for offensive purposes, initiating a radial scan that deals <b class="text-genshin-dendro">AoE Dendro DMG</b>. It will also scan all <b class="text-genshin-dendro">Dendro Cores</b> in its AoE and cause them to immediately burst.
      `,
      image: 'Skill_S_Kaveh_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Painted Dome`,
      content: `Completely unleashes Mehrak's energy and creates a cubic scanned space, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b> to all opponents within it, causing all <b class="text-genshin-dendro">Dendro Cores</b> in its AoE to immediately burst, and granting Kaveh the following enhanced combat abilities for a specific duration:
      <br />- Increases Kaveh's Normal, Charged, and Plunging Attack AoE, and converts his attack DMG to <b class="text-genshin-dendro">Dendro DMG</b> that cannot be overridden.
      <br />- All <b class="text-genshin-dendro">Dendro Cores</b> created by all your own party members through Bloom reactions will deal additional DMG when they burst.
      <br />- Increases Kaveh's resistance to interruption
      <br />These effects will be canceled once Kaveh leaves the field.`,
      image: 'Skill_E_Kaveh_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `An Architect's Undertaking`,
      content: `When DMG dealt by a <b class="text-genshin-dendro">Dendro Core</b> (including DMG from Burgeon and Hyperbloom) hits Kaveh, Kaveh will regain HP equal to <span class="text-desc">300%</span> of his Elemental Mastery. This effect can be triggered once every <span class="text-desc">0.5</span>s.`,
      image: 'UI_Talent_S_Kaveh_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `A Craftsman's Curious Conceptions`,
      content: `During <b>Painted Dome</b>, after Kaveh's Normal, Charged, or Plunging Attacks hit opponents, his Elemental Mastery will increase by <span class="text-desc">25</span>. This effect can be triggered once every <span class="text-desc">0.1</span>s. Max <span class="text-desc">4</span> stacks.
      <br />This effect will be canceled when <b>Painted Dome</b>'s effects end.`,
      image: 'UI_Talent_S_Kaveh_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: 'The Art of Budgeting',
      content: `When Kaveh crafts Landscape, Building, and Courtyard-type Furnishings, he has a <span class="text-desc">100%</span> chance to refund a portion of the materials used.`,
      image: 'UI_Talent_S_Kaveh_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Sublime Salutations`,
      content: `Within <span class="text-desc">3</span>s after using <b>Artistic Ingenuity</b>, Kaveh's <b class="text-genshin-dendro">Dendro RES</b> and Incoming Healing Bonus will be increased by <span class="text-desc">50%</span> and <span class="text-desc">25%</span> respectively.`,
      image: 'UI_Talent_S_Kaveh_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Grace of Royal Roads`,
      content: `Kaveh's Normal Attack SPD increases by <span class="text-desc">15%</span> during <b>Painted Dome</b>.`,
      image: 'UI_Talent_S_Kaveh_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Profferings of Dur Untash`,
      content: `Increases the Level of <b>Painted Dome</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kaveh_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Feast of Apadana`,
      content: `<b class="text-genshin-dendro">Dendro Cores</b> created from Bloom reactions Kaveh triggers will deal <span class="text-desc">60%</span> more DMG when they burst.`,
      image: 'UI_Talent_S_Kaveh_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Treasures of Bonkhanak`,
      content: `Increases the Level of <b>Artistic Ingenuity</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kaveh_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Pairidaeza's Dreams`,
      content: `When Kaveh's Normal, Charged, or Plunging Attacks hit opponents during <b>Painted Dome</b>, they will unleash <b class="text-genshin-dendro">Pairidaeza's Light</b> upon the opponent's position, dealing <span class="text-desc">61.8%</span> of Kaveh's ATK as <b class="text-genshin-dendro">AoE Dendro DMG</b> and causing all <b class="text-genshin-dendro">Dendro Cores</b> within that AoE to burst. This effect can be triggered once every <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Kaveh_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'kaveh_burst',
      text: `Painted Dome`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'kaveh_a4',
      text: `A4 EM Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: 4,
      min: 0,
      max: 4,
    },
    {
      type: 'toggle',
      id: 'kaveh_c1',
      text: `C1 Skill Buffs`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'kaveh_c4',
      text: `C4 Dendro Core Buff`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'kaveh_burst')]

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
          value: [{ scaling: calcScaling(0.7619, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.6964, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.8426, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.0269, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.5315, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(0.9615, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.04, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(1.6, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.kaveh_burst) {
        base.infuse(Element.DENDRO, true)
        const bloomDmg = calcScaling(0.2749, burst, 'elemental', '1')
        base.BLOOM_DMG.push({
          value: bloomDmg,
          name: 'Painted Dome',
          source: 'Self',
        })
        base.HYPERBLOOM_DMG.push({
          value: bloomDmg,
          name: 'Painted Dome',
          source: 'Self',
        })
        base.BURGEON_DMG.push({
          value: bloomDmg,
          name: 'Painted Dome',
          source: 'Self',
        })

        if (c >= 2) base.ATK_SPD.push({ value: 0.15, name: 'Constellation 2', source: `Self` })
      }
      if (a >= 1)
        base.SKILL_SCALING.push({
          name: `Dendro Core Healing`,
          value: [{ scaling: 3, multiplier: Stats.EM }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
      if (form.kaveh_a4) base[Stats.EM].push({ value: 25 * form.kaveh_a4, name: 'Ascension 4 Passive', source: `Self` })

      if (form.kaveh_c1) {
        base.DENDRO_RES.push({ value: 0.5, name: 'Constellation 1', source: `Self` })
        base[Stats.I_HEALING].push({ value: 0.25, name: 'Constellation 1', source: `Self` })
      }
      if (form.kaveh_c4) {
        base.BLOOM_DMG.push({ value: 0.6, name: 'Constellation 4', source: `Self` })
        base.HYPERBLOOM_DMG.push({ value: 0.6, name: 'Constellation 4', source: `Self` })
        base.BURGEON_DMG.push({ value: 0.6, name: 'Constellation 4', source: `Self` })
      }
      if (c >= 6) {
        const kavehC6 = {
          name: `Pairidaeza's Light`,
          value: [{ scaling: 0.618, multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.ADD,
        }
        base.BASIC_SCALING.push(kavehC6)
        base.CHARGE_SCALING.push(kavehC6)
        base.PLUNGE_SCALING.push(kavehC6)
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.kaveh_burst) {
        base.infuse(Element.DENDRO, true)
        const bloomDmg = calcScaling(0.2749, burst, 'elemental', '1')
        base.BLOOM_DMG.push({
          value: bloomDmg,
          name: 'Painted Dome',
          source: 'Kaveh',
        })
        base.HYPERBLOOM_DMG.push({
          value: bloomDmg,
          name: 'Painted Dome',
          source: 'Kaveh',
        })
        base.BURGEON_DMG.push({
          value: bloomDmg,
          name: 'Painted Dome',
          source: 'Kaveh',
        })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Kaveh
