import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Diluc = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Tempered Sword`,
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
      title: `Searing Onslaught`,
      content: `Performs a forward slash that deals <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />
      <br />This skill can be consecutively used <span class="text-desc">3</span> times.
      <br />Enters CD if not cast again within a short period.
      `,
    },
    burst: {
      title: `Dawn`,
      content: `Releases intense flames to knock back nearby opponents, dealing <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />The flames then converge into the weapon, summoning a Phoenix that flies forward and deals massive <b class="text-genshin-pyro">Pyro DMG</b> to all opponents in its path. The Phoenix explodes upon reaching its destination, causing a large amount of <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />The searing flames that run down his blade cause it to be infused with <b class="text-genshin-pyro">Pyro</b>.`,
    },
    a1: {
      title: `A1: Relentless`,
      content: `Diluc's Charged Attack Stamina Cost is decreased by <span class="text-desc">50%</span>, and its duration is increased by <span class="text-desc">3</span>s.`,
    },
    a4: {
      title: `A4: Blessing of Phoenix`,
      content: `The <b class="text-genshin-pyro">Pyro Infusion</b> provided by Dawn lasts for <span class="text-desc">4</span>s longer. Additionally, Diluc gains <span class="text-desc">20%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> during the duration of this effect.`,
    },
    util: {
      title: 'Traditional of the Dawn Knight',
      content: `Refunds <span class="text-desc">15%</span> of the ore used when crafting Claymore-type weapons.`,
    },
    c1: {
      title: `C1: Conviction`,
      content: `Diluc deals <span class="text-desc">15%</span> more DMG to opponents whose HP is above <span class="text-desc">50%</span>.`,
    },
    c2: {
      title: `C2: Searing Ember`,
      content: `When Diluc takes DMG, his ATK increases by <span class="text-desc">10%</span> and his ATK SPD increases by <span class="text-desc">5%</span>. Lasts for <span class="text-desc">10</span>s.
      This effect can stack up to <span class="text-desc">3</span> times and can only occur once every <span class="text-desc">1.5</span>s.`,
    },
    c3: {
      title: `C3: Fire and Steel`,
      content: `Increases the Level of Searing Onslaught by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Flowing Flame`,
      content: `Casting Searing Onslaught in rhythm greatly increases damage dealt.
      <br /><span class="text-desc">2</span>s after casting Searing Onslaught, casting the next Searing Onslaught in the combo deals <span class="text-desc">40%</span> additional DMG. This effect lasts for <span class="text-desc">2</span>s.`,
    },
    c5: {
      title: `C5: Phoenix, Harbinger of Dawn`,
      content: `Increases the Level of Dawn by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Flaming Sword, Nemesis of the Dark`,
      content: `After casting Searing Onslaught, the next <span class="text-desc">2</span> Normal Attacks within the next <span class="text-desc">6</span>s will have their DMG and ATK SPD increased by <span class="text-desc">30%</span>.
      <br />Additionally, Searing Onslaught will not interrupt the Normal Attack combo.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'diluc_infusion',
      text: `Pyro Infusion`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'diluc_c1',
      text: `Conviction`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'diluc_c2',
      text: `Searing Ember Stacks`,
      ...talents.c2,
      show: c >= 2,
      default: 0,
      min: 0,
      max: 3,
    },
    {
      type: 'toggle',
      id: 'diluc_c4',
      text: `Flowing Flame`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'diluc_c6',
      text: `C6 NA Buffs`,
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
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 40

      if (form.diluc_infusion) {
        base.infuse(Element.PYRO)
        if (a >= 4) base[Stats.PYRO_DMG] += 0.2
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.897, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.8763, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.9881, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.3399, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.688, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.247, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('diluc', normal)

      base.SKILL_SCALING = [
        {
          name: '1-Hit DMG',
          value: [{ scaling: calcScaling(0.944, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: '2-Hit DMG',
          value: [{ scaling: calcScaling(0.976, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
          bonus: form.diluc_c4 ? 0.4 : 0,
        },
        {
          name: '3-Hit DMG',
          value: [{ scaling: calcScaling(1.288, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
          bonus: form.diluc_c4 ? 0.4 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Slashing DMG`,
          value: [{ scaling: calcScaling(2.04, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: `DoT`,
          value: [{ scaling: calcScaling(0.6, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Explosion DMG`,
          value: [{ scaling: calcScaling(2.04, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.diluc_c1) base[Stats.ALL_DMG] += 0.15
      if (form.diluc_c2) {
        base[Stats.P_ATK] += 0.1 * form.diluc_c2
        base.ATK_SPD += 0.05 * form.diluc_c2
      }

      if (form.diluc_c6) {
        base.ATK_SPD += 0.3
        base.BASIC_DMG += 0.3
      }

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

export default Diluc
