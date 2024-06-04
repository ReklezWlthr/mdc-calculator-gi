import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Yae = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Spiritfox Sin-Eater`,
      content: `<b>Normal Attack</b>
      <br />Summons forth kitsune spirits, initiating a maximum of 3 attacks that deal <b class="text-genshin-electro">Electro DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-electro">Electro DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges towards the ground from mid-air, damaging all opponents in her path with thunderous might. Deals <b class="text-genshin-electro">AoE Electro DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      title: `Yakan Evocation: Sesshou Sakura`,
      content: `To Yae, such dull tasks as can be accomplished by driving spirits out need not be done personally.
      <br />Moves swiftly, leaving a Sesshou Sakura behind.
      <br />
      <br /><b>Sesshou Sakura</b>
      <br />Has the following properties:
      <br />- Periodically strikes one nearby opponent with lightning, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />- When there are other Sesshou Sakura nearby, their level will increase, boosting the DMG dealt by these lightning strikes.
      <br />
      <br />This skill has three charges.
      <br />A maximum of <span class="text-desc">3</span> Sesshou Sakura can exist simultaneously. The initial level of each Sesshou Sakura is <span class="text-desc">1</span>, and the initial highest level each sakura can reach is <span class="text-desc">3</span>. If a new Sesshou Sakura is created too close to an existing one, the existing one will be destroyed.
      `,
    },
    burst: {
      title: `Great Secret Art: Tenko Kenshin`,
      content: `Legends of "kitsunetsuki," or the manifestations of a kitsune's might, are common in Inazuma's folktales. One that particularly captures the imagination is that of the Sky Kitsune, said to cause lightning to fall down upon the foes of the Grand Narukami Shrine. Summons a lightning strike, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />When she uses this skill, Yae Miko will unseal nearby Sesshou Sakura, destroying their outer forms and transforming them into Tenko Thunderbolts that descend from the skies, dealing <b class="text-genshin-electro">Electro DMG</b>. Each Sesshou Sakura destroyed in this way will create one Tenko Thunderbolt.
      `,
    },
    a1: {
      title: `A1: The Shrine's Sacred Shade`,
      content: `When casting Great Secret Art: Tenko Kenshin, each Sesshou Sakura destroyed resets the cooldown for <span class="text-desc">1</span> charge of Yakan Evocation: Sesshou Sakura.`,
    },
    a4: {
      title: `A4: Enlightened Blessing`,
      content: `Every point of Elemental Mastery Yae Miko possesses will increase Sesshou Sakura DMG by <span class="text-desc">0.15%</span>.`,
      value: [
        {
          name: 'Current Bonus DMG',
          value: { stat: Stats.EM, scaling: (em) => toPercentage(em * 0.0015) },
        },
      ],
    },
    util: {
      title: `Meditations of a Yako`,
      content: `Has a <span class="text-desc">25%</span> chance to get <span class="text-desc">1</span> regional Character Talent Material (base material excluded) when crafting. The rarity is that of the base material.`,
    },
    c1: {
      title: `C1: Yakan Offering`,
      content: `Each time Great Secret Art: Tenko Kenshin activates a Tenko Thunderbolt, Yae Miko will restore <span class="text-desc">8</span> Elemental Energy for herself.`,
    },
    c2: {
      title: `C2: Fox's Mooncall`,
      content: `Sesshou Sakura start at Level 2 when created, their max level is increased to 4, and their attack range is increased by <span class="text-desc">60%</span>.`,
    },
    c3: {
      title: `C3: The Seven Glamours`,
      content: `Increases the Level of Yakan Evocation: Sesshou Sakura by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Sakura Channeling`,
      content: `When Sesshou Sakura lightning hits opponents, the <b class="text-genshin-electro">Electro DMG Bonus</b> of all nearby party members is increased by <span class="text-desc">20%</span> for <span class="text-desc">5</span>s.`,
    },
    c5: {
      title: `C5: Mischievous Teasing`,
      content: `Increases the Level of Great Secret Art: Tenko Kenshin by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Forbidden Art: Daisesshou`,
      content: `The Sesshou Sakura's attacks will ignore <span class="text-desc">60%</span> of the opponent's DEF.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'yae_c4',
      text: `C4 Electro DMG Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'yae_c4')]

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
          value: [{ scaling: calcScaling(0.3966, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3852, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5689, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.4289, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ELECTRO)

      base.SKILL_SCALING = [
        {
          name: 'Sesshou Sakura DMG: Level 1',
          value: [{ scaling: calcScaling(0.6067, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
          defPen: c >= 6 ? 0.6 : 0,
        },
        {
          name: 'Sesshou Sakura DMG: Level 2',
          value: [{ scaling: calcScaling(0.7584, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
          defPen: c >= 6 ? 0.6 : 0,
        },
        {
          name: 'Sesshou Sakura DMG: Level 3',
          value: [{ scaling: calcScaling(0.948, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
          defPen: c >= 6 ? 0.6 : 0,
        },
        {
          name: 'Sesshou Sakura DMG: Level 4',
          value: [{ scaling: calcScaling(1.185, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
          defPen: c >= 6 ? 0.6 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(2.6, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Tenko Thunderbolt DMG`,
          value: [{ scaling: calcScaling(3.3382, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.yae_c4) base[Stats.ELECTRO_DMG] += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.yae_c4) base[Stats.ELECTRO_DMG] += 0.2

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) base.SKILL_DMG += base[Stats.EM] * 0.0015

      return base
    },
  }
}

export default Yae
