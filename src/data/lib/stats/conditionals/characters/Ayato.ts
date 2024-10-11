import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ayato = (c: number, a: number, t: ITalentLevel) => {
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
      level: normal,
      trace: `Normal Attack`,
      title: `Kamisato Art: Marobashi`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to dash forward and perform an iai.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Kamisato Art: Kyouka`,
      content: `Kamisato Ayato shifts positions and enters the <b>Takimeguri Kanka</b> state.
      <br />After this shift, he will leave a watery illusion at his original location. After it is formed, the watery illusion will explode if opponents are nearby or after its duration ends, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b>.
      <br />
      <br /><b>Takimeguri Kanka</b>
      <br />In this state, Kamisato Ayato uses his <b class="text-genshin-hydro">Shunsuiken</b> to engage in blindingly fast attacks, causing DMG from his Normal Attacks to be converted into <b class="text-genshin-hydro">AoE Hydro DMG</b>. This cannot be overridden.
      <br />It also has the following properties:
      <br />- After a <b class="text-genshin-hydro">Shunsuiken</b> attack hits an opponent, it will grant Ayato the <b class="text-genshin-hydro">Namisen</b> effect, increasing the DMG dealt by <b class="text-genshin-hydro">Shunsuiken</b> based on Ayato's current Max HP. The initial maximum number of <b class="text-genshin-hydro">Namisen</b> stacks is <span class="text-desc">4</span>, and <span class="text-desc">1</span> stack can be gained through <b class="text-genshin-hydro">Shunsuiken</b> every <span class="text-desc">0.1</span>s. This effect will be dispelled when <b>Takimeguri Kanka</b> ends.
      <br />- Kamisato Ayato's resistance to interruption is increased.
      <br />- Unable to use Charged or Plunging Attacks.
      <br />
      <br /><b>Takimeguri Kanka</b> will be cleared when Ayato leaves the field. Using <b>Kamisato Art: Kyouka</b> again while in the <b>Takimeguri Kanka</b> state will reset and replace the pre-existing state.
      `,
      image: 'Skill_S_Ayato_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Kamisato Art: Suiyuu`,
      content: `Unveils a garden of purity that silences the cacophony within.
      <br />While this space exists, <b>Bloomwater Blades</b> will constantly rain down and attack opponents within its AoE, dealing <b class="text-genshin-hydro">Hydro DMG</b> and increasing the Normal Attack DMG of characters within.`,
      image: 'Skill_E_Ayato_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Kamisato Art: Mine Wo Matoishi Kiyotaki	`,
      content: `<b>Kamisato Art: Kyouka</b> has the following properties:
      <br />- After it is used, Kamisato Ayato will gain <span class="text-desc">2</span> <b class="text-genshin-hydro">Namisen</b> stacks.
      <br />- When the water illusion explodes, Ayato will gain a <b class="text-genshin-hydro">Namisen</b> effect equal to the maximum number of stacks possible.`,
      image: 'UI_Talent_S_Ayato_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Kamisato Art: Michiyuku Hagetsu`,
      content: `If Kamisato Ayato is not on the field and his Energy is less than <span class="text-desc">40</span>, he will regenerate <span class="text-desc">2</span> Energy for himself every second.`,
      image: 'UI_Talent_S_Ayato_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Kamisato Art: Daily Cooking`,
      content: `When Ayato cooks a dish perfectly, he has a <span class="text-desc">18%</span> chance to receive an additional "Suspicious" dish of the same type.`,
      image: 'UI_Talent_S_Ayato_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Kyouka Fuushi`,
      content: `<b class="text-genshin-hydro">Shunsuiken</b> DMG is increased by <span class="text-desc">40%</span> against opponents with <span class="text-desc">50%</span> HP or less.`,
      image: 'UI_Talent_S_Ayato_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `World Source`,
      content: `<b class="text-genshin-hydro">Namisen</b>'s maximum stack count is increased to <span class="text-desc">5</span>. When Kamisato Ayato has at least <span class="text-desc">3</span> <b class="text-genshin-hydro">Namisen</b> stacks, his Max HP is increased by <span class="text-desc">50%</span>.`,
      image: 'UI_Talent_S_Ayato_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `To Admire the Flowers`,
      content: `Increases the Level of <b>Kamisato Art: Kyouka</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Ayato_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Endless Flow`,
      content: `After using <b>Kamisato Art: Suiyuu</b>, all nearby party members will have <span class="text-desc">15%</span> increased Normal Attack SPD for <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Ayato_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Bansui Ichiro`,
      content: `Increases the Level of <b>Kamisato Art: Suiyuu</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Ayato_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Boundless Origin`,
      content: `After using <b>Kamisato Art: Kyouka</b>, Ayato's next <b class="text-genshin-hydro">Shunsuiken</b> attack will create <span class="text-desc">2</span> extra <b class="text-genshin-hydro">Shunsuiken</b> strikes when they hit opponents, each one dealing <span class="text-desc">450%</span> of Ayato's ATK as DMG.
      <br />Both these <b class="text-genshin-hydro">Shunsuiken</b> attacks will not be affected by <b class="text-genshin-hydro">Namisen</b>.`,
      image: 'UI_Talent_S_Ayato_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ayato_infusion',
      text: `Takimeguri Kanka`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'namisen',
      text: `Namisen Stacks`,
      ...talents.skill,
      show: true,
      default: c >= 2 ? 5 : 4,
      min: a >= 4 ? 2 : 0,
      max: c >= 2 ? 5 : 4,
    },
    {
      type: 'toggle',
      id: 'ayato_burst',
      text: `Burst Field NA DMG Bonus`,
      ...talents.burst,
      show: true,
      default: false,
    },
    {
      type: 'toggle',
      id: 'ayato_c1',
      text: `Target Current HP <= 50%`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ayato_c4',
      text: `C4 ATK SPD`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'ayato_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'ayato_burst')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      const namisen = form.namisen
        ? [{ scaling: calcScaling(0.0056, skill, 'physical', '1'), multiplier: Stats.HP }]
        : []
      base.BASIC_SCALING = form.ayato_infusion
        ? [
            {
              name: 'Shunsuiken 1-Hit',
              value: [{ scaling: calcScaling(0.5289, skill, 'physical', '1'), multiplier: Stats.ATK }, ...namisen],
              element: Element.HYDRO,
              property: TalentProperty.NA,
              bonus: form.ayato_c1 ? 0.4 : 0,
            },
            {
              name: 'Shunsuiken 2-Hit',
              value: [{ scaling: calcScaling(0.5891, skill, 'physical', '1'), multiplier: Stats.ATK }, ...namisen],
              element: Element.HYDRO,
              property: TalentProperty.NA,
              bonus: form.ayato_c1 ? 0.4 : 0,
            },
            {
              name: 'Shunsuiken 3-Hit',
              value: [{ scaling: calcScaling(0.6493, skill, 'physical', '1'), multiplier: Stats.ATK }, ...namisen],
              element: Element.HYDRO,
              property: TalentProperty.NA,
              bonus: form.ayato_c1 ? 0.4 : 0,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.4496, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.4716, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.5861, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.2945, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 2,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.756, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.ayato_infusion
        ? []
        : [
            {
              name: 'Charged Attack DMG',
              value: [{ scaling: calcScaling(1.2953, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = form.ayato_infusion ? [] : getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Water Illusion DMG',
          value: [{ scaling: calcScaling(1.0148, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Bloomwater Blade DMG',
          value: [{ scaling: calcScaling(0.6646, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.ayato_burst)
        base.BASIC_DMG.push({ value: 0.1 + _.min([burst + 0.01, 0.1]), name: 'Elemental Burst', source: `Self` })
      if (form.namisen >= 3 && c >= 2) base[Stats.P_HP].push({ value: 0.5, name: 'Constellation 2', source: `Self` })
      if (form.ayato_c4) base.ATK_SPD.push({ value: 0.15, name: 'Constellation 4', source: `Self` })

      if (form.ayato_infusion && c >= 6)
        base.BASIC_SCALING.push({
          name: 'C6 Extra Shunsuiken',
          value: [{ scaling: 4.5, multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
          bonus: form.ayato_c1 ? 0.4 : 0,
          hit: 2,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.ayato_burst)
        base.BASIC_DMG.push({
          value: 0.1 + _.min([burst + 0.01, 0.1]),
          name: 'Elemental Burst',
          source: `Kamisato Ayato`,
        })
      if (form.ayato_c4) base.ATK_SPD.push({ value: 0.15, name: 'Constellation 4', source: `Kamisato Ayato` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ayato
