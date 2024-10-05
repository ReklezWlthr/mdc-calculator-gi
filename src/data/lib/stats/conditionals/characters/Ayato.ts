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
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Kamisato Art: Kyouka`,
      content: `Kamisato Ayato shifts positions and enters the Takimeguri Kanka state.
      <br />After this shift, he will leave a watery illusion at his original location. After it is formed, the watery illusion will explode if opponents are nearby or after its duration ends, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b>.
      <br />
      <br /><b>Takimeguri Kanka</b>
      <br />In this state, Kamisato Ayato uses his Shunsuiken to engage in blindingly fast attacks, causing DMG from his Normal Attacks to be converted into <b class="text-genshin-hydro">AoE Hydro DMG</b>. This cannot be overridden.
      <br />It also has the following properties:
      <br />- After a Shunsuiken attack hits an opponent, it will grant Ayato the Namisen effect, increasing the DMG dealt by Shunsuiken based on Ayato's current Max HP. The initial maximum number of Namisen stacks is <span class="text-desc">4</span>, and <span class="text-desc">1</span> stack can be gained through Shunsuiken every <span class="text-desc">0.1</span>s. This effect will be dispelled when Takimeguri Kanka ends.
      <br />- Kamisato Ayato's resistance to interruption is increased.
      <br />- Unable to use Charged or Plunging Attacks.
      <br />
      <br />Takimeguri Kanka will be cleared when Ayato leaves the field. Using Kamisato Art: Kyouka again while in the Takimeguri Kanka state will reset and replace the pre-existing state.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Kamisato Art: Suiyuu`,
      content: `Unveils a garden of purity that silences the cacophony within.
      <br />While this space exists, Bloomwater Blades will constantly rain down and attack opponents within its AoE, dealing <b class="text-genshin-hydro">Hydro DMG</b> and increasing the Normal Attack DMG of characters within.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Kamisato Art: Mine Wo Matoishi Kiyotaki	`,
      content: `Kamisato Art: Kyouka has the following properties:
      <br />- After it is used, Kamisato Ayato will gain <span class="text-desc">2</span> Namisen stacks.
      <br />- When the water illusion explodes, Ayato will gain a Namisen effect equal to the maximum number of stacks possible.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Kamisato Art: Michiyuku Hagetsu`,
      content: `If Kamisato Ayato is not on the field and his Energy is less than <span class="text-desc">40</span>, he will regenerate <span class="text-desc">2</span> Energy for himself every second.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Kamisato Art: Daily Cooking`,
      content: `When Ayato cooks a dish perfectly, he has a <span class="text-desc">18%</span> chance to receive an additional "Suspicious" dish of the same type.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Kyouka Fuushi`,
      content: `Shunsuiken DMG is increased by <span class="text-desc">40%</span> against opponents with <span class="text-desc">50%</span> HP or less.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `World Source`,
      content: `Namisen's maximum stack count is increased to <span class="text-desc">5</span>. When Kamisato Ayato has at least <span class="text-desc">3</span> Namisen stacks, his Max HP is increased by <span class="text-desc">50%</span>.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `To Admire the Flowers`,
      content: `Increases the Level of Kamisato Art: Kyouka by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Endless Flow`,
      content: `After using Kamisato Art: Suiyuu, all nearby party members will have <span class="text-desc">15%</span> increased Normal Attack SPD for <span class="text-desc">15</span>s.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Bansui Ichiro`,
      content: `Increases the Level of Kamisato Art: Suiyuu by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Boundless Origin`,
      content: `After using Kamisato Art: Kyouka, Ayato's next Shunsuiken attack will create <span class="text-desc">2</span> extra Shunsuiken strikes when they hit opponents, each one dealing <span class="text-desc">450%</span> of Ayato's ATK as DMG.
      <br />Both these Shunsuiken attacks will not be affected by Namisen.`,
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
      default: true,
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

  const teammateContent: IContent[] = [findContentById(content, 'ayato_burst'), findContentById(content, 'ayato_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

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
              name: '4-Hit [x2]',
              value: [{ scaling: calcScaling(0.2945, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.756, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.2953, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

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

      if (form.ayato_burst) base.BASIC_DMG.push({value: 0.1, name: '', source: ``}) + _.min([burst + 0.01, 0.1])
      if (form.namisen >= 3 && c >= 2) base[Stats.P_HP].push({value: 0.5, name: '', source: ``})
      if (form.ayato_c4) base.ATK_SPD.push({value: 0.15, name: '', source: ``})

      if (form.ayato_infusion && c >= 6)
        base.BASIC_SCALING.push({
          name: 'C6 Extra Shunsuiken [x2]',
          value: [{ scaling: 4.5, multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
          bonus: form.ayato_c1 ? 0.4 : 0,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.ayato_burst) base.BASIC_DMG.push({value: 0.1, name: '', source: ``}) + _.min([burst + 0.01, 0.1])
      if (form.ayato_c4) base.ATK_SPD.push({value: 0.15, name: '', source: ``})

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ayato
