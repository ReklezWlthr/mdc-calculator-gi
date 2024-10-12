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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Sweeping Fervor`,
      content: `Xinyan brandishes her instrument, dealing <b class="text-genshin-pyro">Pyro DMG</b> on nearby opponents, forming a shield made out of her audience's passion.
      <br />The shield's DMG Absorption scales based on Xinyan's DEF and on the number of opponents hit.
      <br />- Hitting <span class="text-desc">0 - 1</span> opponents grants <b>Shield Level</b> <span class="text-desc">1</span>: <b>Ad Lib</b>.
      <br />- Hitting <span class="text-desc">2</span> opponents grants <b>Shield Level</b> <span class="text-desc">2</span>: <b>Lead-In</b>.
      <br />- Hitting <span class="text-desc">3</span> or more opponents grants <b>Shield Level</b> <span class="text-desc">3</span>: <b>Rave</b>, which will also deal intermittent <b class="text-genshin-pyro">Pyro DMG</b> to nearby opponents.
      <br />
      <br />The shield has the following special properties:
      <br />- When unleashed, it infuses Xinyan with <b class="text-genshin-pyro">Pyro</b>.
      <br />- It has <span class="text-desc">250%</span> DMG Absorption effectiveness against <b class="text-genshin-pyro">Pyro DMG</b>.
      `,
      image: 'Skill_S_Xinyan_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Riff Revolution`,
      content: `Strumming rapidly, Xinyan launches nearby opponents and deals <b>Physical DMG</b> to them, hyping up the crowd.
      <br />The sheer intensity of the atmosphere will cause explosions that deal <b class="text-genshin-pyro">Pyro DMG</b> to nearby opponents.`,
      image: 'Skill_E_Xinyan_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `"The Show Goes On, Even Without An Audience..."`,
      content: `Decreases the number of opponents <b>Sweeping Fervor</b> must hit to trigger each level of shielding.
      <br />- <b>Shield Level</b> <span class="text-desc">2</span>: <b>Lead-In</b> requirement reduced to <span class="text-desc">1</span> opponent hit.
      <br />- <b>Shield Level</b> <span class="text-desc">3</span>: <b>Rave</b> requirement reduced to <span class="text-desc">2</span> opponents hit or more.`,
      image: 'UI_Talent_S_Xinyan_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `"...Now That's Rock 'N' Roll!"`,
      content: `Characters shielded by <b>Sweeping Fervor</b> deal <span class="text-desc">15%</span> increased <b>Physical DMG</b>.`,
      image: 'UI_Talent_S_Xinyan_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `A Rad Recipe`,
      content: `When a Perfect Cooking is achieved on a DEF-boosting dish, Xinyan has a <span class="text-desc">12%</span> chance to obtain double the product.`,
      image: 'UI_Talent_Cook_Defense',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Fatal Acceleration`,
      content: `Upon scoring a CRIT Hit, increases ATK SPD of Xinyan's Normal and Charged Attacks by <span class="text-desc">12%</span> for <span class="text-desc">5</span>s.
      <br />Can only occur once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Xinyan_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Impromptu Opening`,
      content: `<b>Riff Revolution</b>'s <b>Physical DMG</b> has its CRIT Rate increased by <span class="text-desc">100%</span>, and will form a shield at <b>Shield Level</b> <span class="text-desc">3</span>: <b>Rave</b> when cast.`,
      image: 'UI_Talent_S_Xinyan_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Double-Stop`,
      content: `Increases the Level of <b>Sweeping Fervor</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xinyan_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Wildfire Rhythm`,
      content: `<b>Sweeping Fervor</b>'s swing DMG decreases opponent's <b>Physical RES</b> by <span class="text-desc">15%</span> for <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Xinyan_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Screamin' for an Encore`,
      content: `Increases the Level of <b>Riff Revolution</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xinyan_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Rockin' in a Flaming World`,
      content: `Decreases the Stamina Consumption of Xinyan's Charged Attacks by <span class="text-desc">30%</span>. Additionally, Xinyan's Charged Attacks gain an ATK Bonus equal to <span class="text-desc">50%</span> of her DEF.`,
      image: 'UI_Talent_S_Xinyan_04',
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

  const teammateContent: IContent[] = [findContentById(content, 'xinyan_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'xinyan_a4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

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
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.9546, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
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

      if (form.xinyan_a4) base[Stats.PHYSICAL_DMG].push({ value: 0.15, name: 'Ascension 4 Passive', source: `Self` })
      if (form.xinyan_c1) {
        base.ATK_SPD.push({ value: 0.12, name: 'Constellation 1', source: `Self` })
        base.CHARGE_ATK_SPD.push({ value: 0.12, name: 'Constellation 1', source: `Self` })
      }
      if (form.xinyan_c4) base.PHYSICAL_RES_PEN.push({ value: 0.15, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (form.xinyan_c4) base.PHYSICAL_RES_PEN.push({ value: 0.15, name: 'Constellation 4', source: `Xinyan` })
      if (aForm.xinyan_a4) base[Stats.PHYSICAL_DMG].push({ value: 0.15, name: 'Ascension 4 Passive', source: `Xinyan` })

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
