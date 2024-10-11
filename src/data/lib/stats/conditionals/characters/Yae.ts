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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Yakan Evocation: Sesshou Sakura`,
      content: `To Yae, such dull tasks as can be accomplished by driving spirits out need not be done personally.
      <br />Moves swiftly, leaving a <b class="text-genshin-electro">Sesshou Sakura</b> behind.
      <br />
      <br /><b class="text-genshin-electro">Sesshou Sakura</b>
      <br />Has the following properties:
      <br />- Periodically strikes one nearby opponent with lightning, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />- When there are other <b class="text-genshin-electro">Sesshou Sakura</b> nearby, their level will increase, boosting the DMG dealt by these lightning strikes.
      <br />
      <br />This skill has three charges.
      <br />A maximum of <span class="text-desc">3</span> <b class="text-genshin-electro">Sesshou Sakura</b> can exist simultaneously. The initial level of each <b class="text-genshin-electro">Sesshou Sakura</b> is <span class="text-desc">1</span>, and the initial highest level each <b class="text-genshin-electro">Sakura</b> can reach is <span class="text-desc">3</span>. If a new <b class="text-genshin-electro">Sesshou Sakura</b> is created too close to an existing one, the existing one will be destroyed.
      `,
      image: 'Skill_S_Yae_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Great Secret Art: Tenko Kenshin`,
      content: `Legends of "kitsunetsuki," or the manifestations of a kitsune's might, are common in Inazuma's folktales. One that particularly captures the imagination is that of the Sky Kitsune, said to cause lightning to fall down upon the foes of the Grand Narukami Shrine. Summons a lightning strike, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />When she uses this skill, Yae Miko will unseal nearby <b class="text-genshin-electro">Sesshou Sakura</b>, destroying their outer forms and transforming them into <b>Tenko Thunderbolts</b> that descend from the skies, dealing <b class="text-genshin-electro">Electro DMG</b>. Each <b class="text-genshin-electro">Sesshou Sakura</b> destroyed in this way will create one <b>Tenko Thunderbolt</b>.
      `,
      image: 'Skill_E_Yae_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `The Shrine's Sacred Shade`,
      content: `When casting <b>Great Secret Art: Tenko Kenshin</b>, each <b class="text-genshin-electro">Sesshou Sakura</b> destroyed resets the cooldown for <span class="text-desc">1</span> charge of <b>Yakan Evocation: Sesshou Sakura</b>.`,
      image: 'UI_Talent_S_Yae_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Enlightened Blessing`,
      content: `Every point of Elemental Mastery Yae Miko possesses will increase <b class="text-genshin-electro">Sesshou Sakura</b> DMG by <span class="text-desc">0.15%</span>.`,
      image: 'UI_Talent_S_Yae_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Meditations of a Yako`,
      content: `Has a <span class="text-desc">25%</span> chance to get <span class="text-desc">1</span> regional Character Talent Material (base material excluded) when crafting. The rarity is that of the base material.`,
      image: 'UI_Talent_S_Yae_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Yakan Offering`,
      content: `Each time <b>Great Secret Art: Tenko Kenshin</b> activates a <b>Tenko Thunderbolt</b>, Yae Miko will restore <span class="text-desc">8</span> Elemental Energy for herself.`,
      image: 'UI_Talent_S_Yae_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Fox's Mooncall`,
      content: `<b class="text-genshin-electro">Sesshou Sakura</b> start at Level <span class="text-desc">2</span> when created, their max level is increased to <span class="text-desc">4</span>, and their attack range is increased by <span class="text-desc">60%</span>.`,
      image: 'UI_Talent_S_Yae_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `The Seven Glamours`,
      content: `Increases the Level of <b>Yakan Evocation: Sesshou Sakura</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yae_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Sakura Channeling`,
      content: `When <b class="text-genshin-electro">Sesshou Sakura</b> lightning hits opponents, the <b class="text-genshin-electro">Electro DMG Bonus</b> of all nearby party members is increased by <span class="text-desc">20%</span> for <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Yae_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Mischievous Teasing`,
      content: `Increases the Level of <b>Great Secret Art: Tenko Kenshin</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yae_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Forbidden Art: Daisesshou`,
      content: `The <b class="text-genshin-electro">Sesshou Sakura</b>'s attacks will ignore <span class="text-desc">60%</span> of the opponent's DEF.`,
      image: 'UI_Talent_S_Yae_04',
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
    allyContent: [],
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

      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Sesshou Sakura DMG: Level 4',
          value: [{ scaling: calcScaling(1.185, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
          defPen: c >= 6 ? 0.6 : 0,
        })
      if (form.yae_c4) base[Stats.ELECTRO_DMG].push({ value: 0.2, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.yae_c4) base[Stats.ELECTRO_DMG].push({ value: 0.2, name: 'Constellation 4', source: `Yae Miko` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4)
        base.CALLBACK.push(function P99(x) {
          x.SKILL_DMG.push({
            value: x.getEM() * 0.0015,
            name: 'Ascension 4 Passive',
            source: 'Self',
            base: x.getEM(),
            multiplier: toPercentage(0.0015, 2),
          })

          return x
        })

      return base
    },
  }
}

export default Yae
