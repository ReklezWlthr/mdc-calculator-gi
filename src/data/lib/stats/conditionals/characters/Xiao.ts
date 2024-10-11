import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Lemniscatic Wind Cycling`,
      content: `Xiao lunges forward, dealing <b class="text-genshin-anemo">Anemo DMG</b> to opponents in his path.
      <br />Can be used in mid-air.
      <br />Starts with <span class="text-desc">2</span> charges.
      `,
      image: 'Skill_S_Xiao_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Bane of All Evil`,
      content: `Xiao dons the <b class="text-genshin-anemo">Yaksha Mask</b> that set gods and demons trembling millennia ago.
      <br />
      <br /><b class="text-genshin-anemo">Yaksha's Mask</b>
      <br />- Greatly increases Xiao's jumping ability.
      <br />- Increases his attack AoE and attack DMG.
      <br />- Converts attack DMG into <b class="text-genshin-anemo">Anemo DMG</b>, which cannot be overridden by any other elemental infusion.
      <br />
      <br />In this state, Xiao will continuously lose HP.
      <br />The effects of this skill end when Xiao leaves the field.
      `,
      image: 'Skill_E_Xiao_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Conqueror of Evil: Tamer of Demons`,
      content: `While under the effects of <b>Bane of All Evil</b>, all DMG dealt by Xiao increases by <span class="text-desc">5%</span>. DMG increases by a further <span class="text-desc">5%</span> for every <span class="text-desc">3</span>s the ability persists. The maximum DMG Bonus is <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_S_Xiao_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Dissolution Eon: Heaven Fall`,
      content: `Using <b>Lemniscatic Wind Cycling</b> increases the DMG of subsequent uses of <b>Lemniscatic Wind Cycling</b> by <span class="text-desc">15%</span>. This effect lasts for <span class="text-desc">7</span>s, and has a maximum of <span class="text-desc">3</span> stacks. Gaining a new stack refreshes the effect's duration.`,
      image: 'UI_Talent_S_Xiao_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Transcension: Gravity Defier`,
      content: `Decreases climbing Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Climb',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Dissolution Eon: Destroyer of Worlds`,
      content: `Increases <b>Lemniscatic Wind Cycling</b>'s charges by <span class="text-desc">1</span>.`,
      image: 'UI_Talent_S_Xiao_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Annihilation Eon: Blossom of Kaleidos`,
      content: `When in the party and not on the field, Xiao's Energy Recharge is increased by <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_S_Xiao_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Conqueror of Evil: Wrath Deity`,
      content: `Increases the Level of <b>Lemniscatic Wind Cycling</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xiao_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Transcension: Extinction of Suffering`,
      content: `When Xiao's HP falls below <span class="text-desc">50%</span>, he gains a <span class="text-desc">100%</span> DEF Bonus.`,
      image: 'UI_Talent_S_Xiao_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Evolution Eon: Origin of Ignorance`,
      content: `Increases the Level of <b>Bane of All Evil</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xiao_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Conqueror of Evil: Guardian Yaksha`,
      content: `While under the effects of <b>Bane of All Evil</b>, hitting at least <span class="text-desc">2</span> opponents with Xiao's Plunging Attack will immediately grant him <span class="text-desc">1</span> charge of <b>Lemniscatic Wind Cycling</b>, and for the next <span class="text-desc">1</span>s, he may use <b>Lemniscatic Wind Cycling</b> while ignoring its CD.`,
      image: 'UI_Talent_S_Xiao_04',
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
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.2754, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
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
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.3766, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
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
        base.BASIC_DMG.push({
          value: calcScaling(0.5845, burst, 'elemental', '2'),
          name: 'Elemental Burst',
          source: 'Self',
        })
        base.CHARGE_DMG.push({
          value: calcScaling(0.5845, burst, 'elemental', '2'),
          name: 'Elemental Burst',
          source: 'Self',
        })
        base.PLUNGE_DMG.push({
          value: calcScaling(0.5845, burst, 'elemental', '2'),
          name: 'Elemental Burst',
          source: 'Self',
        })
      }
      if (form.xiao_a1)
        base[Stats.ALL_DMG].push({ value: 0.05 * form.xiao_a1, name: 'Ascension 1 Passive', source: `Self` })
      if (form.xiao_a4) base.SKILL_DMG.push({ value: 0.15 * form.xiao_a4, name: 'Ascension 4 Passive', source: `Self` })
      if (form.xiao_c2) base[Stats.ER].push({ value: 0.25, name: 'Constellation 2', source: `Self` })
      if (form.xiao_c4) base[Stats.P_DEF].push({ value: 1, name: 'Constellation 4', source: `Self` })

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
