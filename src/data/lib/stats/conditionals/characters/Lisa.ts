import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Lisa = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Lightning Touch`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 lightning attacks that deal <b class="text-genshin-electro">Electro DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-electro">AoE Electro DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the might of Electro, Lisa plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-electro">AoE Electro DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      title: `Violet Arc`,
      content: `Channels the power of lightning to sweep bothersome matters away.
      <br />
      <br /><b>Press</b>
      <br />Releases a homing Lightning Orb.
      <br />On hit, it deals <b class="text-genshin-electro">Electro DMG</b> and applies a stack of the Conductive status (max <span class="text-yellow">3</span> stacks) to opponents in a small AoE.
      <br />
      <br /><b>Hold</b>
      <br />After an extended casting time, calls down lightning from the heavens, dealing massive <b class="text-genshin-electro">Electro DMG</b> to all nearby opponents.
      <br />Deals great amounts of extra damage to opponents based on the number of Conductive stacks applied to them, and clears their Conductive status.
      `,
    },
    burst: {
      title: `Lightning Rose`,
      content: `Summons a Lightning Rose that unleashes powerful lightning bolts, launching surrounding opponents and dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />The Lightning Rose will continuously emit lightning to knock back opponents and deal <b class="text-genshin-electro">Electro DMG</b> throughout the ability's duration.`,
    },
    a1: {
      title: `A1: Induced Aftershock`,
      content: `Hits by Charged Attacks apply Violet Arc's Conductive status to opponents.`,
    },
    a4: {
      title: `A4: Static Electricity Field`,
      content: `Opponents hit by Lightning Rose have their DEF decreased by <span class="text-yellow">15%</span> for <span class="text-yellow">10</span>s.`,
    },
    c1: {
      title: `C1: Infinite Circuit`,
      content: `Lisa regenerates <span class="text-yellow">2</span> Energy for every opponent hit while holding Violet Arc.
      <br />A maximum of <span class="text-yellow">10</span> Energy can be regenerated in this manner at any one time.`,
    },
    c2: {
      title: `C2: Electromagnetic Field`,
      content: `Holding Violet Arc has the following effects:
      <br />- Increases DEF by <span class="text-yellow">25%</span>.
      <br />- Increases Lisa's resistance to interruption.`,
    },
    c3: {
      title: `C3: Resonant Thunder`,
      content: `Increases the Level of Lightning Rose by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Plasma Eruption`,
      content: `Lightning Rose now unleashes 1-3 lightning bolts when it attacks.`,
    },
    c5: {
      title: `C5: Electrocute`,
      content: `Increases the Level of Violet Arc by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: Pulsating Witch`,
      content: `When Lisa takes the field, she applies 3<span class="text-yellow">3</span> stacks of Violet Arc's Conductive status onto nearby opponents.
      <br />This effect can only occur once every <span class="text-yellow">5</span>s.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'lisa_c2',
      text: `Violet Arc Hold`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'lisa_a4',
      text: `A4 DEF Shred`,
      ...talents.a4,
      show: a >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'lisa_a4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.396, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3592, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.428, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5496, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.5736, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.CA,
          bonus: form.klee_a1 ? 0.5 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ELECTRO)
      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(0.8, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Non-Conductive Hold DMG',
          value: [{ scaling: calcScaling(3.2, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Stack 1 Conductive Hold DMG',
          value: [{ scaling: calcScaling(3.68, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Stack 2 Conductive Hold DMG',
          value: [{ scaling: calcScaling(4.24, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Stack 3 Conductive Hold DMG',
          value: [{ scaling: calcScaling(4.872, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Discharge DMG`,
          value: [{ scaling: calcScaling(0.3656, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.lisa_a4) base.DEF_REDUCTION += 0.15
      if (form.lisa_c2) base[Stats.DEF] += 0.25

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.lisa_a4) base.DEF_REDUCTION += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Lisa
