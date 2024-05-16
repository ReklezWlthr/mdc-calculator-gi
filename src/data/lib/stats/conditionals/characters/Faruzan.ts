import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Faruzan = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Parthian Shot`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, mighty winds will accumulate on the arrowhead. A fully charged wind arrow will deal <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Wind Realm of Nasamjnin`,
      content: `Faruzan deploys a polyhedron that deals <b class="text-genshin-anemo">AoE Anemo DMG</b> to nearby opponents. She will also enter the Manifest Gale state.
      <br />While in the Manifest Gale state, Faruzan's next fully charged shot will consume this state and will become a Hurricane Arrow that contains high-pressure currents. This arrow deals <b class="text-genshin-anemo">Anemo DMG</b> based on the DMG of a fully charged Aimed Shot from "Normal Attack: Parthian Shot."
      <br />
      <br /><b>Pressurized Collapse</b>
      <br />The Hurricane Arrow will apply a Pressurized Collapse effect to the opponent or character hit. This effect will be removed after a short delay, creating a vortex that deals <b class="text-genshin-anemo">AoE Anemo DMG</b> and pulls nearby objects and opponents in. If the Hurricane Arrow does not hit any opponent or character, it will create a Pressurized Collapse effect at its point of impact.
      <br />The vortex DMG is considered Elemental Skill DMG.`,
    },
    burst: {
      title: `The Wind's Secret Ways`,
      content: `Faruzan deploys a Dazzling Polyhedron that unleashes a Whirlwind Pulse and deals <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />While the Dazzling Polyhedron persists, it will continuously move along a triangular path. Once it reaches each corner of that triangular path, it will unleash 1 more Whirlwind Pulse.
      <br />
      <br /><b>Whirlwind Pulse</b>
      <br />- When the Whirlwind Pulse is unleashed, it will apply Perfidious Wind's Bale to nearby opponents, decreasing their <b class="text-genshin-anemo">Anemo RES</b>.
      <br />- The Whirlwind Pulse will also apply Prayerful Wind's Benefit to all nearby party members when it is unleashed, granting them an <b class="text-genshin-anemo">Anemo DMG Bonus</b>.
      `,
    },
    a1: {
      title: `A1: Impetuous Flow`,
      content: `When Faruzan is in the Manifest Gale state created by Wind Realm of Nasamjnin, the amount of time taken to charge a shot is decreased by <span class="text-yellow">60%</span>, and she can apply The Wind's Secret Ways' Perfidious Wind's Bale to opponents who are hit by the vortex created by Pressurized Collapse.`,
    },
    a4: {
      title: `A4: Lost Wisdom of the Seven Caverns`,
      content: `When characters affected by The Wind's Secret Ways' Prayerful Wind's Gift deal <b class="text-genshin-anemo">Anemo DMG</b> using Normal, Charged, Plunging Attacks, Elemental Skills, or Elemental Bursts to opponents, they will gain the Hurricane Guard effect: This DMG will be increased based on <span class="text-yellow">32%</span> of Faruzan's Base ATK. <span class="text-yellow">1</span> instance of Hurricane Guard can occur once every <span class="text-yellow">0.8</span>s. This DMG Bonus will be cleared after Prayerful Wind's Benefit expires or after the effect is triggered once.`,
    },
    c1: {
      title: `C1: Truth by Any Means`,
      content: `Faruzan can fire off a maximum of 2 Hurricane Arrows using fully charged Aimed Shots while under the effect of a single Manifest Gale created by Wind Realm of Nasamjnin.`,
    },
    c2: {
      title: `C2: Overzealous Intellect`,
      content: `The duration of the Dazzling Polyhedron created by The Wind's Secret Ways is increased by <span class="text-yellow">6</span>s.`,
    },
    c3: {
      title: `C3: Spirit-Orchard Stroll`,
      content: `Increases the Level of Wind Realm of Nasamjnin by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Divine Comprehension`,
      content: `The vortex created by Pressurized Collapses will restore Energy to Faruzan based on the number of opponents hit: If it hits 1 opponent, it will restore <span class="text-yellow">2</span> Energy for Faruzan. Each additional opponent hit will restore <span class="text-yellow">0.5</span> more Energy for Faruzan.
      <br />A maximum of <span class="text-yellow">4</span> Energy can be restored to her per vortex.`,
    },
    c5: {
      title: `C5: Wonderland of Rumination`,
      content: `Increases the Level of The Wind's Secret Ways by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: The Wondrous Path of Truth`,
      content: `Characters affected by The Wind's Secret Ways' Prayerful Wind's Benefit have <span class="text-yellow">40%</span> increased CRIT DMG when they deal <b class="text-genshin-anemo">Anemo DMG</b>. When the active character deals DMG while affected by Prayerful Wind's Benefit, they will apply Pressurized Collapse to the opponent damaged. This effect can be triggered once every <span class="text-yellow">3</span>s. This CD is shared between all party members.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'faruzan_burst',
      text: `Prayerful Wind's Benefit`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'hurricane_guard',
      text: `Hurricane Guard`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'faruzan_burst_shred',
      text: `Perfidious Wind's Bale`,
      ...talents.burst,
      show: true,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = content

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
          value: [{ scaling: calcScaling(0.4473, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4219, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5316, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.7062, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
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
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
          cd: c >= 6 && form.faruzan_burst ? 0.4 : 0,
        },
        {
          name: 'Pressurized Collapse Vortex DMG',
          value: [{ scaling: calcScaling(1.08, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
          cd: c >= 6 && form.faruzan_burst ? 0.4 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.488, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
          cd: c >= 6 && form.faruzan_burst ? 0.4 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(3.776, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
          cd: c >= 6 && form.faruzan_burst ? 0.4 : 0,
        },
      ]

      if (form.faruzan_burst) base[Stats.ANEMO_DMG] += calcScaling(0.18, burst, 'elemental', '1')
      if (form.faruzan_burst_shred) base.ANEMO_RES_PEN += 0.3

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      const hurricane = base.getAtk() * 0.32

      if (form.hurricane_guard) {
        _.forEach(base.BASIC_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.CHARGE_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.PLUNGE_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.SKILL_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.BURST_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
      }

      if (form.faruzan_burst && c >= 6) {
        _.forEach(base.BASIC_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, cd: item.cd + 0.4 } : item
        )
        _.forEach(base.CHARGE_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, cd: item.cd + 0.4 } : item
        )
        _.forEach(base.PLUNGE_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, cd: item.cd + 0.4 } : item
        )
        _.forEach(base.SKILL_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, cd: item.cd + 0.4 } : item
        )
        _.forEach(base.BURST_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, cd: item.cd + 0.4 } : item
        )
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const hurricane = base.getAtk() * 0.32

      if (form.hurricane_guard) {
        _.forEach(base.BASIC_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.CHARGE_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.PLUNGE_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.SKILL_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
        _.forEach(base.BURST_SCALING, (item) =>
          item.element === Element.ANEMO ? { ...item, flat: item.flat + hurricane } : item
        )
      }

      return base
    },
  }
}

export default Faruzan
