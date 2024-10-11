import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Freminet = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: c >= 3,
    skill: c >= 5,
    burst: false,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Flowing Eddies`,
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
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Pressurized Floe`,
      content: `Performs an upward thrust that deals <b class="text-genshin-cryo">Cryo DMG</b> and causes Freminet to enter <b class="text-genshin-cryo">Pers Timer</b> for <span class="text-desc">10</span>s.
      <br />While <b>Pers Timer</b> is active, his Elemental Skill will turn into <b>Shattering Pressure</b>.
      <br />
      <br /><b>Shattering Pressure</b>
      <br />Executes different sorts of attacks based on the <b>Pressure Level</b> of Pers Timer, and then cancels <b class="text-genshin-cryo">Pers Timer</b>.
      <br />- <b>Level 0</b>: Unleashes a vertical cut, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />- <b>Levels 1 to 3</b>: Unleashes a vertical cut alongside Pers, dealing <b class="text-genshin-cryo">Cryo DMG</b> and <b>Physical DMG</b>. DMG dealt scales based on Pressure Level.
      <br />- <b>Level 4</b>: Borrows the power of a fully-pressurized Pers to deal <b>Physical DMG</b>. Meanwhile, <b>Normal Attack: Flowing Eddies</b> will be replaced by <b>Shattering Pressure</b>.
      <br />
      <br /><b class="text-genshin-cryo">Pers Timer</b>
      <br />When Freminet uses Normal Attacks, he will also unleash waves of frost that deal <b class="text-genshin-cryo">Cryo DMG</b> and increase Pers's <b>Pressure Level</b>.
      <br />The accompanying <b class="text-genshin-cryo">Cryo DMG</b> dealt this way is considered Elemental Skill DMG.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />At certain intervals, after using the upward thrust, a <b class="text-genshin-pneuma">Spiritbreath Thorn</b> in the form of another upward thrust will be created, dealing <b class="text-genshin-pneuma">Pneuma</b>-aligned <b class="text-genshin-cryo">Cryo DMG</b>.
      `,
      image: 'Skill_S_Freminet_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Shadowhunter's Ambush`,
      content: `Unleashes a wave of untouchable cold, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>, resetting the CD of the Elemental Skill <b>Pressurized Floe</b>, and causing Freminet to enter the <b class="text-genshin-cryo">Subnautical Hunter</b> mode for <span class="text-desc">10</span>s.
      <br />
      <br />While in <b class="text-genshin-cryo">Subnautical Hunter</b> mode, Freminet's resistance to interruption will increase, and his Elemental Skill <b>Pressurized Floe</b> will obtain the following buffs:
      <br />- CD is decreased by <span class="text-desc">70%</span>.
      <br />- Normal Attacks will increase the <b class="text-genshin-cryo">Pers Timer</b> by <span class="text-desc">1</span> additional <b>Pressure Level</b>, and the frost released by his Normal Attacks deal <span class="text-desc">200%</span> of their original DMG.
      <br />
      <br />These effects will be canceled when Freminet leaves the field.`,
      image: 'Skill_E_Freminet_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Saturation Deep Dive`,
      content: `When Freminet unleashes <b>Pressurized Floe: Shattering Pressure</b>, if <b class="text-genshin-cryo">Pers Timer</b> has yet to reach <b>Pressure Level</b> <span class="text-desc">4</span>, the CD of <b>Pressurized Floe</b> will be decreased by <span class="text-desc">1</span>s.`,
      image: 'UI_Talent_S_Freminet_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Parallel Condensers`,
      content: `When Freminet triggers Shatter against opponents, the DMG dealt by <b>Pressurized Floe: Shattering Pressure</b> will be increased by <span class="text-desc">40%</span> for <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Freminet_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Deepwater Navigation`,
      content: `Decreases Aquatic Stamina consumption for your own party members by <span class="text-desc">35%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_S_Freminet_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Dreams of the Foamy Deep`,
      content: `The CRIT Rate of <b>Pressurized Floe: Shattering Pressure</b> will be increased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Freminet_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Penguins and the Land of Plenty`,
      content: `Unleashing <b>Pressurized Floe: Shattering Pressure</b> will restore <span class="text-desc">2</span> Energy to Freminet. If a <b>Pressure Level</b> <span class="text-desc">4</span> <b>Shattering Pressure</b> is unleashed, this will restore <span class="text-desc">3</span> Energy.`,
      image: 'UI_Talent_S_Freminet_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Song of the Eddies and Bleached Sands`,
      content: `Increases the Level of <b>Normal Attack: Flowing Eddies</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Freminet_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Dance of the Snowy Moon and Flute`,
      content: `After Freminet triggers Frozen, Shatter, or Superconduct against opponents, his ATK will be increased by <span class="text-desc">9%</span> for <span class="text-desc">6</span>s. Max <span class="text-desc">2</span> stacks. This can be triggered once every <span class="text-desc">0.3</span>s.`,
      image: 'UI_Talent_S_Freminet_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Nights of Hearth and Happiness`,
      content: `Increases the Level of <b>Pressurized Floe</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Freminet_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Moment of Waking and Resolve`,
      content: `After Freminet triggers Frozen, Shatter, or Superconduct against opponents, his CRIT DMG will be increased by <span class="text-desc">12%</span> for <span class="text-desc">6</span>s. Max <span class="text-desc">3</span> stacks. This can be triggered once every <span class="text-desc">0.3</span>s.`,
      image: 'UI_Talent_S_Freminet_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'pressure_level',
      text: `Pressure Level`,
      ...talents.skill,
      show: true,
      default: 4,
      min: 0,
      max: 4,
    },
    {
      type: 'toggle',
      id: 'frem_burst',
      text: `Subnautical Hunter`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'frem_a4',
      text: `A4 Shatter Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'number',
      id: 'frem_c4',
      text: `C4 ATK Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 2,
      min: 0,
      max: 2,
    },
    {
      type: 'number',
      id: 'frem_c6',
      text: `C6 CRIT DMG Stacks`,
      ...talents.c6,
      show: c >= 6,
      default: 3,
      min: 0,
      max: 3,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.8424, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.8068, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(1.019, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.238, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: 'Frost DMG',
          value: [{ scaling: calcScaling(0.0716, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
          multiplier: form.frem_burst ? 2 : 1,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.6252, normal, 'physical', '1'), multiplier: Stats.ATK }],
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

      const baseSkill = [
        {
          name: 'Upward Thrust DMG',
          value: [{ scaling: calcScaling(0.8304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Spiritbreath Thorn DMG',
          value: [{ scaling: calcScaling(0.144, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(3.184, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      switch (form.pressure_level) {
        case 1:
          base.SKILL_SCALING = [
            ..._.cloneDeep(baseSkill),
            {
              name: 'Level 1 Shattering Pressure Cryo DMG',
              value: [{ scaling: calcScaling(1.0024, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.CRYO,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
            {
              name: 'Level 1 Shattering Pressure Physical DMG',
              value: [{ scaling: calcScaling(0.4869, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
          ]
          break
        case 2:
          base.SKILL_SCALING = [
            ..._.cloneDeep(baseSkill),
            {
              name: 'Level 2 Shattering Pressure Cryo DMG',
              value: [{ scaling: calcScaling(0.7017, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.CRYO,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
            {
              name: 'Level 2 Shattering Pressure Physical DMG',
              value: [{ scaling: calcScaling(0.852, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
          ]
          break
        case 3:
          base.SKILL_SCALING = [
            ..._.cloneDeep(baseSkill),
            {
              name: 'Level 3 Shattering Pressure Cryo DMG',
              value: [{ scaling: calcScaling(0.401, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.CRYO,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
            {
              name: 'Level 3 Shattering Pressure Physical DMG',
              value: [{ scaling: calcScaling(1.2172, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
          ]
          break
        case 4:
          base.SKILL_SCALING = [
            ..._.cloneDeep(baseSkill),
            {
              name: 'Level 4 Shattering Pressure DMG',
              value: [{ scaling: calcScaling(2.4344, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
          ]
          break
        default:
          base.SKILL_SCALING = [
            ..._.cloneDeep(baseSkill),
            {
              name: 'Level 0 Shattering Pressure DMG',
              value: [{ scaling: calcScaling(2.0048, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.CRYO,
              property: TalentProperty.SKILL,
              bonus: form.frem_a4 ? 0.4 : 0,
              cr: c >= 1 ? 0.15 : 0,
            },
          ]
      }

      if (form.frem_c4) base[Stats.P_ATK].push({ value: 0.09, name: 'Constellation 4', source: `Self` }) * form.frem_c4
      if (form.frem_c6)
        base[Stats.CRIT_DMG].push({ value: 0.12, name: 'Constellation 6', source: `Self` }) * form.frem_c6

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

export default Freminet
