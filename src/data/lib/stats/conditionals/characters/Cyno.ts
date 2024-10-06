import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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
      trace: `Normal Attack`,
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
      image: 'Skill_A_03',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Secret Rite: Chasmic Soulfarer`,
      content: `Performs a swift thrust, dealing <b class="text-genshin-electro">Electro DMG</b> to opponents along the path.
      <br />
      <br />When Cyno is under the <b class="text-genshin-electro">Pactsworn Pathclearer</b> state triggered by <b>Sacred Rite: Wolf's Swiftness</b>, he will instead unleash a <b>Mortuary Rite</b> that deals thunderous <b class="text-genshin-electro">AoE Electro DMG</b> and extends the duration of <b class="text-genshin-electro">Pactsworn Pathclearer</b>.
      `,
      image: 'Skill_S_Cyno_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Sacred Rite: Wolf's Swiftness`,
      content: `Calls upon a divine spirit to indwell him, morphing into the <b class="text-genshin-electro">Pactsworn Pathclearer</b>.
      <br />
      <br /><b class="text-genshin-electro">Pactsworn Pathclearer</b>
      <br />- Cyno's Normal, Charged, and Plunging Attacks will be converted to <b class="text-genshin-electro">Electro DMG</b> that cannot be overridden.
      <br />- Cyno's Elemental Mastery and resistance to interruption will increase, and he gains immunity to Electro-Charged DMG.
      <br />
      <br />This effect will be canceled when Cyno leaves the field and lasts a maximum of <span class="text-desc">18</span>s.`,
      image: 'Skill_E_Cyno_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Featherfall Judgment`,
      content: `When Cyno is in the <b class="text-genshin-electro">Pactsworn Pathclearer</b> state activated by <b>Sacred Rite: Wolf's Swiftness</b>, Cyno will enter the <b class="text-genshin-electro">Endseer</b> stance at intervals. If he activates <b>Secret Rite: Chasmic Soulfarer</b> while affected by this stance, he will activate the <b class="text-genshin-electro">Judication</b> effect, increasing the DMG of this <b>Secret Rite: Chasmic Soulfarer</b> by <span class="text-desc">35%</span>, and firing off <span class="text-desc">3</span> <b class="text-genshin-electro">Duststalker Bolts</b> that deal <span class="text-desc">100%</span> of Cyno's ATK as <b class="text-genshin-electro">Electro DMG</b>.
      <br /><b class="text-genshin-electro">Duststalker Bolt</b> DMG is considered Elemental Skill DMG.`,
      image: 'UI_Talent_S_Cyno_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Authority Over the Nine Bows	`,
      content: `Cyno's DMG values will be increased based on his Elemental Mastery as follows:
      <br />- <b class="text-genshin-electro">Pactsworn Pathclearer</b>'s Normal Attack DMG is increased by <span class="text-desc">150%</span> of his Elemental Mastery.
      <br />- <b class="text-genshin-electro">Duststalker Bolt</b> DMG from his Passive Talent <b>Featherfall Judgment</b> is increased by <span class="text-desc">250%</span> of his Elemental Mastery.`,
      image: 'UI_Talent_S_Cyno_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Gift of Silence`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on an Sumeru Expedition for <span class="text-desc">20</span> hours.`,
      image: 'UI_Talent_S_Cyno_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Ordinance: Unceasing Vigil`,
      content: `After using <b>Sacred Rite: Wolf's Swiftness</b>, Cyno's Normal Attack SPD will be increased by <span class="text-desc">20%</span> for <span class="text-desc">10</span>s. If the <b class="text-genshin-electro">Judication</b> effect of his Passive Talent <b>Featherfall Judgment</b> is triggered during <b>Secret Rite: Chasmic Soulfarer</b>, the duration of this increase will be refreshed.
      <br />You need to unlock the Passive Talent <b>Featherfall Judgement</b>.`,
      image: 'UI_Talent_S_Cyno_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Ceremony: Homecoming of Spirits`,
      content: `When Cyno's Normal Attacks hit opponents, his <b class="text-genshin-electro">Electro DMG Bonus</b> will increase by <span class="text-desc">10%</span> for <span class="text-desc">4</span>s. This effect can be triggered once every <span class="text-desc">0.1</span>s. Max <span class="text-desc">5</span> stacks.`,
      image: 'UI_Talent_S_Cyno_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Precept: Lawful Enforcer`,
      content: `Increases the Level of <b>Sacred Rite: Wolf's Swiftness</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Cyno_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Austerity: Forbidding Guard`,
      content: `When Cyno is in the <b class="text-genshin-electro">Pactsworn Pathclearer</b> state triggered by <b>Sacred Rite: Wolf's Swiftness</b>, after he triggers Electro-Charged, Superconduct, Overloaded, Quicken, Aggravate, Hyperbloom, or an Electro Swirl reaction, he will restore <span class="text-desc">3</span> Elemental Energy for all nearby party members (except himself.)
      <br />This effect can occur <span class="text-desc">5</span> times within one use of <b>Sacred Rite: Wolf's Swiftness</b>.`,
      image: 'UI_Talent_S_Cyno_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Funerary Rite: The Passing of Starlight`,
      content: `Increases the Level of <b>Secret Rite: Chasmic Soulfarer</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Cyno_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Raiment: Just Scales`,
      content: `After using <b>Sacred Rite: Wolf's Swiftness</b> or triggering the <b class="text-genshin-electro">Judication</b> effect of the Passive Talent <b>Featherfall Judgment</b>, Cyno will gain <span class="text-desc">4</span> stacks of the <b class="text-genshin-electro">Day of the Jackal</b> effect. When he hits opponents with Normal Attacks, he will consume <span class="text-desc">1</span> stack of <b class="text-genshin-electro">Day of the Jackal</b> to fire off one <b class="text-genshin-electro">Duststalker Bolt</b>.
      <br /><b class="text-genshin-electro">Day of the Jackal</b> lasts for <span class="text-desc">8</span>s. Max <span class="text-desc">8</span> stacks. It will be canceled once <b class="text-genshin-electro">Pactsworn Pathclearer</b> ends.
      <br />A maximum of <span class="text-desc">1</span> <b class="text-genshin-electro">Duststalker Bolt</b> can be unleashed this way every <span class="text-desc">0.4</span>s.
      <br />You must first unlock the Passive Talent <b>Featherfall Judgment</b>.`,
      image: 'UI_Talent_S_Cyno_04',
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
    allyContent: [],
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
        base[Stats.EM].push({ value: 100, name: 'Pactsworn Pathclearer', source: `Self` })
        base.infuse(Element.ELECTRO, true)

        if (a >= 1)
          base.SKILL_SCALING.push({
            name: 'Duststalker Bolt DMG',
            value: [{ scaling: 1, multiplier: Stats.ATK }, ...a4Dust],
            element: Element.ELECTRO,
            property: TalentProperty.SKILL,
          })

        if (c >= 1) base.ATK_SPD.push({ value: 0.2, name: '', source: `` })
      }

      if (form.cyno_c2)
        base[Stats.ELECTRO_DMG].push({
          value: form.cyno_c2 * 0.1,
          name: 'Constellation 2',
          source: 'Self',
        })

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
