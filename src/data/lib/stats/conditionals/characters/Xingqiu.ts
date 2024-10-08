import { findContentById } from '@src/core/utils/finder'
import _, { multiply } from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xingqiu = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Guhua Sword: Fatal Rainscreen`,
      content: `Xingqiu performs twin strikes with his sword, dealing <b class="text-genshin-hydro">Hydro DMG</b>. At the same time, this ability creates the maximum number of <b class="text-blue">Rain Swords</b>, which will orbit your active character.
      <br />The <b class="text-blue">Rain Swords</b> have the following properties:
      <br />- When a character takes DMG, the <b class="text-blue">Rain Sword</b> will shatter, reducing the amount of DMG taken.
      <br />- Increases the character's resistance to interruption.
      <br />
      <br /><span class="text-desc">20%</span> of Xingqiu's <b class="text-genshin-hydro">Hydro DMG Bonus</b> will be converted to additional DMG Reduction for the <b class="text-blue">Rain Swords</b>.
      <br />
      <br />The maximum amount of additional DMG Reduction that can be gained this way is <span class="text-desc">24%</span>.
      <br />The initial maximum number of <b class="text-blue">Rain Swords</b> is <span class="text-desc">3</span>.
      <br />Using this ability applies the <b class="text-genshin-hydro">Wet</b> status onto the character.
      `,
      image: 'Skill_S_Xingqiu_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Guhua Sword: Raincutter`,
      content: `Initiate <b>Rainbow Bladework</b> and fight using an illusory sword rain, while creating the maximum number of <b class="text-blue">Rain Swords</b>.
      <br />
      <br /><b>Rainbow Bladework</b>
      <br />- Your active character's Normal Attacks will trigger consecutive sword rain attacks, dealing <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />- <b class="text-blue">Rain Swords</b> will remain at the maximum number throughout the ability's duration.`,
      image: 'Skill_E_Xingqiu_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Hydropathic`,
      content: `When a <b class="text-blue">Rain Sword</b> is shattered or when its duration expires, it regenerates the current character's HP based on <span class="text-desc">6%</span> of Xingqiu's Max HP.`,
      image: 'UI_Talent_S_Xingqiu_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Blades Amidst Raindrops`,
      content: `Xingqiu gains a <span class="text-desc">20%</span> <b class="text-genshin-hydro">Hydro DMG Bonus</b>.`,
      image: 'UI_Talent_S_Xingqiu_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Flash of Genius`,
      content: `When Xingqiu crafts Character Talent Materials, he has a <span class="text-desc">25%</span> chance to refund a portion of the crafting materials used.`,
      image: 'UI_Talent_Combine_Talent',
    },
    c1: {
      trace: `Constellation 1`,
      title: `The Scent Remained`,
      content: `Increases the maximum number of <b class="text-blue">Rain Swords</b> by <span class="text-desc">1</span>.`,
      image: 'UI_Talent_S_Xingqiu_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Rainbow Upon the Azure Sky`,
      content: `Extends the duration of <b>Guhua Sword: Raincutter</b> by <span class="text-desc">3</span>s.
      <br />Decreases the <b class="text-genshin-hydro">Hydro RES</b> of opponents hit by sword rain attacks by <span class="text-desc">15%</span> for <span class="text-desc">4</span>s.`,
      image: 'UI_Talent_S_Xingqiu_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Weaver of Verses`,
      content: `Increases the Level of <b>Guhua Sword: Raincutter</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xingqiu_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Evilsoother`,
      content: `Throughout the duration of <b>Guhua Sword: Raincutter</b>, the DMG dealt by <b>Guhua Sword: Fatal Rainscreen</b> is increased by <span class="text-desc">50%</span>.`,
      image: 'UI_Talent_S_Xingqiu_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Embrace of Rain`,
      content: `Increases the Level of <b>Guhua Sword: Fatal Rainscreen</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xingqiu_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Hence, Call Them My Own Verses`,
      content: `Activating <span class="text-desc">2</span> of <b>Guhua Sword: Raincutter</b>'s sword rain attacks greatly enhances the third sword rain attack. On hit, the third sword rain attack also regenerates <span class="text-desc">3</span> Energy for Xingqiu.`,
      image: 'UI_Talent_S_Xingqiu_04',
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
          name: 'Rain Sword Shatter Healing',
          value: [{ scaling: 0.06, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.xq_c2) base.HYDRO_RES_PEN.push({ value: 0.15, name: 'Constellation 2', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.xq_c2) base.HYDRO_RES_PEN.push({ value: 0.15, name: 'Constellation 2', source: `Xingqiu` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>, allBase: StatsObject[]) => {
      if (form.xq_skill)
        _.last(allBase).CALLBACK.push(function (x, a) {
          const index = _.findIndex(team, (item) => item.cId === '10000025')
          _.forEach(a, (item, i) => {
            item.DMG_REDUCTION.push({
              value:
                _.min([0.19 + skill * 0.01, 0.29]) +
                _.min([
                  0.2 *
                    (a[index].getValue(Stats.HYDRO_DMG) +
                      a[index].getValue(Stats.ELEMENTAL_DMG) +
                      a[index].getValue(Stats.ALL_DMG)),
                  0.24,
                ]),
              name: 'Rain Swords',
              source: i === index ? 'Self' : 'Xingqiu',
              base: toPercentage(
                _.min([
                  a[index].getValue(Stats.HYDRO_DMG) +
                    a[index].getValue(Stats.ELEMENTAL_DMG) +
                    a[index].getValue(Stats.ALL_DMG),
                  1.2,
                ])
              ),
              multiplier: 0.2,
              flat: toPercentage(_.min([0.19 + skill * 0.01, 0.29])),
            })
            console.log(item.DMG_REDUCTION)
          })
          return x
        })

      return base
    },
  }
}

export default Xingqiu
