import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Aloy = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Rapid Fire`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, biting frost will accumulate on the arrowhead. A fully charged frost arrow will deal <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Frozen Wilds`,
      content: `Aloy throws a <b>Freeze Bomb</b> in the targeted direction that explodes on impact, dealing <b class="text-genshin-cryo">Cryo DMG</b>. After it explodes, the <b>Freeze Bomb</b> will split up into many <b><b>Chillwater Bomblet</b>s</b> that explode on contact with opponents or after a short delay, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />When a <b>Freeze Bomb</b> or <b>Chillwater Bomblet</b> hits an opponent, the opponent's ATK is decreased and Aloy receives <span class="text-desc">1</span> <b class="text-genshin-cryo">Coil</b> stack.
      <br />Aloy can gain up to <span class="text-desc">1</span> <b class="text-genshin-cryo">Coil</b> stack every <span class="text-desc">0.1</span>s.
      <br />
      <br /><b class="text-genshin-cryo">Coil</b>
      <br />- Each stack increases Aloy's Normal Attack DMG.
      <br />- When Aloy has <span class="text-desc">4</span> <b class="text-genshin-cryo">Coil</b> stacks, all stacks of <b class="text-genshin-cryo">Coil</b> are cleared. She then enters the <b class="text-genshin-cryo">Rushing Ice</b> state, which further increases the DMG dealt by her Normal Attacks and converts her Normal Attack DMG to <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />
      <br />While in the <b class="text-genshin-cryo">Rushing Ice</b> state, Aloy cannot obtain new <b class="text-genshin-cryo">Coil</b> stacks.
      <br /><b class="text-genshin-cryo">Coil</b> effects will be cleared <span class="text-desc">30</span>s after Aloy leaves the field.`,
      image: 'Skill_S_Aloy_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Prophecies of Dawn`,
      content: `Aloy throws a Power Cell filled with Cryo in the targeted direction, then detonates it with an arrow, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      `,
      image: 'Skill_E_Aloy_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Combat Override`,
      content: `When Aloy receives the <b class="text-genshin-cryo">Coil</b> effect from <b>Frozen Wilds</b>, her ATK is increased by <span class="text-desc">16%</span>, while nearby party members' ATK is increased by <span class="text-desc">8%</span>. This effect lasts <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Aloy_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Strong Strike`,
      content: `When Aloy is in the <b class="text-genshin-cryo">Rushing Ice</b> state conferred by <b>Frozen Wilds</b>, her <b class="text-genshin-cryo">Cryo DMG Bonus</b> increases by <span class="text-desc">3.5%</span> every <span class="text-desc">1</span>s. A maximum <b class="text-genshin-cryo">Cryo DMG Bonus</b> increase of <span class="text-desc">35%</span> can be gained in this way.`,
      image: 'UI_Talent_S_Aloy_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Easy Does It`,
      content: `When Aloy is in the party, animals who produce Fowl, Raw Meat, or Chilled Meat will not be startled when party members approach them.`,
      image: 'UI_Talent_S_Aloy_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Star of Another World`,
      content: `The time has not yet come for this person's corner of the night sky to light up.`,
      image: 'UI_Talent_S_Aloy_Lock',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Star of Another World`,
      content: `The time has not yet come for this person's corner of the night sky to light up.`,
      image: 'UI_Talent_S_Aloy_Lock',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Star of Another World`,
      content: `The time has not yet come for this person's corner of the night sky to light up.`,
      image: 'UI_Talent_S_Aloy_Lock',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Star of Another World`,
      content: `The time has not yet come for this person's corner of the night sky to light up.`,
      image: 'UI_Talent_S_Aloy_Lock',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Star of Another World`,
      content: `The time has not yet come for this person's corner of the night sky to light up.`,
      image: 'UI_Talent_S_Aloy_Lock',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Star of Another World`,
      content: `The time has not yet come for this person's corner of the night sky to light up.`,
      image: 'UI_Talent_S_Aloy_Lock',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'coil_stack',
      text: `Coil Stacks`,
      ...talents.skill,
      show: true,
      default: 0,
      min: 0,
      max: 3,
    },
    {
      type: 'toggle',
      id: 'rushing_ice',
      text: `Rushing Ice`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'aloy_skil_atk',
      text: `Skill ATK Reduction`,
      ...talents.skill,
      show: true,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'aloy_a1',
      text: `A1 ATK Buff`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'aloy_a4',
      text: `Second Spent in Rushing Ice`,
      ...talents.a4,
      show: a >= 4,
      default: 10,
      min: 0,
      max: 10,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'aloy_skil_atk'), findContentById(content, 'aloy_a1')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      const infusion = form.rushing_ice ? Element.CRYO : Element.PHYSICAL

      base.BASIC_SCALING = [
        {
          name: '1-Hit [1]',
          value: [{ scaling: calcScaling(0.2112, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: infusion,
          property: TalentProperty.NA,
        },
        {
          name: '1-Hit [2]',
          value: [{ scaling: calcScaling(0.2376, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: infusion,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4312, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: infusion,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.528, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: infusion,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6565, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: infusion,
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
          name: 'Fully-Charged Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Freeze Bomb DMG',
          value: [{ scaling: calcScaling(1.776, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Chillwater Bomblet DMG',
          value: [{ scaling: calcScaling(0.4, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(3.592, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.coil_stack && !form.rushing_ice) {
        if (form.coil_stack === 1)
          base.BASIC_DMG.push({
            value: calcScaling(0.0585, skill, 'elemental', '1'),
            name: 'Coil',
            source: 'Self',
          })
        if (form.coil_stack === 2)
          base.BASIC_DMG.push({
            value: calcScaling(0.1754, skill, 'elemental', '1'),
            name: 'Coil',
            source: 'Self',
          })
        if (form.coil_stack === 3)
          base.BASIC_DMG.push({
            value: calcScaling(0.0585, skill, 'elemental', '1'),
            name: 'Coil',
            source: 'Self',
          })
      }
      if (form.rushing_ice)
        base.BASIC_DMG.push({
          value: calcScaling(0.2923, skill, 'elemental', '1'),
          name: 'Rushing Ice',
          source: 'Self',
        })
      if (form.aloy_a1) base[Stats.P_ATK].push({ value: 0.16, name: 'Ascension 1 Passive', source: `Self` })
      if (form.aloy_a4)
        base[Stats.CRYO_DMG].push({ value: 0.035 * form.aloy_a4, name: 'Ascension 4 Passive', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.aloy_a1) base[Stats.P_ATK].push({ value: 0.08, name: 'Ascension 1 Passive', source: `Aloy` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Aloy
