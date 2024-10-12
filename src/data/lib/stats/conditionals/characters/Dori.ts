import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Dori = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Marvelous Sword-Dance (Modified)`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive strikes.
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
      title: `Spirit-Warding Lamp: Troubleshooter Cannon`,
      content: `Directs a Spirit-Warding Lamp to fire off a <b>Troubleshooter Shot</b> at opponents, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />After the <b>Troubleshooter Shot</b> hits, it will create <span class="text-desc">2</span> <b>After-Sales Service Rounds</b> that will automatically track nearby opponents and deal <b class="text-genshin-electro">Electro DMG</b>.
      `,
      image: 'Skill_S_Dori_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Alcazarzaray's Exactitude`,
      content: `Summons forth the <b class="text-genshin-electro">Jinni</b> within the lamp to give the client various kinds of aid.
      <br />
      <br /><b class="text-genshin-electro">Jinni</b>
      <br />Connects to a nearby character. The connected character will:
      <br />- Continuously restore HP based on Dori's Max HP.
      <br />- Continuously regenerate Energy.
      <br />- Be affected by <b class="text-genshin-electro">Electro</b>.
      <br />When the connector between the <b class="text-genshin-electro">Jinni</b> and the character touches opponents, it will deal one instance of <b class="text-genshin-electro">Electro DMG</b> to them every <span class="text-desc">0.4</span>s.
      <br />
      <br />Only one <b class="text-genshin-electro">Jinni</b> can exist at one time.`,
      image: 'Skill_E_Dori_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `An Eye for Gold`,
      content: `After a character connected to the <b class="text-genshin-electro">Jinni</b> triggers an Electro-Charged, Superconduct, Overloaded, Quicken, Aggravate, Hyperbloom, or an Electro Swirl or Crystallize reaction, the CD of <b>Spirit-Warding Lamp: Troubleshooter Cannon</b> is decreased by <span class="text-desc">1</span>s.
      <br />This effect can be triggered once every <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Dori_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Compound Interest`,
      content: `When the <b>Troubleshooter Shots</b> or <b>After-Sales Service Rounds</b> from <b>Spirit-Warding Lamp: Troubleshooter Cannon</b> hit opponents, Dori will restore <span class="text-desc">5</span> Elemental Energy for every <span class="text-desc">100%</span> Energy Recharge possessed.
      <br />Per <b>Spirit-Warding Lamp: Troubleshooter Cannon</b>, only one instance of Energy restoration can be triggered and a maximum of <span class="text-desc">15</span> Energy can be restored this way.`,
      image: 'UI_Talent_S_Dori_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Unexpected Order`,
      content: `Has a <span class="text-desc">25%</span> chance to recover some of the materials used when crafting Character and Weapon Materials.`,
      image: 'UI_Talent_S_Dori_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Additional Investment`,
      content: `The number of <b>After-Sales Service Rounds</b> created by <b>Troubleshooter Shots</b> is increased by <span class="text-desc">1</span>.`,
      image: 'UI_Talent_S_Dori_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Special Franchise`,
      content: `When you are in combat and the <b class="text-genshin-electro">Jinni</b> heals the character it is connected to, it will fire a <b>Jinni Toop</b> from that character's position that deals <span class="text-desc">50%</span> of Dori's ATK DMG.`,
      image: 'UI_Talent_S_Dori_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Wonders Never Cease`,
      content: `Increases the Level of <b>Alcazarzaray's Exactitude</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Dori_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Discretionary Supplement`,
      content: `The character connected to the <b class="text-genshin-electro">Jinni</b> will obtain the following buffs based on their current HP and Energy:
      <br />- When their HP is lower than <span class="text-desc">50%</span>, they gain <span class="text-desc">50%</span> Incoming Healing Bonus.
      <br />- When their Energy is less than <span class="text-desc">50%</span>, they gain <span class="text-desc">50%</span> Energy Recharge.`,
      image: 'UI_Talent_S_Dori_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Value for Mora`,
      content: `Increases the Level of <b>Spirit-Warding Lamp: Troubleshooter Cannon</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Dori_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Sprinkling Weight`,
      content: `Dori gains the following effects for <span class="text-desc">3</span>s after using <b>Spirit-Warding Lamp: Troubleshooter Cannon</b>:
      <br />- <b class="text-genshin-electro">Electro Infusion</b>.
      <br />- When Normal Attacks hit opponents, all nearby party members will heal HP equivalent to <span class="text-desc">4%</span> of Dori's Max HP. This type of healing can occur once every <span class="text-desc">0.1</span>s.`,
      image: 'UI_Talent_S_Dori_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'dori_low_hp',
      text: `Current HP < 50%`,
      ...talents.c4,
      show: c >= 4,
      default: false,
    },
    {
      type: 'toggle',
      id: 'dori_low_energy',
      text: `Current Energy < 50%`,
      ...talents.c4,
      show: c >= 4,
      default: false,
    },
    {
      type: 'toggle',
      id: 'dori_c6_infusion',
      text: `C6 Electro Infusion`,
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
    allyContent: [findContentById(content, 'dori_low_hp'), findContentById(content, 'dori_low_energy')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      if (form.diluc_infusion) {
        base.INFUSION = Element.PYRO
        if (a >= 4) base[Stats.PYRO_DMG].push({ value: 0.2, name: '', source: `` })
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.9021, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [1]',
          value: [{ scaling: calcScaling(0.4107, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [2]',
          value: [{ scaling: calcScaling(0.4312, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(1.284, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          name: 'Troubleshooter Shot DMG',
          value: [{ scaling: calcScaling(1.4728, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'After-Sales Service Round DMG',
          value: [{ scaling: calcScaling(0.3156, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Connector DMG`,
          value: [{ scaling: calcScaling(0.1588, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Continuous Healing`,
          value: [{ scaling: calcScaling(0.0667, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(641.9, burst, 'elemental', '1'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (c >= 2)
        base.BURST_SCALING.push({
          name: `Jinni Toop DMG`,
          value: [{ scaling: 0.5, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
        })
      if (form.dori_low_hp) base[Stats.I_HEALING].push({ value: 0.5, name: 'Constellation 4', source: `Self` })
      if (form.dori_low_energy) base[Stats.ER].push({ value: 0.3, name: 'Constellation 4', source: `Self` })

      if (form.dori_c6_infusion) {
        base.infuse(Element.ELECTRO)
        base.BASIC_SCALING.push({
          name: `C6 Healing On Hit`,
          value: [{ scaling: 0.04, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.dori_low_hp) base[Stats.I_HEALING].push({ value: 0.5, name: 'Constellation 4', source: `Dori` })
      if (aForm.dori_low_energy) base[Stats.ER].push({ value: 0.3, name: 'Constellation 4', source: `Dori` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Dori
