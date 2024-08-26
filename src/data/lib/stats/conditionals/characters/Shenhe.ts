import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Shenhe = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Dawnstar Piercer`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Spring Spirit Summoning`,
      content: `The frosted dew, silvery and dense, shall exorcise all demons.
      <br />Grants all nearby party members the Icy Quill effect and deals <b class="text-genshin-cryo">Cryo DMG</b> in different ways based on whether it is pressed or held.
      <br />
      <br /><b>Press</b>
      <br />Rushes forward together with a Talisman Spirit, dealing <b class="text-genshin-cryo">Cryo DMG</b> to opponents along the path.
      <br />
      <br /><b>Hold</b>
      <br />Commands the Talisman Spirit to deal <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b>Icy Quill</b>
      <br />When Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts deal <b class="text-genshin-cryo">Cryo DMG</b> to opponents, the DMG dealt is increased based on Shenhe's current ATK.
      <br />
      <br />The Icy Quill's effects will be cleared once its duration ends or after being triggered a certain number of times.
      <br />When held rather than pressed, the Icy Quill's effect lasts longer and can be triggered more times.
      <br />When one <b class="text-genshin-cryo">Cryo DMG</b> instance strikes multiple opponents, the effect is triggered multiple times based on the number of opponents hit. The number of times the effect is triggered is calculated independently for each party member with the Icy Quill.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Divine Maiden's Deliverance`,
      content: `Unleashes the power of the Talisman Spirit, allowing it to roam free in this plane, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />The Talisman Spirit then creates a field that decreases the <b class="text-genshin-cryo">Cryo RES</b> and <b>Physical RES</b> of opponents within it. It also deals periodic <b class="text-genshin-cryo">Cryo DMG</b> to opponents within the field.
      `,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Deific Embrace`,
      content: `An active character within the field created by Divine Maiden's Deliverance gains <span class="text-desc">15%</span> <b class="text-genshin-cryo">Cryo DMG Bonus</b>.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Spirit Communion Seal`,
      content: `After Shenhe uses Spring Spirit Summoning, she will grant all nearby party members the following effects:
      <br />- Press: Elemental Skill and Elemental Burst DMG increased by <span class="text-desc">15%</span> for <span class="text-desc">10</span>s.
      <br />- Hold: Normal, Charged, and Plunging Attack DMG increased by <span class="text-desc">15%</span> for <span class="text-desc">15</span>s.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Precise Comings and Goings`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on an Liyue Expedition for 20 hours.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Clarity of Heart`,
      content: `Spring Spirit Summoning can be used <span class="text-desc">1</span> more time.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Centered Spirit`,
      content: `Divine Maiden's Deliverance lasts for <span class="text-desc">6</span> seconds longer.
      <br />Active characters within the skill's field deal <span class="text-desc">15%</span> increased <b class="text-genshin-cryo">Cryo</b> CRIT DMG.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Seclusion`,
      content: `Increases the Level of Spring Spirit Summoning by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Insight`,
      content: `When characters under the effect of Icy Quill applied by Shenhe triggers its DMG Bonus effects, Shenhe will gain a Skyfrost Mantra stack:
      <br />- When Shenhe uses Spring Spirit Summoning, she will consume all stacks of Skyfrost Mantra, increasing the DMG of that Spring Spirit Summoning by <span class="text-desc">5%</span> for each stack consumed.
      <br />- Max <span class="text-desc">50</span> stacks. Stacks last for <span class="text-desc">60</span>s.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Divine Attainment`,
      content: `Increases the Level of Divine Maiden's Deliverance by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Mystical Abandon`,
      content: `When characters trigger Icy Quill's effects using Normal and Charged Attack DMG, it does not count toward the Trigger Quota.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'icy_quill',
      text: `Icy Quill`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'shenhe_a1',
      text: `A1 Cryo DMG Bonus`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'shenhe_a4_press',
      text: `A4 Press Skill Buff`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'shenhe_a4_hold',
      text: `A4 Hold Skill Buff`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'shenhe_c2',
      text: `C2 Cryo CRIT DMG`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'number',
      id: 'shenhe_c4',
      text: `Skyfrost Mantra Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 0,
      min: 0,
      max: 50,
    },
    {
      type: 'toggle',
      id: 'shenhe_shred',
      text: `Burst RES Shred`,
      ...talents.burst,
      show: true,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'icy_quill'),
    findContentById(content, 'shenhe_a1'),
    findContentById(content, 'shenhe_a4_press'),
    findContentById(content, 'shenhe_a4_hold'),
    findContentById(content, 'shenhe_shred'),
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
          value: [{ scaling: calcScaling(0.4326, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4025, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5332, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.2632, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.6562, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.1067, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Press Skill DMG',
          value: [{ scaling: calcScaling(1.392, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold Skill DMG',
          value: [{ scaling: calcScaling(1.888, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.008, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: form.shenhe_c4 ? 0.05 * form.shenhe_c4 : 0,
        },
        {
          name: 'DoT',
          value: [{ scaling: calcScaling(0.3312, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: form.shenhe_c4 ? 0.05 * form.shenhe_c4 : 0,
        },
      ]

      if (form.shenhe_shred) {
        base.PHYSICAL_RES_PEN += 5 + _.min([burst, 10])
        base.CRYO_RES_PEN += 5 + _.min([burst, 10])
      }
      if (form.shenhe_a1) base[Stats.CRYO_DMG] += 0.15
      if (form.shenhe_a4_press) {
        base.SKILL_DMG += 0.15
        base.BURST_DMG += 0.15
      }
      if (form.shenhe_a4_hold) {
        base.BASIC_DMG += 0.15
        base.CHARGE_DMG += 0.15
        base.PLUNGE_DMG += 0.15
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.icy_quill)
        if (form.icy_quill) base.CRYO_F_DMG += calcScaling(0.4566, skill, 'elemental', '1') * own.getAtk()
      if (form.shenhe_a1) base[Stats.CRYO_DMG] += 0.15
      if (form.shenhe_c2) base.CRYO_CD += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.icy_quill) base.CRYO_F_DMG += calcScaling(0.4566, skill, 'elemental', '1') * base.getAtk()
      if (form.shenhe_a1) base[Stats.CRYO_DMG] += 0.15
      if (form.shenhe_c2) base.CRYO_CD += 0.15

      if (form.shenhe_shred) {
        base.PHYSICAL_RES_PEN += 5 + _.min([burst, 10])
        base.CRYO_RES_PEN += 5 + _.min([burst, 10])
      }
      if (form.shenhe_a1) base[Stats.CRYO_DMG] += 0.15
      if (form.shenhe_a4_press) {
        base.SKILL_DMG += 0.15
        base.BURST_DMG += 0.15
      }
      if (form.shenhe_a4_hold) {
        base.BASIC_DMG += 0.15
        base.CHARGE_DMG += 0.15
        base.PLUNGE_DMG += 0.15
      }

      return base
    },
  }
}

export default Shenhe
