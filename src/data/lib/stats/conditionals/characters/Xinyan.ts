import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xinyan = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Dance on Fire`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Drains Stamina over time to perform continuous spinning attacks against all nearby opponents.
      <br />At the end of the sequence, performs a more powerful slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Sweeping Fervor`,
      content: `Xinyan brandishes her instrument, dealing <b class="text-genshin-pyro">Pyro DMG</b> on nearby opponents, forming a shield made out of her audience's passion.
      <br />The shield's DMG Absorption scales based on Xinyan's DEF and on the number of opponents hit.
      <br />- Hitting <span class="text-desc">0 - 1</span> opponents grants Shield Level 1: <b>Ad Lib</b>.
      <br />- Hitting <span class="text-desc">2</span> opponents grants Shield Level 2: <b>Lead-In</b>.
      <br />- Hitting <span class="text-desc">3</span> or more opponents grants Shield Level 3: <b>Rave</b>, which will also deal intermittent <b class="text-genshin-pyro">Pyro DMG</b> to nearby opponents.
      <br />
      <br />The shield has the following special properties:
      <br />- When unleashed, it infuses Xinyan with <b class="text-genshin-pyro">Pyro</b>.
      <br />- It has <span class="text-desc">250%</span> DMG Absorption effectiveness against <b class="text-genshin-pyro">Pyro DMG</b>.
      `,
    },
    burst: {
      title: `Riff Revolution`,
      content: `Strumming rapidly, Xinyan launches nearby opponents and deals <b>Physical DMG</b> to them, hyping up the crowd.
      <br />The sheer intensity of the atmosphere will cause explosions that deal <b class="text-genshin-pyro">Pyro DMG</b> to nearby opponents.`,
    },
    a1: {
      title: `A1: "The Show Goes On, Even Without An Audience..."`,
      content: `Decreases the number of opponents Sweeping Fervor must hit to trigger each level of shielding.
      <br />- Shield Level 2: <b>Lead-In</b> requirement reduced to <span class="text-desc">1</span> opponent hit.
      <br />- Shield Level 3: <b>Rave</b> requirement reduced to <span class="text-desc">2</span> opponents hit or more.`,
    },
    a4: {
      title: `A4: "...Now That's Rock 'N' Roll!"`,
      content: `Characters shielded by Sweeping Fervor deal <span class="text-desc">15%</span> increased <b>Physical DMG</b>.`,
    },
    util: {
      title: `A Rad Recipe`,
      content: `When a Perfect Cooking is achieved on a DEF-boosting dish, Xinyan has a <span class="text-desc">12%</span> chance to obtain double the product.`,
    },
    c1: {
      title: `C1: Fatal Acceleration`,
      content: `Upon scoring a CRIT Hit, increases ATK SPD of Xinyan's Normal and Charged Attacks by <span class="text-desc">12%</span> for <span class="text-desc">5</span>s.
      <br />Can only occur once every <span class="text-desc">5</span>s.`,
    },
    c2: {
      title: `C2: Impromptu Opening`,
      content: `Riff Revolution's <b>Physical DMG</b> has its CRIT Rate increased by <span class="text-desc">100%</span>, and will form a shield at Shield Level 3: <b>Rave</b> when cast.`,
    },
    c3: {
      title: `C3: Double-Stop`,
      content: `Increases the Level of Sweeping Fervor by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Wildfire Rhythm`,
      content: `Sweeping Fervor's swing DMG decreases opponent's <b>Physical RES</b> by <span class="text-desc">15%</span> for <span class="text-desc">12</span>s.`,
    },
    c5: {
      title: `C5: Screamin' for an Encore`,
      content: `Increases the Level of Riff Revolution by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Rockin' in a Flaming World`,
      content: `Decreases the Stamina Consumption of Xinyan's Charged Attacks by <span class="text-desc">30%</span>. Additionally, Xinyan's Charged Attacks gain an ATK Bonus equal to <span class="text-desc">50%</span> of her DEF.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'xinyan_a4',
      text: `Shield Physical DMG Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xinyan_c1',
      text: `C1 On CRIT ATK SPD`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xinyan_c4',
      text: `C4 Physical RES Shred`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'xinyan_a4'), findContentById(content, 'xinyan_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.7654, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.7396, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.9546, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.11584, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.6255, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.1309, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      base.SKILL_SCALING = [
        {
          name: 'Swing DMG',
          value: [{ scaling: calcScaling(1.696, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield Level 1 DMG Absorption',
          value: [{ scaling: calcScaling(1.0404, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          flat: calcScaling(500.55, skill, 'elemental', '1'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Shield Level 2 DMG Absorption',
          value: [{ scaling: calcScaling(1.224, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          flat: calcScaling(588.88, skill, 'elemental', '1'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Shield Level 3 DMG Absorption',
          value: [{ scaling: calcScaling(1.44, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          flat: calcScaling(692.8, skill, 'elemental', '1'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'DoT',
          value: [{ scaling: calcScaling(0.336, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(3.408, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.BURST,
          cr: c >= 2 ? 1 : 0,
        },
        {
          name: `Pyro DoT`,
          value: [{ scaling: calcScaling(0.4, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
          cr: c >= 2 ? 1 : 0,
        },
      ]

      if (form.xinyan_a4) base[Stats.PHYSICAL_DMG] += 0.15
      if (form.xinyan_c1) {
        base.ATK_SPD += 0.12
        base.CHARGE_ATK_SPD += 0.12
      }
      if (form.xinyan_c4) base.PHYSICAL_RES_PEN += 0.15

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.xinyan_c4) base.PHYSICAL_RES_PEN += 0.15
      if (form.xinyan_a4) base[Stats.PHYSICAL_DMG] += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (c >= 6)
        base.CHARGE_SCALING = [
          {
            name: 'Charged Attack Cyclic DMG',
            value: [
              {
                scaling: calcScaling(0.6255, normal, 'physical', '1'),
                multiplier: Stats.ATK,
                override: base.getAtk() + (0.5 + base.getDef()),
              },
            ],
            element: Element.PHYSICAL,
            property: TalentProperty.CA,
          },
          {
            name: 'Charged Attack Final DMG',
            value: [
              {
                scaling: calcScaling(1.1309, normal, 'physical', '1'),
                multiplier: Stats.ATK,
                override: base.getAtk() + (0.5 + base.getDef()),
              },
            ],
            element: Element.PHYSICAL,
            property: TalentProperty.CA,
          },
        ]
      return base
    },
  }
}

export default Xinyan
