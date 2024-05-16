import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
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
    },
    skill: {
      title: `Spirit-Warding Lamp: Troubleshooter Cannon`,
      content: `Directs a Spirit-Warding Lamp to fire off a Troubleshooter Shot at opponents, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />After the Troubleshooter Shot hits, it will create 2 After-Sales Service Rounds that will automatically track nearby opponents and deal <b class="text-genshin-electro">Electro DMG</b>.
      `,
    },
    burst: {
      title: `Alcazarzaray's Exactitude`,
      content: `Summons forth the Jinni within the lamp to give the client various kinds of aid.
      <br />
      <br /><b>Jinni</b>
      <br />- Connects to a nearby character. The connected character will:
      <br />- Continuously restore HP based on Dori's Max HP.
      <br />- Continuously regenerate Energy.
      <br />- Be affected by <b class="text-genshin-electro">Electro</b>.
      <br />When the connector between the Jinni and the character touches opponents, it will deal one instance of <b class="text-genshin-electro">Electro DMG</b> to them every <span class="text-yellow">0.4</span>s.
      <br />
      <br />Only one Jinni can exist at one time.`,
    },
    a1: {
      title: `A1: An Eye for Gold`,
      content: `After a character connected to the Jinni triggers an Electro-Charged, Superconduct, Overloaded, Quicken, Aggravate, Hyperbloom, or an Electro Swirl or Crystallize reaction, the CD of Spirit-Warding Lamp: Troubleshooter Cannon is decreased by <span class="text-yellow">1</span>s.
      <br />This effect can be triggered once every <span class="text-yellow">3</span>s.`,
    },
    a4: {
      title: `A4: Compound Interest`,
      content: `When the Troubleshooter Shots or After-Sales Service Rounds from Spirit-Warding Lamp: Troubleshooter Cannon hit opponents, Dori will restore <span class="text-yellow">5</span> Elemental Energy for every <span class="text-yellow">100%</span> Energy Recharge possessed.
      <br />Per Spirit-Warding Lamp: Troubleshooter Cannon, only one instance of Energy restoration can be triggered and a maximum of <span class="text-yellow">15</span> Energy can be restored this way.`,
    },
    c1: {
      title: `C1: Additional Investment`,
      content: `The number of After-Sales Service Rounds created by Troubleshooter Shots is increased by <span class="text-yellow">1</span>.`,
    },
    c2: {
      title: `C2: Special Franchise`,
      content: `When you are in combat and the Jinni heals the character it is connected to, it will fire a Jinni Toop from that character's position that deals <span class="text-yellow">50%</span> of Dori's ATK DMG.`,
    },
    c3: {
      title: `C3: Wonders Never Cease`,
      content: `Increases the Level of Alcazarzaray's Exactitude by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Discretionary Supplement`,
      content: `The character connected to the Jinni will obtain the following buffs based on their current HP and Energy:
      <br />- When their HP is lower than <span class="text-yellow">50%</span>, they gain <span class="text-yellow">50%</span> Incoming Healing Bonus.
      <br />- When their Energy is less than <span class="text-yellow">50%</span>, they gain <span class="text-yellow">50%</span> Energy Recharge.`,
    },
    c5: {
      title: `C5: Value for Mora`,
      content: `Increases the Level of Spirit-Warding Lamp: Troubleshooter Cannon by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: Sprinkling Weight`,
      content: `Dori gains the following effects for <span class="text-yellow">3</span>s after using Spirit-Warding Lamp: Troubleshooter Cannon:
      <br /><b class="text-genshin-electro">Electro Infusion</b>.
      <br />When Normal Attacks hit opponents, all nearby party members will heal HP equivalent to <span class="text-yellow">4%</span> of Dori's Max HP. This type of healing can occur once every <span class="text-yellow">0.1</span>s.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'dori_low_hp',
      text: `Current HP < 50%`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'dori_low_energy',
      text: `Current Energy < 50%`,
      ...talents.c4,
      show: c >= 4,
      default: true,
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

  const teammateContent: IContent[] = [
    findContentById(content, 'dori_low_hp'),
    findContentById(content, 'dori_low_energy'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 40

      if (form.diluc_infusion) {
        base.INFUSION = Element.PYRO
        if (a >= 4) base[Stats.PYRO_DMG] += 0.2
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
          name: `Jinni Toop`,
          value: [{ scaling: 0.5, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
        })
      if (form.dori_low_hp) base[Stats.I_HEALING] += 0.5
      if (form.dori_low_energy) base[Stats.ER] += 0.3

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
    preComputeShared: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Dori
