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
      trace: `Normal Attack`,
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
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
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
      image: 'Skill_S_PlayerWind_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Gust Surge`,
      content: `Guiding the path of the wind currents, you summon a forward-moving tornado that pulls objects and opponents towards itself, dealing continuous <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the tornado comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will deal additional <b>Elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.`,
      image: 'Skill_E_PlayerWind_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Slitting Wind`,
      content: `The last hit of a Normal Attack combo unleashes a wind blade, dealing <span class="text-desc">60%</span> of ATK as <b class="text-genshin-anemo">Anemo DMG</b> to all opponents in its path.`,
      image: 'UI_Talent_S_PlayerWind_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Second Wind`,
      content: `<b>Palm Vortex</b> kills regenerate <span class="text-desc">2%</span> HP for <span class="text-desc">5</span>s. This effect can only occur once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_PlayerWind_06',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Raging Vortex`,
      content: `<b>Palm Vortex</b> pulls in opponents and objects within a <span class="text-desc">5</span>m radius.`,
      image: 'UI_Talent_S_PlayerWind_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Uprising Whirlwind`,
      content: `Increases Energy Recharge by <span class="text-desc">16%</span>.`,
      image: 'UI_Talent_S_PlayerWind_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Sweeping Gust`,
      content: `Increases the Level of <b>Gust Surge</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerWind_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Cherishing Breezes`,
      content: `Reduces DMG taken while casting <b>Palm Vortex</b> by <span class="text-desc">10%</span>.`,
      image: 'UI_Talent_S_PlayerWind_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Viridian Transience`,
      content: `Increases the Level of <b>Palm Vortex</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerWind_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Intertwined Winds`,
      content: `Targets who take DMG from <b>Gust Surge</b> have their <b class="text-genshin-anemo">Anemo RES</b> decreased by <span class="text-desc">20%</span>.
      <br />If an Elemental Absorption occurred, then their <b>RES</b> towards the corresponding Element is also decreased by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_PlayerWind_04',
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
          self: true,
        })
      if (form.amc_c4) base.DMG_REDUCTION.push({ value: 0.1, name: 'Constellation 4', source: `Self` })
      if (form.amc_c6) {
        base.ANEMO_RES_PEN.push({ value: 0.2, name: 'Constellation 6', source: `Self` })
        if (form.amc_burst_absorb)
          base[`${form.amc_burst_absorb.toUpperCase()}_RES_PEN`].push({
            value: 0.2,
            name: 'Constellation 6',
            source: `Self`,
          })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.amc_c6) {
        base.ANEMO_RES_PEN.push({ value: 0.2, name: 'Constellation 6', source: `Traveler` })
        if (form.amc_burst_absorb)
          base[`${form.amc_burst_absorb.toUpperCase()}_RES_PEN`].push({
            value: 0.2,
            name: 'Constellation 6',
            source: `Traveler`,
          })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default TravelerWind
