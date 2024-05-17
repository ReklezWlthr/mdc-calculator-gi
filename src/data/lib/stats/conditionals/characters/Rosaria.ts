import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Rosaria = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Spear of the Church`,
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
      title: `Ravaging Confession`,
      content: `Rosaria swiftly shifts her position to appear behind her opponent, then stabs and slashes them with her polearm, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />This ability cannot be used to travel behind opponents of a larger build.
      `,
    },
    burst: {
      title: `Rites of Termination`,
      content: `Rosaria's unique take on this prayer ritual: First, she swings her weapon to slash surrounding opponents; then, she summons a frigid Ice Lance that strikes the ground. Both actions deal <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />While active, the Ice Lance periodically releases a blast of cold air, dealing <b class="text-genshin-cryo">Cryo DMG</b> to surrounding opponents.
      `,
    },
    a1: {
      title: `A1: Regina Probationum`,
      content: `When Rosaria strikes an opponent from behind using Ravaging Confession, Rosaria's CRIT Rate increases by <span class="text-yellow">12%</span> for <span class="text-yellow">5</span>s.`,
    },
    a4: {
      title: `A4: Shadow Samaritan`,
      content: `Casting Rites of Termination increases CRIT Rate of all nearby party members (except Rosaria herself) by <span class="text-yellow">15%</span> of Rosaria's CRIT Rate for <span class="text-yellow">10</span>s.
      <br />CRIT Rate Bonus gained this way cannot exceed <span class="text-yellow">15%</span>.`,
    },
    c1: {
      title: `C1: Unholy Revelation`,
      content: `When Rosaria deals a CRIT Hit, her ATK SPD increases by <span class="text-yellow">10%</span> and her Normal Attack DMG increases by <span class="text-yellow">10%</span> for <span class="text-yellow">4</span>s.`,
    },
    c2: {
      title: `C2: Land Without Promise`,
      content: `The duration of the Ice Lance created by Rites of Termination is increased by <span class="text-yellow">4</span>s.`,
    },
    c3: {
      title: `C3: The Wages of Sin`,
      content: `Increases the Level of Ravaging Confession by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Painful Grace`,
      content: `Ravaging Confession's CRIT Hits regenerate <span class="text-yellow">5</span> Energy for Rosaria.
      <br />Can only be triggered once each time Ravaging Confession is cast.`,
    },
    c5: {
      title: `C5: Last Rites`,
      content: `Increases the Level of Rites of Termination by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: Divine Retribution`,
      content: `Rites of Termination's attack decreases opponents' <b>Physical RES</b> by <span class="text-yellow">20%</span> for <span class="text-yellow">10</span>s.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'a1_crit',
      text: `A1 CRIT Rate Buff`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'c1_crit',
      text: `C1 CRIT Hit`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'c6_phys_shred',
      text: `C6 Physical RES Shred`,
      ...talents.c6,
      show: c >= 6,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'a4_crit',
      text: `A4 CRIT Rate Share`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    findContentById(content, 'c6_phys_shred'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5246, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.516, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.3182, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6966, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit [1]',
          value: [{ scaling: calcScaling(0.4162, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit [2]',
          value: [{ scaling: calcScaling(0.43, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.3674, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Stab DMG',
          value: [{ scaling: calcScaling(0.584, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Slash DMG',
          value: [{ scaling: calcScaling(1.36, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG [1]',
          value: [{ scaling: calcScaling(1.04, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Skill DMG [2]',
          value: [{ scaling: calcScaling(1.52, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Ice Lance DoT',
          value: [{ scaling: calcScaling(1.32, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.a1_crit) base[Stats.CRIT_RATE] += 0.12
      if (form.c1_crit) {
        base.ATK_SPD += 0.1
        base.BASIC_DMG += 0.1
      }
      if (form.c6_phys_shred) base.PHYSICAL_RES_PEN += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.a4_crit) base[Stats.CRIT_RATE] += _.min([own[Stats.CRIT_RATE] * 0.15, 0.15])
      if (form.c6_phys_shred) base.PHYSICAL_RES_PEN += 0.2

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Rosaria
