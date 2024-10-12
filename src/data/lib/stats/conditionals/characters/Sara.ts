import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Sara = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Tengu Bowmanship`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Perform a more precise Aimed Shot with increased DMG.
      <br />While aiming, crackling lightning will accumulate on the arrowhead. An arrow fully charged with the storm's might will deal <b class="text-genshin-electro">Electro DMG</b>.
      <br />When in the <b class="text-violet-400">Crowfeather Cover</b> state, a fully-charged arrow will leave a <b class="text-genshin-electro">Crowfeather</b> behind after it hits.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Tengu Stormcall`,
      content: `Retreats rapidly with the speed of a tengu, summoning the protection of the Crowfeather.
      <br />Gains <b class="text-violet-400">Crowfeather Cover</b> for <span class="text-desc">18</span>s, and when Kujou Sara fires a fully-charged Aimed Shot, <b class="text-violet-400">Crowfeather Cover</b> will be consumed, and will leave a <b class="text-genshin-electro">Crowfeather</b> at the target location.
      <br /><b class="text-genshin-electro">Crowfeathers</b> will trigger <b>Tengu Juurai: Ambush</b> after a short time, dealing <b class="text-genshin-electro">Electro DMG</b> and granting the active character within its AoE an ATK Bonus based on Kujou Sara's Base ATK.
      <br />
      <br />The ATK Bonuses from different <b>Tengu Juurai</b> will not stack, and their effects and duration will be determined by the last <b>Tengu Juurai</b> to take effect.`,
      image: 'Skill_S_Sara_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Subjugation: Koukou Sendou`,
      content: `Casts down <b>Tengu Juurai: Titanbreaker</b>, dealing <b class="text-genshin-electro">AoE Electro DMG</b>. Afterwards, <b>Tengu Juurai: Titanbreaker</b> spreads out into 4 consecutive bouts of <b>Tengu Juurai: Stormcluster</b>, dealing <b class="text-genshin-electro">AoE Electro DMG</b>.
      <br /><b>Tengu Juurai: Titanbreaker</b> and <b>Tengu Juurai: Stormcluster</b> can provide the active character within their AoE with the same ATK Bonus as given by the Elemental Skill, <b>Tengu Stormcall</b>.
      <br />
      <br />The ATK Bonus provided by various kinds of <b>Tengu Juurai</b> will not stack, and their effects and duration will be determined by the last <b>Tengu Juurai</b> to take effect.
      `,
      image: 'Skill_E_Sara_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Immovable Will`,
      content: `While in the <b class="text-violet-400">Crowfeather Cover</b> state provided by <b>Tengu Stormcall</b>, Aimed Shot charge times are decreased by <span class="text-desc">60%</span>.`,
      image: 'UI_Talent_S_Sara_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Decorum`,
      content: `When <b>Tengu Juurai: Ambush</b> hits opponents, Kujou Sara will restore <span class="text-desc">1.2</span> Energy to all party members for every <span class="text-desc">100%</span> Energy Recharge she has. This effect can be triggered once every <span class="text-desc">3</span>s.`,
      value: [{ name: 'Energy Restoration', value: { stat: Stats.ER, scaling: (er) => 1.2 * _.floor(er) } }],
      image: 'UI_Talent_S_Sara_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Land Survey`,
      content: `When dispatched on an expedition in Inazuma, time consumed is reduced by <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_S_Sara_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Crow's Eye`,
      content: `When <b>Tengu Juurai</b> grant characters ATK Bonuses or hits opponents, the CD of <b>Tengu Stormcall</b> is decreased by <span class="text-desc">1</span>s.
      <br />This effect can be triggered once every <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Sara_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Dark Wings`,
      content: `Unleashing <b>Tengu Stormcall</b> will leave a weaker <b class="text-genshin-electro">Crowfeather</b> at Kujou Sara's original position that will deal <span class="text-desc">30%</span> of its original DMG.`,
      image: 'UI_Talent_S_Sara_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `The War Within`,
      content: `Increases the Level of <b>Subjugation: Koukou Sendou</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sara_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Conclusive Proof`,
      content: `The number of <b>Tengu Juurai: Stormcluster</b> released by <b>Subjugation: Koukou Sendou</b> is increased to <span class="text-desc">6</span>.`,
      image: 'UI_Talent_S_Sara_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Spellsinger`,
      content: `Increases the Level of <b>Tengu Stormcall</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sara_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Sin of Pride`,
      content: `The <b class="text-genshin-electro">Electro DMG</b> of characters who have had their ATK increased by <b>Tengu Juurai</b> has its Crit DMG increased by <span class="text-desc">60%</span>.`,
      image: 'UI_Talent_S_Sara_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'sara_atk',
      text: `Tengu Juurai ATK Buff`,
      ...talents.skill,
      show: true,
      default: false,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'sara_atk')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.369, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.387, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.485, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.504, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.581, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          name: 'Fully-Charged Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Tengu Juurai: Ambush DMG',
          value: [{ scaling: calcScaling(1.258, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Tengu Juurai: Titanbreaker DMG`,
          value: [{ scaling: calcScaling(4.096, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Tengu Juurai: Stormcluster DMG [x${c >= 4 ? 6 : 4}]`,
          value: [{ scaling: calcScaling(0.341, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Lesser Tengu Juurai: Ambush DMG',
          value: [{ scaling: calcScaling(1.258, skill, 'elemental', '1') * 0.3, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        })

      if (form.sara_atk) {
        base[Stats.ATK].push({
          value: calcScaling(0.43, skill, 'elemental', '1') * base.BASE_ATK,
          name: 'Tengu Juurai',
          source: 'Self',
          base: base.BASE_ATK,
          multiplier: calcScaling(0.43, skill, 'elemental', '1'),
        })
        if (c >= 6) base.ELECTRO_CD.push({ value: 0.6, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.sara_atk) {
        base[Stats.ATK].push({
          value: calcScaling(0.43, skill, 'elemental', '1') * own.BASE_ATK,
          name: 'Tengu Juurai',
          source: 'Kujou Sara',
          base: own.BASE_ATK,
          multiplier: calcScaling(0.43, skill, 'elemental', '1'),
        })
        if (c >= 6) base.ELECTRO_CD.push({ value: 0.6, name: 'Constellation 6', source: `Kujou Sara` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Sara
