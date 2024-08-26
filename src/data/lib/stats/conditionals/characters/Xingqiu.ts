import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xingqiu = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Guhua Style`,
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
      trace: `Elemental Skill`,
      title: `Guhua Sword: Fatal Rainscreen`,
      content: `Xingqiu performs twin strikes with his sword, dealing <b class="text-genshin-hydro">Hydro DMG</b>. At the same time, this ability creates the maximum number of Rain Swords, which will orbit your active character.
      <br />The Rain Swords have the following properties:
      <br />- When a character takes DMG, the Rain Sword will shatter, reducing the amount of DMG taken.
      <br />- Increases the character's resistance to interruption.
      <br />
      <br /><span class="text-desc">20%</span> of Xingqiu's <b class="text-genshin-hydro">Hydro DMG Bonus</b> will be converted to additional DMG Reduction for the Rain Swords.
      <br />
      <br />The maximum amount of additional DMG Reduction that can be gained this way is <span class="text-desc">24%</span>.
      <br />The initial maximum number of Rain Swords is <span class="text-desc">3</span>.
      <br />Using this ability applies the <b class="text-genshin-hydro">Wet</b> status onto the character.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Guhua Sword: Raincutter`,
      content: `Initiate Rainbow Bladework and fight using an illusory sword rain, while creating the maximum number of Rain Swords.
      <br />
      <br /><b>Rainbow Bladework</b>
      <br />- Your active character's Normal Attacks will trigger consecutive sword rain attacks, dealing <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />- Rain Swords will remain at the maximum number throughout the ability's duration.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Hydropathic`,
      content: `When a Rain Sword is shattered or when its duration expires, it regenerates the current character's HP based on <span class="text-desc">6%</span> of Xingqiu's Max HP.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Blades Amidst Raindrops`,
      content: `Xingqiu gains a <span class="text-desc">20%</span> <b class="text-genshin-hydro">Hydro DMG Bonus</b>.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Flash of Genius`,
      content: `When Xingqiu crafts Character Talent Materials, he has a <span class="text-desc">25%</span> chance to refund a portion of the crafting materials used.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `The Scent Remained`,
      content: `Increases the maximum number of Rain Swords by <span class="text-desc">1</span>.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Rainbow Upon the Azure Sky`,
      content: `Extends the duration of Guhua Sword: Raincutter by <span class="text-desc">3</span>s.
      <br />Decreases the <b class="text-genshin-hydro">Hydro RES</b> of opponents hit by sword rain attacks by <span class="text-desc">15%</span> for <span class="text-desc">4</span>s.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Weaver of Verses`,
      content: `Increases the Level of Guhua Sword: Raincutter by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Evilsoother`,
      content: `Throughout the duration of Guhua Sword: Raincutter, the DMG dealt by Guhua Sword: Fatal Rainscreen is increased by <span class="text-desc">50%</span>.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Embrace of Rain`,
      content: `Increases the Level of Guhua Sword: Fatal Rainscreen by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Hence, Call Them My Own Verses`,
      content: `Activating <span class="text-desc">2</span> of Guhua Sword: Raincutter's sword rain attacks greatly enhances the third sword rain attack. On hit, the third sword rain attack also regenerates <span class="text-desc">3</span> Energy for Xingqiu.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'xq_skill',
      text: `Rain Swords DMG Reduction`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xq_c2',
      text: `C2 Hydro RES Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'xq_c4',
      text: `C4 Skill DMG Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'xq_skill'), findContentById(content, 'xq_c2')]

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
          value: [{ scaling: calcScaling(0.4661, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4764, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.2855, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5599, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit [x2]',
          value: [{ scaling: calcScaling(0.3586, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.473, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.5616, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG [1]',
          value: [{ scaling: calcScaling(1.68, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
          multiplier: form.xq_c4 ? 1.5 : 0,
        },
        {
          name: 'Skill DMG [2]',
          value: [{ scaling: calcScaling(1.9192, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
          multiplier: form.xq_c4 ? 1.5 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Sword Rain DMG',
          value: [{ scaling: calcScaling(0.5427, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1)
        base.SKILL_SCALING.push({
          name: 'Skill Expire Healing',
          value: [{ scaling: 0.06, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.xq_c2) base.HYDRO_RES_PEN += 0.15

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.xq_skill) base.DMG_REDUCTION += _.min([0.19 + skill * 0.01, 0.29]) + 0.2 * own[Stats.HYDRO_DMG]
      if (form.xq_c2) base.HYDRO_RES_PEN += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.xq_skill) base.DMG_REDUCTION += _.min([0.19 + skill * 0.01, 0.29]) + 0.2 * base[Stats.HYDRO_DMG]

      return base
    },
  }
}

export default Xingqiu
