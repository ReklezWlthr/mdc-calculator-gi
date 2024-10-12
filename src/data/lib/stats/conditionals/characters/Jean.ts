import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Jean = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Weaving Blade`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of stamina to launch an opponent using the power of wind.
      <br />Launched opponents will slowly fall to the ground.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Gale Blade`,
      content: `Focusing the might of the formless wind around her blade, Jean releases a miniature storm, launching opponents in the direction she aims at, dealing massive <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br />At the cost of continued stamina consumption, Jean can command the whirlwind to pull surrounding opponents and objects towards her front.
      <br />Direction can be adjusted.
      <br />Character is immobile during skill duration.
      `,
      image: 'Skill_S_Qin_02',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Dandelion Breeze`,
      content: `Calling upon the wind's protection, Jean creates a swirling <b class="text-genshin-anemo">Dandelion Field</b>, launching surrounding opponents and dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />At the same time, she instantly regenerates a large amount of HP for all party members. The amount of HP restored scales off Jean's ATK.
      <br />
      <br /><b class="text-genshin-anemo">Dandelion Field</b>
      <br />- Continuously regenerates HP of characters within the AoE and continuously imbues them with <b class="text-genshin-anemo">Anemo</b>.
      <br />- Deals <b class="text-genshin-anemo">Anemo DMG</b> to opponents entering or exiting the <b class="text-genshin-anemo">Dandelion Field</b>.`,
      image: 'Skill_E_Qin_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Wind Companion`,
      content: `On hit, Jean's Normal Attacks have a <span class="text-desc">50%</span> chance to regenerate HP equal to <span class="text-desc">15%</span> of Jean's ATK for all party members.`,
      image: 'UI_Talent_S_Qin_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Let the Wind Lead`,
      content: `Using <b>Dandelion Breeze</b> will regenerate <span class="text-desc">20%</span> of its Energy.`,
      image: 'UI_Talent_S_Qin_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Guiding Breeze`,
      content: `When Perfect Cooking is achieved on a dish with restorative effects, there is a <span class="text-desc">12%</span> chance to obtain double the product.`,
      image: 'UI_Talent_Cook_Heal',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Spiraling Tempest`,
      content: `Increases the pulling speed of <b>Gale Blade</b> after holding for more than <span class="text-desc">1</span>s, and increases the DMG dealt by <span class="text-desc">40%</span>.`,
      image: 'UI_Talent_S_Qin_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `People's Aegis`,
      content: `When Jean picks up an Elemental Orb/Particle, all party members have their Movement SPD and ATK SPD increased by <span class="text-desc">15%</span> for <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Qin_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `When the West Wind Arises`,
      content: `Increases the Level of <b>Dandelion Breeze</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Qin_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Lands of Dandelion`,
      content: `Within the Field created by <b>Dandelion Breeze</b>, all opponents have their <b class="text-genshin-anemo">Anemo RES</b> decreased by <span class="text-desc">40%</span>.`,
      image: 'UI_Talent_S_Qin_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Outbursting Gust`,
      content: `Increases the Level of <b>Gale Blade</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Qin_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Lion's Fang, Fair Protector of Mondstadt`,
      content: `Incoming DMG is decreased by <span class="text-desc">35%</span> within the <b class="text-genshin-anemo">Field</b> created by <b>Dandelion Breeze</b>. Upon leaving the <b class="text-genshin-anemo">Dandelion Field</b>, this effect lasts for <span class="text-desc">3</span> attacks or <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Qin_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'jean_c1',
      text: `Fully Charged Gale Blade`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'jean_c2',
      text: `C2 Speed Buffs`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'jean_c6',
      text: `C6 DMG Reduction`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
    {
      type: 'toggle',
      id: 'jean_c4',
      text: `C4 Anemo RES Shred`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'jean_c2'),
    findContentById(content, 'jean_c4'),
    findContentById(content, 'jean_c6'),
  ]

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
          value: [{ scaling: calcScaling(0.4833, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4558, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.6029, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6588, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.7921, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.6202, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.92, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
          bonus: form.jean_c1 ? 0.4 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Elemental Burst DMG',
          value: [{ scaling: calcScaling(4.248, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Field Entering/Exiting DMG',
          value: [{ scaling: calcScaling(0.784, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Field Activation Healing',
          value: [{ scaling: calcScaling(2.512, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(1540, burst, 'elemental', '1'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Continuous Regeneration',
          value: [{ scaling: calcScaling(0.2512, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(154, burst, 'elemental', '1'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (a >= 1)
        base.BASIC_SCALING.push({
          name: 'A1 Heal On-Hit',
          value: [{ scaling: 0.15, multiplier: Stats.ATK }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.jean_c2) base.ATK_SPD.push({ value: 0.15, name: 'Constellation 2', source: `Self` })
      if (form.jean_c4) base.ANEMO_RES_PEN.push({ value: 0.4, name: 'Constellation 4', source: `Self` })
      if (form.jean_c6) base.DMG_REDUCTION.push({ value: 0.35, name: ' Constellation 6', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.jean_c2) base.ATK_SPD.push({ value: 0.15, name: 'Constellation 2', source: `Jean` })
      if (form.jean_c4) base.ANEMO_RES_PEN.push({ value: 0.4, name: 'Constellation 4', source: `Jean` })
      if (form.jean_c6) base.DMG_REDUCTION.push({ value: 0.35, name: 'Constellation 6', source: `Jean` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Jean
