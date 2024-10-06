import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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
      trace: `Normal Attack`,
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
      image: 'Skill_A_02',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Wind Realm of Nasamjnin`,
      content: `Faruzan deploys a polyhedron that deals <b class="text-genshin-anemo">AoE Anemo DMG</b> to nearby opponents. She will also enter the <b class="text-genshin-anemo">Manifest Gale</b> state.
      <br />While in the <b class="text-genshin-anemo">Manifest Gale</b> state, Faruzan's next fully charged shot will consume this state and will become a <b>Hurricane Arrow</b> that contains high-pressure currents. This arrow deals <b class="text-genshin-anemo">Anemo DMG</b> based on the DMG of a fully charged Aimed Shot from <b>Normal Attack: Parthian Shot</b>.
      <br />
      <br /><b class="text-genshin-anemo">Pressurized Collapse</b>
      <br />The <b>Hurricane Arrow</b> will apply a <b class="text-genshin-anemo">Pressurized Collapse</b> effect to the opponent or character hit. This effect will be removed after a short delay, creating a vortex that deals <b class="text-genshin-anemo">AoE Anemo DMG</b> and pulls nearby objects and opponents in. If the <b>Hurricane Arrow</b> does not hit any opponent or character, it will create a <b class="text-genshin-anemo">Pressurized Collapse</b> effect at its point of impact.
      <br />The vortex DMG is considered Elemental Skill DMG.`,
      image: 'Skill_S_Faruzan_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `The Wind's Secret Ways`,
      content: `Faruzan deploys a Dazzling Polyhedron that unleashes a <b class="text-genshin-anemo">Whirlwind Pulse</b> and deals <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />While the Dazzling Polyhedron persists, it will continuously move along a triangular path. Once it reaches each corner of that triangular path, it will unleash <span class="text-desc">1</span> more <b class="text-genshin-anemo">Whirlwind Pulse</b>.
      <br />
      <br /><b class="text-genshin-anemo">Whirlwind Pulse</b>
      <br />- When the <b class="text-genshin-anemo">Whirlwind Pulse</b> is unleashed, it will apply <b class="text-genshin-anemo">Perfidious Wind's Bale</b> to nearby opponents, decreasing their <b class="text-genshin-anemo">Anemo RES</b>.
      <br />- The <b class="text-genshin-anemo">Whirlwind Pulse</b> will also apply <b class="text-genshin-anemo">Prayerful Wind's Benefit</b> to all nearby party members when it is unleashed, granting them an <b class="text-genshin-anemo">Anemo DMG Bonus</b>.
      `,
      image: 'Skill_E_Faruzan_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Impetuous Flow`,
      content: `When Faruzan is in the <b class="text-genshin-anemo">Manifest Gale</b> state created by <b>Wind Realm of Nasamjnin</b>, the amount of time taken to charge a shot is decreased by <span class="text-desc">60%</span>, and she can apply The <b>Wind's Secret Ways</b>' <b class="text-genshin-anemo">Perfidious Wind's Bale</b> to opponents who are hit by the vortex created by <b class="text-genshin-anemo">Pressurized Collapse</b>.`,
      image: 'UI_Talent_S_Faruzan_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Lost Wisdom of the Seven Caverns`,
      content: `When characters affected by The <b>Wind's Secret Ways</b>' <b class="text-genshin-anemo">Prayerful Wind's Benefit</b> deal <b class="text-genshin-anemo">Anemo DMG</b> using Normal, Charged, Plunging Attacks, Elemental Skills, or Elemental Bursts to opponents, they will gain the <b class="text-genshin-anemo">Hurricane Guard</b> effect: This DMG will be increased based on <span class="text-desc">32%</span> of Faruzan's Base ATK. <span class="text-desc">1</span> instance of <b class="text-genshin-anemo">Hurricane Guard</b> can occur once every <span class="text-desc">0.8</span>s. This DMG Bonus will be cleared after <b class="text-genshin-anemo">Prayerful Wind's Benefit</b> expires or after the effect is triggered once.`,
      image: 'UI_Talent_S_Faruzan_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Tomes Light the Path`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on an Sumeru Expedition for <span class="text-desc">20</span> hours.`,
      image: 'UI_Talent_S_Cyno_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Truth by Any Means`,
      content: `Faruzan can fire off a maximum of <span class="text-desc">2</span> <b>Hurricane Arrows</b> using fully charged Aimed Shots while under the effect of a single <b class="text-genshin-anemo">Manifest Gale</b> created by <b>Wind Realm of Nasamjnin</b>.`,
      image: 'UI_Talent_S_Faruzan_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Overzealous Intellect`,
      content: `The duration of the Dazzling Polyhedron created by <b>The Wind's Secret Ways</b> is increased by <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Faruzan_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Spirit-Orchard Stroll`,
      content: `Increases the Level of <b>Wind Realm of Nasamjnin</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Faruzan_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Divine Comprehension`,
      content: `The vortex created by <b class="text-genshin-anemo">Pressurized Collapses</b> will restore Energy to Faruzan based on the number of opponents hit: If it hits <span class="text-desc">1</span> opponent, it will restore <span class="text-desc">2</span> Energy for Faruzan. Each additional opponent hit will restore <span class="text-desc">0.5</span> more Energy for Faruzan.
      <br />A maximum of <span class="text-desc">4</span> Energy can be restored to her per vortex.`,
      image: 'UI_Talent_S_Faruzan_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Wonderland of Rumination`,
      content: `Increases the Level of <b>The Wind's Secret Ways</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Faruzan_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `The Wondrous Path of Truth`,
      content: `Characters affected by <b>The Wind's Secret Ways</b>' <b class="text-genshin-anemo">Prayerful Wind's Benefit</b> have <span class="text-desc">40%</span> increased CRIT DMG when they deal <b class="text-genshin-anemo">Anemo DMG</b>. When the active character deals DMG while affected by <b class="text-genshin-anemo">Prayerful Wind's Benefit</b>, they will apply <b class="text-genshin-anemo">Pressurized Collapse</b> to the opponent damaged. This effect can be triggered once every <span class="text-desc">3</span>s. This CD is shared between all party members.`,
      image: 'UI_Talent_S_Faruzan_04',
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
      default: false,
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

  const teammateContent: IContent[] = [
    findContentById(content, 'faruzan_burst'),
    findContentById(content, 'faruzan_burst_shred'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'hurricane_guard')],
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
          value: [{ scaling: calcScaling(1.08, skill, 'elemental', '1'), multiplier: Stats.ATK }],
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

      if (form.faruzan_burst)
        base[Stats.ANEMO_DMG].push({
          value: calcScaling(0.18, burst, 'elemental', '1'),
          name: `Prayerful Wind's Benefit`,
          source: 'Self',
        })
      if (form.faruzan_burst_shred)
        base.ANEMO_RES_PEN.push({ value: 0.3, name: `Perfidious Wind's Bale`, source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      const hurricane = own.BASE_ATK * 0.32

      if (form.faruzan_burst)
        base[Stats.ANEMO_DMG].push({
          value: calcScaling(0.18, burst, 'elemental', '1'),
          name: `Prayerful Wind's Benefit`,
          source: 'Faruzan',
        })
      if (form.faruzan_burst_shred)
        base.ANEMO_RES_PEN.push({ value: 0.3, name: `Perfidious Wind's Bale`, source: `Faruzan` })
      if (aForm.hurricane_guard)
        base.ANEMO_F_DMG.push({
          value: hurricane,
          name: 'Hurricane Guard',
          source: 'Faruzan',
          base: own.BASE_ATK,
          multiplier: toPercentage(0.32),
        })

      if (form.faruzan_burst && c >= 6)
        base.ANEMO_CD.push({ value: 0.4, name: `Prayerful Wind's Benefit`, source: `Faruzan` })
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const hurricane = base.BASE_ATK * 0.32

      if (form.hurricane_guard)
        if (form.hurricane_guard)
          base.ANEMO_F_DMG.push({
            value: hurricane,
            name: 'Hurricane Guard',
            source: 'Self',
            base: base.BASE_ATK,
            multiplier: toPercentage(0.32),
          })
      if (form.faruzan_burst && c >= 6)
        base.ANEMO_CD.push({ value: 0.4, name: `Prayerful Wind's Benefit`, source: `Self` })

      return base
    },
  }
}

export default Faruzan
