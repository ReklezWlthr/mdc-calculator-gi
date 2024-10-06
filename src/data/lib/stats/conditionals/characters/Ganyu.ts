import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ganyu = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Liutian Archery`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, an icy aura will accumulate on the arrowhead before the arrow is fired. Has different effects based on how long the energy has been charged:
      <br /><b>Charge Level 1</b>: Fires off an icy arrow that deals <b class="text-genshin-cryo">Cryo DMG</b>.
      <br /><b>Charge Level 2</b>: Fires off a <b class="text-genshin-cryo">Frostflake Arrow</b> that deals <b class="text-genshin-cryo">Cryo DMG</b>. The <b class="text-genshin-cryo">Frostflake Arrow</b> blooms after hitting its target, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Trail of the Qilin`,
      content: `Leaving a single <b class="text-genshin-cryo">Ice Lotus</b> behind, Ganyu dashes backward, shunning all impurity and dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b class="text-genshin-cryo">Ice Lotus</b>
      <br />- Continuously taunts surrounding opponents, attracting them to attack it.
      <br />- Endurance scales based on Ganyu's Max HP.
      <br />- Blooms profusely when destroyed or once its duration ends, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.`,
      image: 'Skill_S_Ganyu_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Celestial Shower`,
      content: `Coalesces atmospheric frost and snow to summon a Sacred Cryo Pearl that exorcises evil.
      <br />During its ability duration, the Sacred Cryo Pearl will continuously rain down shards of ice, striking opponents within an AoE and dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      `,
      image: 'Skill_E_Ganyu_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Undivided Heart`,
      content: `After firing a <b class="text-genshin-cryo">Frostflake Arrow</b>, the CRIT Rate of subsequent <b class="text-genshin-cryo">Frostflake Arrows</b> and their resulting bloom effects is increased by <span class="text-desc">20%</span> for <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Ganyu_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Harmony between Heaven and Earth`,
      content: `<b>Celestial Shower</b> grants a <span class="text-desc">20%</span> <b class="text-genshin-cryo">Cryo DMG Bonus</b> to active members in the AoE.`,
      image: 'UI_Talent_S_Ganyu_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: 'Preserved for the Hunt',
      content: `Refunds <span class="text-desc">15%</span> of the ore used when crafting Bow-type weapons.`,
      image: 'UI_Talent_Forge_Bow',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Dew-Drinker`,
      content: `Taking DMG from a <b>Charge Level</b> <span class="text-desc">2</span> <b class="text-genshin-cryo">Frostflake Arrow</b> or <b class="text-genshin-cryo">Frostflake Arrow Bloom</b> decreases opponents' <b class="text-genshin-cryo">Cryo RES</b> by <span class="text-desc">15%</span> for <span class="text-desc">6</span>s.
      <br />A hit regenerates <span class="text-desc">2</span> Energy for Ganyu. This effect can only occur once per <b>Charge Level</b> <span class="text-desc">2</span> <b class="text-genshin-cryo">Frostflake Arrow</b>, regardless if <b class="text-genshin-cryo">Frostflake Arrow</b> itself or its <b class="text-genshin-cryo">Bloom</b> hit the target.`,
      image: 'UI_Talent_S_Ganyu_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `The Auspicious`,
      content: `<b>Trail of the Qilin</b> gains <span class="text-desc">1</span> additional charge.`,
      image: 'UI_Talent_S_Ganyu_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Cloud-Strider`,
      content: `Increases the Level of <b>Celestial Shower</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Ganyu_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Westward Sojourn`,
      content: `Opponents standing within the AoE of <b>Celestial Shower</b> take increased DMG. This effect strengthens over time.
      <br />Increased DMG taken begins at <span class="text-desc">5%</span> and increases by <span class="text-desc">5%</span> every <span class="text-desc">3</span>s, up to a maximum of <span class="text-desc">25%</span>.
      <br />The effect lingers for <span class="text-desc">3</span>s after the opponent leaves the AoE.`,
      image: 'UI_Talent_S_Ganyu_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `The Merciful`,
      content: `Increases the Level of <b>Trail of the Qilin</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Ganyu_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `The Clement`,
      content: `Using <b>Trail of the Qilin</b> causes the next <b class="text-genshin-cryo">Frostflake Arrow</b> shot within <span class="text-desc">30</span>s to not require charging.`,
      image: 'UI_Talent_S_Ganyu_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ganyu_a1',
      text: `A1 Enhanced Frostflake Arrow`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ganyu_a4',
      text: `A4 Cryo DMG Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ganyu_c1',
      text: `C1 Cryo RES Shred`,
      ...talents.c1,
      show: c >= 1,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'ganyu_c4',
      text: `C4 Vulnerability Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 5,
      min: 0,
      max: 5,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'ganyu_c1'), findContentById(content, 'ganyu_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'ganyu_a4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3173, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.356, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4549, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.4549, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.4825, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '6-Hit',
          value: [{ scaling: calcScaling(0.5762, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Aimed Shot',
          value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Aimed Shot Charge Level 1',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
        {
          name: 'Frostflake Arrow DMG',
          value: [{ scaling: calcScaling(1.28, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
          cr: form.ganyu_a1 ? 0.2 : 0,
        },
        {
          name: 'Frostflake Arrow Bloom DMG',
          value: [{ scaling: calcScaling(2.176, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
          cr: form.ganyu_a1 ? 0.2 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG [x2]',
          value: [{ scaling: calcScaling(1.32, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Ice Shard DMG`,
          value: [{ scaling: calcScaling(0.7027, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.ganyu_a4) base[Stats.CRYO_DMG].push({ value: 0.2, name: 'Ascension 4 Passive', source: `Self` })
      if (form.ganyu_c1) base.CRYO_RES_PEN.push({ value: 0.15, name: 'Constellation 1', source: `Self` })
      if (form.ganyu_c4)
        base.VULNERABILITY.push({ value: 0.5 * form.ganyu_a4, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.ganyu_a4) base[Stats.CRYO_DMG].push({ value: 0.2, name: 'Ascension 4 Passive', source: `Ganyu` })
      if (form.ganyu_c1) base.CRYO_RES_PEN.push({ value: 0.15, name: 'Constellation 1', source: `Ganyu` })
      if (form.ganyu_c4)
        base.VULNERABILITY.push({ value: 0.5 * form.ganyu_a4, name: 'Constellation 4', source: `Ganyu` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ganyu
