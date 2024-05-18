import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xiao = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Whirlwind Thrust`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      <br />Xiao does not take DMG from performing Plunging Attacks.
      `,
    },
    skill: {
      title: `Lemniscatic Wind Cycling`,
      content: `Xiao lunges forward, dealing <b class="text-genshin-anemo">Anemo DMG</b> to opponents in his path.
      <br />Can be used in mid-air.
      <br />Starts with 2 charges.
      `,
    },
    burst: {
      title: `Bane of All Evil`,
      content: `Xiao dons the Yaksha Mask that set gods and demons trembling millennia ago.
      <br />
      <br /><b>Yaksha's Mask</b>
      <br />- Greatly increases Xiao's jumping ability.
      <br />- Increases his attack AoE and attack DMG.
      <br />- Converts attack DMG into <b class="text-genshin-anemo">Anemo DMG</b>, which cannot be overridden by any other elemental infusion.
      <br />
      <br />In this state, Xiao will continuously lose HP.
      <br />The effects of this skill end when Xiao leaves the field.
      `,
    },
    a1: {
      title: `A1: Conqueror of Evil: Tamer of Demons`,
      content: `While under the effects of Bane of All Evil, all DMG dealt by Xiao increases by <span class="text-desc">5%</span>. DMG increases by a further <span class="text-desc">5%</span> for every <span class="text-desc">3</span>s the ability persists. The maximum DMG Bonus is <span class="text-desc">25%</span>.`,
    },
    a4: {
      title: `A4: Dissolution Eon: Heaven Fall`,
      content: `Using Lemniscatic Wind Cycling increases the DMG of subsequent uses of Lemniscatic Wind Cycling by <span class="text-desc">15%</span>. This effect lasts for <span class="text-desc">7</span>s, and has a maximum of <span class="text-desc">3</span> stacks. Gaining a new stack refreshes the effect's duration.`,
    },
    util: {
      title: `Transcension: Gravity Defier`,
      content: `Decreases climbing Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      title: `C1: Dissolution Eon: Destroyer of Worlds`,
      content: `Increases Lemniscatic Wind Cycling's charges by <span class="text-desc">1</span>.`,
    },
    c2: {
      title: `C2: Annihilation Eon: Blossom of Kaleidos`,
      content: `When in the party and not on the field, Xiao's Energy Recharge is increased by <span class="text-desc">25%</span>.`,
    },
    c3: {
      title: `C3: Conqueror of Evil: Wrath Deity`,
      content: `Increases the Level of Lemniscatic Wind Cycling by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Transcension: Extinction of Suffering`,
      content: `When Xiao's HP falls below <span class="text-desc">50%</span>, he gains a <span class="text-desc">100%</span> DEF Bonus.`,
    },
    c5: {
      title: `C5: Evolution Eon: Origin of Ignorance`,
      content: `Increases the Level of Bane of All Evil by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Conqueror of Evil: Guardian Yaksha`,
      content: `While under the effects of Bane of All Evil, hitting at least <span class="text-desc">2</span> opponents with Xiao's Plunging Attack will immediately grant him <span class="text-desc">1</span> charge of Lemniscatic Wind Cycling, and for the next <span class="text-desc">1</span>s, he may use Lemniscatic Wind Cycling while ignoring its CD.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'xiao_burst',
      text: `Yaksha's Mask`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'xiao_a1',
      text: `A1 Bonus DMG`,
      ...talents.a1,
      show: a >= 1,
      default: 5,
      min: 0,
      max: 5,
    },
    {
      type: 'number',
      id: 'xiao_a4',
      text: `A4 Skill DMG Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: 3,
      min: 0,
      max: 3,
    },
    {
      type: 'toggle',
      id: 'xiao_c2',
      text: `C2 Off-Field ER`,
      ...talents.c2,
      show: c >= 2,
      default: false,
    },
    {
      type: 'toggle',
      id: 'xiao_c4',
      text: `Current HP < 50%`,
      ...talents.c4,
      show: c >= 4,
      default: false,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit [x2]',
          value: [{ scaling: calcScaling(0.2754, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.5694, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.6855, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.3766, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.7154, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '6-Hit',
          value: [{ scaling: calcScaling(0.9583, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.2169, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('high', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.528, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]

      if (form.xiao_burst) {
        base.infuse(Element.ANEMO, true)
        base.BASIC_DMG += calcScaling(0.5845, burst, 'elemental', '2')
        base.CHARGE_DMG += calcScaling(0.5845, burst, 'elemental', '2')
        base.PLUNGE_DMG += calcScaling(0.5845, burst, 'elemental', '2')
      }
      if (form.xiao_a1) base[Stats.ALL_DMG] += 0.05 * form.xiao_a1
      if (form.xiao_a4) base.SKILL_DMG += 0.15 * form.xiao_a4
      if (form.xiao_c2) base[Stats.ER] += 0.25
      if (form.xiao_c4) base[Stats.P_DEF] += 1

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

export default Xiao
