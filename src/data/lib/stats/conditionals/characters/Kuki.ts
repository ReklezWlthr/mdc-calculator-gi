import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kuki = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Shinobu's Shadowsword`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Sanctifying Ring`,
      content: `Creates a <b>Grass Ring of Sanctification</b> at the cost of part of her HP, dealing <b class="text-genshin-electro">Electro DMG</b> to nearby opponents.
      <br />
      <br /><b>Grass Ring of Sanctification</b>
      <br />Follows your current active character around. Deals <b class="text-genshin-electro">Electro DMG</b> to nearby opponents every <span class="text-desc">1.5</span>s and restores HP for the active character(s) within the ring's AoE based on Kuki Shinobu's Max HP.
      <br />
      <br />The HP consumption from using this skill can only bring her to <span class="text-desc">20%</span> HP.
      `,
      image: 'Skill_S_Shinobu_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Gyoei Narukami Kariyama Rite`,
      content: `Stabs an evil-excoriating blade into the ground, creating a field that cleanses the area of all that is foul, dealing continuous <b class="text-genshin-electro">Electro DMG</b> to opponents within its AoE based on Shinobu's Max HP.
      <br />If Shinobu's HP is less than or equal to <span class="text-desc">50%</span> when this skill is used, the field will last longer.`,
      image: 'Skill_E_Shinobu_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Breaking Free`,
      content: `When Shinobu's HP is not higher than <span class="text-desc">50%</span>, her Healing Bonus is increased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Shinobu_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Heart's Repose`,
      content: `<b>Sanctifying Ring</b>'s abilities will be boosted based on Shinobu's Elemental Mastery:
      <br />- Healing amount will be increased by <span class="text-desc">75%</span> of Elemental Mastery.
      <br />- DMG dealt is increased by <span class="text-desc">25%</span> of Elemental Mastery.`,
      image: 'UI_Talent_S_Shinobu_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Protracted Prayers`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on an Inazuma Expedition for 20 hours.`,
      image: 'UI_Talent_S_Shinobu_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `To Cloister Compassion`,
      content: `<b>Gyoei Narukami Kariyama Rite</b>'s AoE is increased by <span class="text-desc">50%</span>.`,
      image: 'UI_Talent_S_Shinobu_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `To Forsake Fortune`,
      content: `<b>Grass Ring of Sanctification</b>'s duration is increased by <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Shinobu_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `To Sequester Sorrow`,
      content: `Increases the Level of <b>Sanctifying Ring</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Shinobu_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `To Sever Sealing`,
      content: `When the Normal, Charged, or Plunging Attacks of the character affected by Shinobu's <b>Grass Ring of Sanctification</b> hit opponents, a <b class="text-genshin-electro">Thundergrass Mark</b> will land on the opponent's position and deal <b class="text-genshin-electro">AoE Electro DMG</b> based on <span class="text-desc">9.7%</span> of Shinobu's Max HP.
      <br />This effect can occur once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Shinobu_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `To Cease Courtesies`,
      content: `Increases the Level of <b>Gyoei Narukami Kariyama Rite</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Shinobu_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `To Ward Weakness`,
      content: `When Kuki Shinobu takes lethal DMG, this instance of DMG will not take her down. This effect will automatically trigger when her HP reaches <span class="text-desc">1</span> and will trigger once every <span class="text-desc">60</span>s.
      <br />When Shinobu's HP drops below <span class="text-desc">25%</span>, she will gain <span class="text-desc">150</span> Elemental Mastery for <span class="text-desc">15</span>s. This effect will trigger once every <span class="text-desc">60</span>s.`,
      image: 'UI_Talent_S_Shinobu_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'kuki_low',
      text: `Current HP < 50%`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'kuki_c6',
      text: `C6 EM Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
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
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4876, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4455, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5934, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.7611, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.5563, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.6677, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      const a4Dmg = a >= 4 ? [{ scaling: 0.25, multiplier: Stats.EM }] : []
      const a4Heal = a >= 4 ? [{ scaling: 0.75, multiplier: Stats.EM }] : []
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.7571, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Dmg],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Grass Ring of Sanctification Healing',
          value: [{ scaling: calcScaling(0.03, skill, 'elemental', '1'), multiplier: Stats.HP }, ...a4Heal],
          flat: calcScaling(288.89, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Grass Ring of Sanctification DMG',
          value: [{ scaling: calcScaling(0.2524, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Dmg],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Single Instance DMG',
          value: [{ scaling: calcScaling(0.036, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Total DMG',
          value: [{ scaling: calcScaling(0.036, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
          multiplier: 7,
        },
        {
          name: 'Low HP Total DMG',
          value: [{ scaling: calcScaling(0.036, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
          multiplier: 12,
        },
      ]

      if (form.kuki_low) base[Stats.HEAL].push({ value: 0.15, name: 'Ascension 1 Passive', source: `Self` })
      if (c >= 4)
        base.SKILL_SCALING.push({
          name: 'Thundergrass Mark DMG',
          value: [{ scaling: 0.097, multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
        })
      if (form.kuki_c6) base[Stats.EM].push({ value: 125, name: 'Constellation 6', source: `Self` })

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

export default Kuki
