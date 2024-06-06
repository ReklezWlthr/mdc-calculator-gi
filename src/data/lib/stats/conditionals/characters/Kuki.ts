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
    },
    skill: {
      title: `Sanctifying Ring`,
      content: `Creates a Grass Ring of Sanctification at the cost of part of her HP, dealing <b class="text-genshin-electro">Electro DMG</b> to nearby opponents.
      <br />
      <br /><b>Grass Ring of Sanctification</b>
      <br />Follows your current active character around. Deals <b class="text-genshin-electro">Electro DMG</b> to nearby opponents every <span class="text-desc">1.5</span>s and restores HP for the active character(s) within the ring's AoE based on Kuki Shinobu's Max HP.
      <br />
      <br />The HP consumption from using this skill can only bring her to <span class="text-desc">20%</span> HP.
      `,
    },
    burst: {
      title: `Gyoei Narukami Kariyama Rite`,
      content: `Stabs an evil-excoriating blade into the ground, creating a field that cleanses the area of all that is foul, dealing continuous <b class="text-genshin-electro">Electro DMG</b> to opponents within its AoE based on Shinobu's Max HP.
      <br />If Shinobu's HP is less than or equal to <span class="text-desc">50%</span> when this skill is used, the field will last longer.`,
    },
    a1: {
      title: `A1: Breaking Free`,
      content: `When Shinobu's HP is not higher than <span class="text-desc">50%</span>, her Healing Bonus is increased by <span class="text-desc">15%</span>.`,
    },
    a4: {
      title: `A4: Heart's Repose`,
      content: `Sanctifying Ring's abilities will be boosted based on Shinobu's Elemental Mastery:
      <br />- Healing amount will be increased by <span class="text-desc">75%</span> of Elemental Mastery.
      <br />- DMG dealt is increased by <span class="text-desc">25%</span> of Elemental Mastery.`,
      value: [
        {
          name: 'Bonus Healing',
          value: { stat: Stats.EM, scaling: (em) => _.round(em * 0.75).toLocaleString() },
        },
        {
          name: 'DMG Bonus',
          value: { stat: Stats.EM, scaling: (em) => _.round(em * 0.25).toLocaleString() },
        },
      ],
    },
    util: {
      title: `Protracted Prayers`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on an Inazuma Expedition for 20 hours.`,
    },
    c1: {
      title: `C1: To Cloister Compassion`,
      content: `Gyoei Narukami Kariyama Rite's AoE is increased by <span class="text-desc">50%</span>.`,
    },
    c2: {
      title: `C2: To Forsake Fortune`,
      content: `Grass Ring of Sanctification's duration is increased by <span class="text-desc">3</span>s.`,
    },
    c3: {
      title: `C3: To Sequester Sorrow`,
      content: `Increases the Level of Sanctifying Ring by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: To Sever Sealing`,
      content: `When the Normal, Charged, or Plunging Attacks of the character affected by Shinobu's Grass Ring of Sanctification hit opponents, a Thundergrass Mark will land on the opponent's position and deal <b class="text-genshin-electro">AoE Electro DMG</b> based on <span class="text-desc">9.7%</span> of Shinobu's Max HP.
      <br />This effect can occur once every <span class="text-desc">5</span>s.`,
    },
    c5: {
      title: `C5: To Cease Courtesies`,
      content: `Increases the Level of Gyoei Narukami Kariyama Rite by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: To Ward Weakness`,
      content: `When Kuki Shinobu takes lethal DMG, this instance of DMG will not take her down. This effect will automatically trigger when her HP reaches <span class="text-desc">1</span> and will trigger once every <span class="text-desc">60</span>s.
      <br />When Shinobu's HP drops below <span class="text-desc">25%</span>, she will gain <span class="text-desc">150</span> Elemental Mastery for <span class="text-desc">15</span>s. This effect will trigger once every <span class="text-desc">60</span>s.`,
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
          value: [{ scaling: calcScaling(0.2523, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Low HP Total DMG',
          value: [{ scaling: calcScaling(0.4326, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.kuki_low) base[Stats.HEAL] += 0.15
      if (c >= 4)
        base.SKILL_SCALING.push({
          name: 'Thundergrass Mark DMG',
          value: [{ scaling: 0.097, multiplier: Stats.HP }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
        })
      if (form.kuki_c6) base[Stats.EM] += 125

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
