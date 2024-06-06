import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '../../../../../core/utils/data_format'

const Albedo = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const maxFatalReckoning = 4

  const talents: ITalent = {
    normal: {
      title: 'Favonius Bladework - Weiss',
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
      title: 'Abiogenesis: Solar Isotoma',
      content: `Albedo creates a Solar Isotoma using alchemy, which deals <b class="text-genshin-geo">AoE Geo DMG</b> on appearance.
      <br />
      <br /><b>Solar Isotoma</b>
      <br />has the following properties:
      <br />- When opponents within the Solar Isotoma field take DMG, the Solar Isotoma will generate Transient Blossoms which deal <b class="text-genshin-geo">AoE Geo DMG</b>. DMG dealt scales off Albedo's DEF.
      <br />- Transient Blossoms can only be generated once every <span class="text-desc">2</span>s.
      <br />- When a character is located at the locus of the Solar Isotoma, the Solar Isotoma will accumulate Geo power to form a crystallized platform that lifts the character up to a certain height. Only one crystallized platform can exist at a time.
      <br />- Solar Isotoma is considered a <b class="text-genshin-geo">Geo construct</b>. Only one Solar Isotoma created by Albedo himself can exist at a time.
      <br />
      <br /><b>Hold</b> to designate the location of the skill.`,
    },
    burst: {
      title: 'Rite of Progeniture: Tectonic Tide',
      content: `Under Albedo's command, Geo crystals surge and burst forth, dealing <b class="text-genshin-geo">AoE Geo DMG</b> in front of him.
      <br />If a Solar Isotoma created by Albedo himself is on the field, <span class="text-desc">7</span> Fatal Blossoms will be generated in the Solar Isotoma field, bursting violently into bloom and dealing <b class="text-genshin-geo">AoE Geo DMG</b>.
      <br />
      <br />Tectonic Tide DMG and Fatal Blossom DMG will not generate Transient Blossoms.`,
    },
    a1: {
      title: 'A1: Calcite Might',
      content: `Transient Blossoms generated by Abiogenesis: Solar Isotoma deal <span class="text-desc">25%</span> more DMG to opponents whose HP is below <span class="text-desc">50%</span>.`,
    },
    a4: {
      title: 'A4: Homuncular Nature',
      content: `Using Rite of Progeniture: Tectonic Tide increases the Elemental Mastery of nearby party members by <span class="text-desc">125</span> for <span class="text-desc">10</span>s.`,
    },
    util: {
      title: 'Flash of Genius',
      content: `When Albedo crafts Weapon Ascension Materials, he has a <span class="text-desc">10%</span> chance to receive double the product.`,
    },
    c1: {
      title: 'A1: Flower of Eden',
      content: `Transient Blossoms generated by Abiogenesis: Solar Isotoma deal <span class="text-desc">25%</span> more DMG to opponents whose HP is below <span class="text-desc">50%</span>.`,
    },
    c2: {
      title: 'C2: Opening of Phanerozoic',
      content: `Transient Blossoms generated by Abiogenesis: Solar Isotoma grant Albedo Fatal Reckoning for <span class="text-desc">30</span>s:
      <br />- Unleashing Rite of Progeniture: Tectonic Tide consumes all stacks of Fatal Reckoning. Each stack of Fatal Reckoning consumed increases the DMG dealt by Fatal Blossoms and Rite of Progeniture: Tectonic Tide's burst DMG by <span class="text-desc">30%</span> of Albedo's DEF.
      <br />- This effect stacks up to <span class="text-desc">4</span> times.`,
    },
    c3: {
      title: 'C3: Grace of Helios',
      content: `Increases the Level of Abiogenesis: Solar Isotoma by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: 'C4: Descent of Divinity',
      content: `Active party members within the Solar Isotoma field have their Plunging Attack DMG increased by <span class="text-desc">30%</span>.`,
    },
    c5: {
      title: 'C5: Tide of Hadean',
      content: `Increases the Level of Rite of Progeniture: Tectonic Tide by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: 'C6: Dust of Purification',
      content: `Active party members within the Solar Isotoma field who are protected by a shield created by Crystallize have their DMG increased by <span class="text-desc">17%</span>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'calciteMight',
      text: `Calcite Might`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'homuncularNature',
      text: `A4 Team EM Buff`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'number',
      id: 'fatalReckoningStacks',
      text: `Fatal Reckoning Stacks`,
      ...talents.c2,
      show: c >= 2,
      min: 0,
      max: maxFatalReckoning,
      default: maxFatalReckoning,
    },
    {
      type: 'toggle',
      id: 'descentOfDivinity',
      text: `C4 Plunge DMG Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'dustOfPurification',
      text: `C6 Crystallize Shield Buff`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'homuncularNature'),
    findContentById(content, 'descentOfDivinity'),
    findContentById(content, 'dustOfPurification'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      const fatalReckoningScaling =
        form.fatalReckoningStacks > 0 ? [{ scaling: 0.3 * form.fatalReckoningStacks, multiplier: Stats.DEF }] : []

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3674, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3674, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4745, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.4975, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.6207, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.473, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.602, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Transient Blossom DMG',
          value: [{ scaling: calcScaling(1.336, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
          bonus: form.calciteMight ? 0.25 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [
            { scaling: calcScaling(3.672, burst, 'elemental', '1'), multiplier: Stats.ATK },
            ...fatalReckoningScaling,
          ],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Fatal Blossom DMG [x7]',
          value: [
            { scaling: calcScaling(0.72, burst, 'elemental', '1'), multiplier: Stats.DEF },
            ...fatalReckoningScaling,
          ],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.dustOfPurification) base[Stats.ALL_DMG] += 0.17
      if (form.homuncularNature) base[Stats.EM] += 125
      if (form.descentOfDivinity) base.PLUNGE_DMG += 0.3

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.dustOfPurification) base[Stats.ALL_DMG] += 0.17
      if (form.homuncularNature) base[Stats.EM] += 250
      if (form.descentOfDivinity) base.PLUNGE_DMG += 0.3

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Albedo
