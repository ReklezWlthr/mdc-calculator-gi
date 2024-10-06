import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Alhaitham = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Abductive Reasoning`,
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
      title: `Universality: An Elaboration on Form`,
      content: `Rushes forward, dealing <b class="text-genshin-dendro">Dendro DMG</b> to nearby opponents when the rush ends, causing a <b class="text-genshin-dendro">Chisel-Light Mirror</b> to form.
      <br />Holding this skill will cause it to behave differently.
      <br />
      <br /><b>Hold</b>
      <br />Enters Aiming Mode to adjust the direction of Alhaitham's rush attack.
      <br />
      <br /><b class="text-genshin-dendro">Chisel-Light Mirror</b>
      <br />When this skill is unleashed, Alhaitham will generate <span class="text-desc">1</span> <b class="text-genshin-dendro">Chisel-Light Mirror</b>. If there are no <b class="text-genshin-dendro">Mirrors</b> at this time, he will generate <span class="text-desc">1</span> additional <b class="text-genshin-dendro">Mirror</b>. <b class="text-genshin-dendro">Chisel-Light Mirrors</b> will have the following properties:
      <br />- When he possesses <b class="text-genshin-dendro">Chisel-Light Mirrors</b>, Alhaitham's Normal, Charged, and Plunging Attacks will be converted to <b class="text-genshin-dendro">Dendro DMG</b>. This cannot be overridden.
      <br />- When attacks of the aforementioned kinds hit opponents, the <b class="text-genshin-dendro">Chisel-Light Mirrors</b> will unleash a <b>Projection Attack</b> that deals <b class="text-genshin-dendro">AoE Dendro DMG</b> based on the number of <b class="text-genshin-dendro">Mirrors</b> on the field.
      <br />- A total of <span class="text-desc">3</span> <b class="text-genshin-dendro">Chisel-Light Mirrors</b> can exist at once.
      <br />- The <b class="text-genshin-dendro">Chisel-Light Mirrors</b> will disappear one after the other over time, and will all disappear when Alhaitham leaves the field.
      `,
      image: 'Skill_S_Alhatham_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Particular Field: Fetters of Phenomena`,
      content: `Creates a <b>Particular Binding Field</b> and deals multiple instances of <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />If <b class="text-genshin-dendro">Chisel-Light Mirrors</b> exist when this ability is unleashed, all such <b class="text-genshin-dendro">Mirrors</b> will be consumed and increase the number of DMG instances dealt.
      <br /><span class="text-desc">2</span>s after this ability is unleashed, if <span class="text-desc">0/1/2/3</span> <b class="text-genshin-dendro">Mirrors</b> were consumed, Alhaitham will generate <span class="text-desc">3/2/1/0</span> new <b class="text-genshin-dendro">Mirrors</b> in turn.`,
      image: 'Skill_E_Alhatham_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Four-Causal Correction`,
      content: `When Alhaitham's Charged or Plunging Attacks hit opponents, they will generate <span class="text-desc">1/3</span> <b class="text-genshin-dendro">Chisel-Light Mirror</b>. This effect can be triggered once every <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Alhatham_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Mysteries Laid Bare`,
      content: `Each point of Alhaitham's Elemental Mastery will increase the DMG dealt by <b>Projection Attacks</b> and <b>Particular Field: Fetters of Phenomena</b> by <span class="text-desc">0.1%</span>.
      <br />The maximum DMG increase this way for both these abilities is <span class="text-desc">100%</span>.`,
      value: [
        {
          name: 'Current DMG Bonus',
          value: { stat: Stats.EM, scaling: (em) => toPercentage(_.min([em * 0.001, 1])) },
        },
      ],
      image: 'UI_Talent_S_Alhatham_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: 'Law of Reductive Overdetermination',
      content: `When Alhaitham crafts Weapon Ascension Materials, he has a <span class="text-desc">10%</span> chance to receive double the product.`,
      image: 'UI_Talent_S_Alhatham_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Intuition`,
      content: `When a <b>Projection Attack</b> hits an opponent, <b>Universality: An Elaboration on Form</b>'s CD is decreased by <span class="text-desc">1.2</span>s. This effect can be triggered once every <span class="text-desc">1</span>s.`,
      image: 'UI_Talent_S_Alhatham_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Debate`,
      content: `When Alhaitham generates a <b class="text-genshin-dendro">Chisel-Light Mirror</b>, his Elemental Mastery will be increased by <span class="text-desc">50</span> for <span class="text-desc">8</span> seconds, max <span class="text-desc">4</span> stacks. Each stack's duration is counted independently. This effect can be triggered even when the maximum number of <b class="text-genshin-dendro">Chisel-Light Mirrors</b> has been reached.`,
      image: 'UI_Talent_S_Alhatham_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Negation`,
      content: `Increases the Level of <b>Universality: An Elaboration on Form</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Alhatham_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Elucidation`,
      content: `When <b>Particular Field: Fetters of Phenomena</b> is unleashed, the following effects will become active based on the number of <b class="text-genshin-dendro">Chisel-Light Mirrors</b> consumed and created this time around:
      <br />- Each <b class="text-genshin-dendro">Mirror</b> consumed will increase the Elemental Mastery of all other nearby party members by <span class="text-desc">30</span> for <span class="text-desc">15</span>s.
      <br />- Each <b class="text-genshin-dendro">Mirror</b> generated will grant Alhaitham a <span class="text-desc">10%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b> for <span class="text-desc">15</span>s.
      <br />
      <br />The pre-existing duration of the aforementioned effects will be cleared if you use Particular Field: Fetters of Phenomena again while they are in effect.
      `,
      image: 'UI_Talent_S_Alhatham_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Sagacity`,
      content: `Increases the Level of <b>Particular Field: Fetters of Phenomena</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Alhatham_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Structuration`,
      content: `Alhaitham gains the following effects:
      <br />- <span class="text-desc">2</span> seconds after <b>Particular Field: Fetters of Phenomena</b> is unleashed, he will generate <span class="text-desc">3</span> <b class="text-genshin-dendro">Chisel-Light Mirrors</b> regardless of the number of <b class="text-genshin-dendro">Mirrors</b> consumed.
      <br />- If Alhaitham generates <b class="text-genshin-dendro">Chisel-Light Mirrors</b> when their numbers have already maxed out, his CRIT Rate and CRIT DMG will increase by <span class="text-desc">10%</span> and <span class="text-desc">70%</span> respectively for <span class="text-desc">6</span>s. If this effect is triggered again during its initial duration, the duration remaining will be increased by <span class="text-desc">6</span>s.
      `,
      image: 'UI_Talent_S_Alhatham_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'al_infusion',
      text: `Mirror Infusion`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'al_c2Em',
      text: `C2 EM Stacks`,
      ...talents.c2,
      show: c >= 2,
      min: 0,
      max: 4,
      default: 4,
    },
    {
      type: 'number',
      id: 'al_c4Em',
      text: `C4 Mirror Consumed`,
      ...talents.c4,
      show: c >= 4,
      min: 0,
      max: 3,
      default: 0,
    },
    {
      type: 'number',
      id: 'al_c4Dmg',
      text: `C4 Mirror Gained`,
      ...talents.c4,
      show: c >= 4,
      min: 0,
      max: 3,
      default: 3,
    },
    {
      type: 'toggle',
      id: 'c6_crit',
      text: `C6 Max Mirror Refresh`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'yaoyaoC1')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      if (form.al_infusion) base.infuse(Element.DENDRO, true)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4953, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.5075, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.3418, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6677, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.8385, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack [x2]',
          value: [{ scaling: calcScaling(0.5525, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Rush Attack DMG',
          value: [
            { scaling: calcScaling(1.936, skill, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(1.5488, skill, 'elemental', '1'), multiplier: Stats.EM },
          ],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]

      if (form.al_c2Em > 0) base[Stats.EM].push({ value: 50, name: '', source: `` }) * form.al_c2Em
      if (form.al_c4Em > 0) base[Stats.EM].push({ value: 30, name: '', source: `` }) * form.al_c4Em
      if (form.al_c4Dmg > 0) base[Stats.DENDRO_DMG].push({ value: 0.1, name: '', source: `` }) * form.al_c4Dmg
      if (form.c6_crit) {
        base[Stats.CRIT_RATE].push({ value: 0.1, name: '', source: `` })
        base[Stats.CRIT_DMG].push({ value: 0.7, name: '', source: `` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      base.SKILL_SCALING.push({
        name: 'DMG Per Mirror Projection',
        value: [
          { scaling: calcScaling(0.672, skill, 'elemental', '1'), multiplier: Stats.ATK },
          { scaling: calcScaling(1.344, skill, 'elemental', '1'), multiplier: Stats.EM },
        ],
        bonus: a >= 4 ? _.min([base.getEM() * 0.001, 1]) : 0,
        element: Element.DENDRO,
        property: TalentProperty.SKILL,
      })

      base.BURST_SCALING = [
        {
          name: 'Single-Instance DMG',
          value: [
            { scaling: calcScaling(1.216, burst, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(0.9728, burst, 'elemental', '1'), multiplier: Stats.EM },
          ],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
          bonus: a >= 4 ? _.min([base.getEM() * 0.001, 1]) : 0,
        },
      ]

      return base
    },
  }
}

export default Alhaitham
