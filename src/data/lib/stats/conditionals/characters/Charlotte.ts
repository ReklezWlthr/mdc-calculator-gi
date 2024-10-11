import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Charlotte = (c: number, a: number, t: ITalentLevel, ...rest: [ITeamChar[]]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const [team] = rest
  const teamData = _.map(team, (item) => (item.cId === '10000088' ? '' : findCharacter(item.cId)?.region))
  const fontainian = _.filter(teamData, 'Fontaine').length
  const nonFontainian = _.filter(teamData).length - fontainian

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Cool-Color Capture`,
      content: `<b>Normal Attack</b>
      <br />Taking aim at targets using Monsieur Verite, her custom Kamera, Charlotte performs up to 3 consecutive attacks, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a fixed amount of Stamina, and after a moment's preparation, will deploy Monsieur Verite to deal <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the power of Cryo, Charlotte plunges toward the ground, dealing DMG to all opponents in her path and dealing <b class="text-genshin-cryo">AoE Cryo DMG</b> upon landing.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />At certain intervals, upon using a Charged Attack, Charlotte will cause a <b class="text-genshin-pneuma">Spiritbreath Thorn</b> to descend and pierce opponents, dealing <b class="text-genshin-pneuma">Pneuma</b>-aligned <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Framing: Freezing Point Composition`,
      content: `Using the keen instincts of an ace reporter, Charlotte uses her photography skills to produce different effects based on whether the ability is Tapped or Held.
      <br />
      <br /><b>Press</b>
      <br />Takes a snapshot using Monsieur Verite, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b> to opponents in front of her and applying <b class="text-genshin-cryo">Snappy Silhouette</b> to a maximum of <span class="text-desc">5</span> opponents. During this effect's duration, it will deal <b class="text-genshin-cryo">Cryo DMG</b> to affected opponents at intervals.
      <br />
      <br /><b>Hold</b>
      <br />Popping Monsieur Verite's viewfinder open, Charlotte enters <b>Composition Mode</b>, and during this time, the viewfinder will expand as you hold until you reach a Finisher Frame state. In this state, Charlotte can move and change direction freely.
      <br />When the hold state ends, Monsieur Verite will deal <b class="text-genshin-cryo">Cryo DMG</b> to all opponents locked on within the viewfinder, and apply the same <b class="text-genshin-cryo">Snappy Silhouette</b> as Tap Mode does to them. If you unleash this ability only after reaching <b>Finisher Frame</b>, you will instead apply <b class="text-genshin-cryo">Focused Impression</b>, which lasts longer and deals more DMG, although the Skill CD will be longer.
      <br /><b>Composition Mode</b> lasts a maximum of <span class="text-desc">15</span>s and allows a maximum of <span class="text-desc">5</span> opponents to be selected.
      `,
      image: 'Skill_S_Charlotte_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Still Photo: Comprehensive Confirmation`,
      content: `Condensing ice to create The Steambird's signature, Charlotte creates a <b>Newsflash Field</b> that will deal <b class="text-genshin-cryo">AoE Cryo DMG</b> and restores HP for all nearby party members based on Charlotte's ATK.
      <br />
      <br /><b>Newsflash Field</b>
      <br />- While the ability is active, Monsieur Verite will deal <b class="text-genshin-cryo">Cryo DMG</b> at intervals to opponents within its AoE.
      <br />- Will continuously restore HP to active character(s) within its AoE based on Charlotte's ATK.`,
      image: 'Skill_E_Charlotte_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Moment of Impact`,
      content: `When opponents marked by <b>Focused Impression</b> are defeated, <b>Framing: Freezing Point Composition</b>'s CD will be decreased by <span class="text-desc">2</span>s. This CD decrease can be triggered <span class="text-desc">4</span> times every <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Charlotte_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Diversified Investigation`,
      content: `When the party contains <span class="text-desc">1/2/3</span> Fontainians other than herself, Charlotte gains a <span class="text-desc">5%/10%/15%</span> Healing Bonus. When the party contains <span class="text-desc">1/2/3</span> non-Fontainians, Charlotte gains a <span class="text-desc">5%/10%/15%</span> <b class="text-genshin-cryo">Cryo DMG Bonus</b>.`,
      image: 'UI_Talent_S_Charlotte_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `First-Person Shutter`,
      content: `After activating the <b>Special Analysis Zoom Lens</b>, Charlotte's <b>Framing: Freezing Point Composition</b> Hold Mode cannot trigger its original effects, but instead enables her to take photos in a rather unique manner...`,
      image: 'UI_Talent_S_Charlotte_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `A Need to Verify Facts`,
      content: `After <b>Still Photo: Comprehensive Confirmation</b> heals a character, it will mark them with <b class="text-genshin-cryo">Verification</b>, which will heal them once every <span class="text-desc">2</span>s for <span class="text-desc">80%</span> of Charlotte's ATK. This effect lasts <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Charlotte_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `A Duty to Pursue Truth`,
      content: `When using <b>Framing: Freezing Point Composition</b>, when Monsieur Verite hits <span class="text-desc">1/2/3</span> (or more) opponents, Charlotte's own ATK will be increased by <span class="text-desc">10%/20%/30%</span> for <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Charlotte_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `An Imperative to Independence`,
      content: `Increases the <b>Still Photo: Comprehensive Confirmation</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Charlotte_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `A Responsibility to Oversee`,
      content: `When <b>Still Photo: Comprehensive Confirmation</b> hits an opponent marked by <b class="text-genshin-cryo">Snappy Silhouette</b> or <b class="text-genshin-cryo">Focused Impression</b>, it will deal <span class="text-desc">10%</span> more DMG and restore <span class="text-desc">2</span> Energy to Charlotte. This restoration can be triggered <span class="text-desc">5</span> times every <span class="text-desc">20</span>s.`,
      image: 'UI_Talent_S_Charlotte_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `A Principle of Conscience`,
      content: `Increases the Level of <b>Framing: Freezing Point Composition</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Charlotte_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `A Summation of Interest`,
      content: `When the active character's Normal and Charged Attacks hit an opponent marked by <b>Framing: Freezing Point Composition</b>'s <b class="text-genshin-cryo">Focused Impression</b>, Monsieur Verite will initiate a coordinated attack that deals <span class="text-desc">180%</span> of Charlotte's ATK as AoE Cryo DMG and heals active character(s) within the AoE for <span class="text-desc">42%</span> of Charlotte's ATK. This effect can be triggered once every <span class="text-desc">6</span>s and both DMG and healing dealt in this way will be considered as having been done by Charlotte's Elemental Burst.`,
      image: 'UI_Talent_S_Charlotte_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'verite_hit',
      text: `Skill Hit Targets`,
      ...talents.c2,
      show: c >= 2,
      min: 0,
      max: 5,
      default: 3,
    },
    {
      type: 'toggle',
      id: 'charlotte_c4',
      text: `Burst against Marked Targets`,
      ...talents.c4,
      show: c >= 4,
      default: true,
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

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4985, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.43348, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.646, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.0051, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
        {
          name: 'Spiritbreath Thorn DMG',
          value: [{ scaling: calcScaling(0.1117, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.CRYO)
      base.SKILL_SCALING = [
        {
          name: 'Photo DMG (Press)',
          value: [{ scaling: calcScaling(0.672, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Photo DMG (Hold)',
          value: [{ scaling: calcScaling(1.392, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: '"Snappy Silhouette" Mark DMG',
          value: [{ scaling: calcScaling(0.392, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: '"Focused Impression" Mark DMG',
          value: [{ scaling: calcScaling(0.406, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Cast Healing',
          value: [{ scaling: calcScaling(2.5657, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(1608, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.7762, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: form.charlotte_c4 ? 0.1 : 0,
        },
        {
          name: 'Kamera Continuous Healing',
          value: [{ scaling: calcScaling(0.0922, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(57, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Kamera DMG',
          value: [{ scaling: calcScaling(0.0647, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: form.charlotte_c4 ? 0.1 : 0,
        },
      ]

      if (a >= 4) {
        base[Stats.HEAL].push({
          value: fontainian * 0.05,
          name: 'Ascension 4 Passive',
          source: 'Self',
        })
        base[Stats.CRYO_DMG].push({
          value: nonFontainian * 0.05,
          name: 'Ascension 4 Passive',
          source: 'Self',
        })
      }

      if (c >= 1)
        base.BURST_SCALING.push({
          name: 'Verification Healing',
          value: [{ scaling: 0.8, multiplier: Stats.ATK }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.verite_hit)
        base[Stats.P_ATK].push({
          value: _.min([form.verite_hit * 0.1, 0.3]),
          name: 'Constellation 2',
          source: 'Self',
        })

      if (c >= 6)
        //Duplicate to ally when stat is fixed
        base.BASIC_SCALING.push(
          {
            name: 'Monsieur Verite C6 DMG',
            value: [{ scaling: 1.8, multiplier: Stats.ATK }],
            element: Element.CRYO,
            property: TalentProperty.BURST,
          },
          {
            name: 'Monsieur Verite C6 Healing',
            value: [{ scaling: 0.42, multiplier: Stats.ATK }],
            element: TalentProperty.HEAL,
            property: TalentProperty.HEAL,
          }
        )

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      // console.log(base)
      return base
    },
  }
}

export default Charlotte
