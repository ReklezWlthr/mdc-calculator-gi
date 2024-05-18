import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Cyno = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Invoker's Spear`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Secret Rite: Chasmic Soulfarer`,
      content: `Performs a swift thrust, dealing <b class="text-genshin-electro">Electro DMG</b> to opponents along the path.
      <br />
      <br />When Cyno is under the Pathsworn Pathclearer state triggered by Sacred Rite: Wolf's Swiftness, he will instead unleash a Mortuary Rite that deals thunderous <b class="text-genshin-electro">AoE Electro DMG</b> and extends the duration of Pathsworn Pathclearer.
      `,
    },
    burst: {
      title: `Sacred Rite: Wolf's Swiftness`,
      content: `Calls upon a divine spirit to indwell him, morphing into the Pactsworn Pathclearer.
      <br />
      <br /><b>Pactsworn Pathclearer</b>
      <br />Cyno's Normal, Charged, and Plunging Attacks will be converted to <b class="text-genshin-electro">Electro DMG</b> that cannot be overridden.
      <br />- Cyno's Elemental Mastery and resistance to interruption will increase, and he gains immunity to Electro-Charged DMG.
      <br />
      <br />This effect will be canceled when Cyno leaves the field and lasts a maximum of <span class="text-desc">18</span>s.`,
    },
    a1: {
      title: `A1: Featherfall Judgment`,
      content: `When Cyno is in the Pactsworn Pathclearer state activated by Sacred Rite: Wolf's Swiftness, Cyno will enter the Endseer stance at intervals. If he activates Secret Rite: Chasmic Soulfarer while affected by this stance, he will activate the Judication effect, increasing the DMG of this Secret Rite: Chasmic Soulfarer by <span class="text-desc">35%</span>, and firing off 3 Duststalker Bolts that deal <span class="text-desc">100%</span> of Cyno's ATK as <b class="text-genshin-electro">Electro DMG</b>.
      <br />Duststalker Bolt DMG is considered Elemental Skill DMG.`,
    },
    a4: {
      title: `A4: Authority Over the Nine Bows	`,
      content: `Cyno's DMG values will be increased based on his Elemental Mastery as follows:
      <br />Pactsworn Pathclearer's Normal Attack DMG is increased by <span class="text-desc">150%</span> of his Elemental Mastery.
      <br />Duststalker Bolt DMG from his Passive Talent Featherfall Judgment is increased by <span class="text-desc">250%</span> of his Elemental Mastery.`,
    },
    c1: {
      title: `C1: Ordinance: Unceasing Vigil`,
      content: `After using Sacred Rite: Wolf's Swiftness, Cyno's Normal Attack SPD will be increased by <span class="text-desc">20%</span> for <span class="text-desc">10</span>s. If the Judication effect of his Passive Talent Featherfall Judgment is triggered during Secret Rite: Chasmic Soulfarer, the duration of this increase will be refreshed.
      <br />You need to unlock the Passive Talent "Featherfall Judgement."`,
    },
    c2: {
      title: `C2: Ceremony: Homecoming of Spirits`,
      content: `When Cyno's Normal Attacks hit opponents, his <b class="text-genshin-electro">Electro DMG Bonus</b> will increase by <span class="text-desc">10%</span> for <span class="text-desc">4</span>s. This effect can be triggered once every <span class="text-desc">0.1</span>s. Max <span class="text-desc">5</span> stacks.`,
    },
    c3: {
      title: `C3: Precept: Lawful Enforcer`,
      content: `Increases the Level of Sacred Rite: Wolf's Swiftness by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Austerity: Forbidding Guard`,
      content: `When Cyno is in the Pactsworn Pathclearer state triggered by Sacred Rite: Wolf's Swiftness, after he triggers Electro-Charged, Superconduct, Overloaded, Quicken, Aggravate, Hyperbloom, or an Electro Swirl reaction, he will restore <span class="text-desc">3</span> Elemental Energy for all nearby party members (except himself.)
      <br />This effect can occur <span class="text-desc">5</span> times within one use of Sacred Rite: Wolf's Swiftness.`,
    },
    c5: {
      title: `C5: Funerary Rite: The Passing of Starlight`,
      content: `Increases the Level of Secret Rite: Chasmic Soulfarer by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Raiment: Just Scales`,
      content: `After using Sacred Rite: Wolf's Swiftness or triggering the Judication effect of the Passive Talent "Featherfall Judgment," Cyno will gain <span class="text-desc">4</span> stacks of the "Day of the Jackal" effect. When he hits opponents with Normal Attacks, he will consume 1 stack of "Day of the Jackal" to fire off one Duststalker Bolt.
      <br />"Day of the Jackal" lasts for <span class="text-desc">8</span>s. Max <span class="text-desc">8</span> stacks. It will be canceled once Pactsworn Pathclearer ends.
      <br />A maximum of <span class="text-desc">1</span> Duststalker Bolt can be unleashed this way every 0.4s.
      <br />You must first unlock the Passive Talent "Featherfall Judgment."`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'cyno_burst',
      text: `Pactsworn Pathclearer`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'judication',
      text: `Judication`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'cyno_c2',
      text: `C2 Normal Attack Hit`,
      ...talents.c2,
      show: c >= 2,
      default: 0,
      min: 0,
      max: 5,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'candace_burst')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      const a4Na = a >= 4 ? [{ scaling: 1.5, multiplier: Stats.EM }] : []
      const a4Dust = a >= 4 ? [{ scaling: 2.5, multiplier: Stats.EM }] : []

      base.BASIC_SCALING = form.cyno_burst
        ? [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.7828, burst, 'physical', '1'), multiplier: Stats.ATK }, ...a4Na],
              element: Element.ELECTRO,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.8247, burst, 'physical', '1'), multiplier: Stats.ATK }, ...a4Na],
              element: Element.ELECTRO,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(1.0463, burst, 'physical', '1'), multiplier: Stats.ATK }, ...a4Na],
              element: Element.ELECTRO,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit [x2]',
              value: [{ scaling: calcScaling(0.5169, burst, 'physical', '1'), multiplier: Stats.ATK }, ...a4Na],
              element: Element.ELECTRO,
              property: TalentProperty.NA,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(1.3084, burst, 'physical', '1'), multiplier: Stats.ATK }, ...a4Na],
              element: Element.ELECTRO,
              property: TalentProperty.NA,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.4926, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.4792, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit [x2]',
              value: [{ scaling: calcScaling(0.2931, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.7589, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = [
        form.cyno_burst
          ? {
              name: 'Charged Attack DMG',
              value: [{ scaling: calcScaling(1.0105, burst, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.ELECTRO,
              property: TalentProperty.CA,
            }
          : {
              name: 'Charged Attack DMG',
              value: [{ scaling: calcScaling(1.2238, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
      ]
      base.PLUNGE_SCALING = getPlungeScaling(
        'base',
        form.cyno_burst ? burst : normal,
        form.cyno_burst ? Element.ELECTRO : Element.PHYSICAL
      )
      base.SKILL_SCALING = form.cyno_burst
        ? [
            {
              name: 'Mortuary Rite DMG',
              value: [{ scaling: calcScaling(1.568, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.ELECTRO,
              property: TalentProperty.SKILL,
              bonus: form.judication ? 0.35 : 0,
            },
          ]
        : [
            {
              name: 'Skill DMG',
              value: [{ scaling: calcScaling(1.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.ELECTRO,
              property: TalentProperty.SKILL,
            },
          ]

      if (form.cyno_burst) {
        base[Stats.EM] += 100
        base.infuse(Element.ELECTRO, true)

        base.SKILL_SCALING.push({
          name: 'Duststalker Bolt DMG',
          value: [{ scaling: 1, multiplier: Stats.ATK }, ...a4Dust],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        })

        if (c >= 1) base.ATK_SPD += 0.2
      }

      if (form.cyno_c2) base[Stats.ELECTRO_DMG] += form.cyno_c2 * 0.1

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

export default Cyno
