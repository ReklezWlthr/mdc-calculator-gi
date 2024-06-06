import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerWind = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Foreign Ironwind`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Palm Vortex`,
      content: `Grasping the wind's might, you form a vortex of vacuum in your palm, causing continuous <b class="text-genshin-anemo">Anemo DMG</b> to opponents in front of you.
      <br />The vacuum vortex explodes when the skill duration ends, causing a greater amount of <b class="text-genshin-anemo">Anemo DMG</b> over a larger area.
      <br />
      <br /><b>Hold</b>
      <br />DMG and AoE will gradually increase.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the vortex comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will deal additional <b>Elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.
      `,
    },
    burst: {
      title: `Gust Surge`,
      content: `Guiding the path of the wind currents, you summon a forward-moving tornado that pulls objects and opponents towards itself, dealing continuous <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the tornado comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will deal additional <b>Elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.`,
    },
    a1: {
      title: `A1: Slitting Wind`,
      content: `The last hit of a Normal Attack combo unleashes a wind blade, dealing <span class="text-desc">60%</span> of ATK as <b class="text-genshin-anemo">Anemo DMG</b> to all opponents in its path.`,
    },
    a4: {
      title: `A4: Second Wind`,
      content: `Palm Vortex kills regenerate <span class="text-desc">2%</span> HP for <span class="text-desc">5</span>s. This effect can only occur once every <span class="text-desc">5</span>s.`,
    },
    c1: {
      title: `C1: Raging Vortex`,
      content: `Palm Vortex pulls in opponents and objects within a <span class="text-desc">5</span>m radius.`,
    },
    c2: {
      title: `C2: Uprising Whirlwind`,
      content: `Increases Energy Recharge by <span class="text-desc">16%</span>.`,
    },
    c3: {
      title: `C3: Sweeping Gust`,
      content: `Increases the Level of Gust Surge by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Cherishing Breezes`,
      content: `Reduces DMG taken while casting Palm Vortex by 10%.`,
    },
    c5: {
      title: `C5: Viridian Transience`,
      content: `Increases the Level of Palm Vortex by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Intertwined Winds`,
      content: `Targets who take DMG from Gust Surge have their <b class="text-genshin-anemo">Anemo RES</b> decreased by <span class="text-desc">20%</span>.
      <br />If an Elemental Absorption occurred, then their <b>RES</b> towards the corresponding Element is also decreased by <span class="text-desc">20%</span>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'element',
      id: 'amc_skill_absorb',
      text: `Skill Elemental Absorption`,
      ...talents.skill,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'element',
      id: 'amc_burst_absorb',
      text: `Burst Elemental Absorption`,
      ...talents.burst,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'toggle',
      id: 'amc_c4',
      text: `C4 Skill Hold DMG Reduction`,
      ...talents.c4,
      show: c >= 4,
      default: false,
    },
    {
      type: 'toggle',
      id: 'amc_c6',
      text: `C6 RES Shred`,
      ...talents.c6,
      show: c >= 6,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'amc_c6')]

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
          value: [{ scaling: calcScaling(0.445, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.434, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.53, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.583, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.708, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.559, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.607, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Initial Cutting DMG',
          value: [{ scaling: calcScaling(0.12, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Max Cutting DMG',
          value: [{ scaling: calcScaling(0.168, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Initial Storm DMG',
          value: [{ scaling: calcScaling(1.76, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Max Storm DMG',
          value: [{ scaling: calcScaling(1.92, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Initial Additional Cutting DMG',
          value: [{ scaling: calcScaling(0.12, skill, 'elemental', '1') / 4, multiplier: Stats.ATK }],
          element: form.amc_skill_absorb,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Max Additional Cutting DMG',
          value: [{ scaling: calcScaling(0.168, skill, 'elemental', '1') / 4, multiplier: Stats.ATK }],
          element: form.amc_skill_absorb,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Initial Additional Storm DMG',
          value: [{ scaling: calcScaling(1.76, skill, 'elemental', '1') / 4, multiplier: Stats.ATK }],
          element: form.amc_skill_absorb,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Max Additional Storm DMG',
          value: [{ scaling: calcScaling(1.92, skill, 'elemental', '1') / 4, multiplier: Stats.ATK }],
          element: form.amc_skill_absorb,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Tornado DMG',
          value: [{ scaling: calcScaling(0.808, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Additional Elemental DMG',
          value: [{ scaling: calcScaling(0.248, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.amc_burst_absorb,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1)
        base.BASIC_SCALING.push({
          name: 'A1 Wind Blade DMG',
          value: [{ scaling: 0.6, multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        })
      if (a >= 4)
        base.SKILL_SCALING.push({
          name: 'On Kill',
          value: [{ scaling: 0.02, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
      if (form.amc_c4) base.DMG_REDUCTION += 0.1
      if (form.amc_c6) {
        base.ANEMO_RES_PEN += 0.2
        if (form.amc_burst_absorb) base[`${form.amc_burst_absorb.toUpperCase()}_RES_PEN`] += 0.2
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.amc_c6) {
        base.ANEMO_RES_PEN += 0.2
        if (form.amc_burst_absorb) base[`${form.amc_burst_absorb.toUpperCase()}_RES_PEN`] += 0.2
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default TravelerWind
