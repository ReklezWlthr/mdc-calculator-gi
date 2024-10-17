import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Yelan = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const uniqueCount = _.uniq(teamData).length

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Stealthy Bowshot`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, flowing water will accumulate on the arrowhead. A fully charged torrential arrow will deal <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b class="text-genshin-hydro">Breakthrough</b>
      <br />Yelan will enter a <b class="text-genshin-hydro">Breakthrough</b> state after spending <span class="text-desc">5</span>s out of combat, which will cause her next Charged Aimed Shot to have <span class="text-desc">80%</span> decreased charge time, and once charged, she can fire a <b>Breakthrough Barb</b> that will <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Yelan's Max HP.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Lingering Lifeline`,
      content: `Fires off a <b>Lifeline</b> that allows her to move rapidly, entangling and marking opponents along its path.
      <br />When this rapid movement ends, the <b>Lifeline</b> will explode, dealing <b class="text-genshin-hydro">Hydro DMG</b> to the marked opponents based on Yelan's Max HP.
      <br />
      <br /><b>Press</b>
      <br />Moves a certain distance forward swiftly.
      <br />
      <br /><b>Hold</b>
      <br />Engages in continuous, swift movement, during which Yelan's resistance to interruption is increased.
      <br />During this time, Yelan can control this rapid movement and end it by using this Skill again.
      <br />
      <br />Additionally, each opponent marked by the <b>Lifeline</b> when it explodes grants Yelan a <span class="text-desc">34%</span> chance to reset her <b class="text-genshin-hydro">Breakthrough</b> state.`,
      image: 'Skill_S_Yelan_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Depth-Clarion Dice`,
      content: `Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> and creates an <b class="text-blue">Exquisite Throw</b>, which aids her in battle.
      <br />
      <br /><b class="text-blue">Exquisite Throw</b>
      <br />Follows the character around and will initiate a coordinated attack under the following circumstances, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on Yelan's Max HP:
      <br />- Can occur once every second when your active character uses a Normal Attack.
      <br />- Will occur each time Yelan's Lifeline explodes and hits opponents.
      `,
      image: 'Skill_E_Yelan_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Turn Control`,
      content: `When the party has <span class="text-desc">1/2/3/4</span> <b>Elemental Types</b>, Yelan's Max HP is increased by <span class="text-desc">6%/12%/18%/30%</span>.`,
      image: 'UI_Talent_S_Yelan_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Adapt With Ease`,
      content: `So long as an <b class="text-blue">Exquisite Throw</b> is in play, your own active character deals <span class="text-desc">1%</span> more DMG. This increases by a further <span class="text-desc">3.5%</span> DMG every second. The maximum increase to DMG dealt is <span class="text-desc">50%</span>.
      <br />The pre-existing effect will be dispelled if <b>Depth-Clarion Dice</b> is recast during its duration.`,
      image: 'UI_Talent_S_Yelan_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Necessary Calculation`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on a Liyue Expedition for <span class="text-desc">20</span> hours.`,
      image: 'UI_Talent_Expedition_Liyue',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Enter the Plotters`,
      content: `<b>Lingering Lifeline</b> gains <span class="text-desc">1</span> additional charge.`,
      image: 'UI_Talent_S_Yelan_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Taking All Comers`,
      content: `When <b class="text-blue">Exquisite Throw</b> conducts a coordinated attack, it will fire an additional water arrow that will deal <span class="text-desc">14%</span> of Yelan's Max HP as <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />This effect can trigger once every <span class="text-desc">1.8</span>s.`,
      image: 'UI_Talent_S_Yelan_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Beware the Trickster's Dice`,
      content: `Increases the Level of <b>Depth-Clarion Dice</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yelan_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Bait-and-Switch`,
      content: `Increases all party members' Max HP by <span class="text-desc">10%</span> for <span class="text-desc">25</span>s for every opponent marked by <b>Lifeline</b> when the <b>Lifeline</b> explodes. A maximum increase of <span class="text-desc">40%</span> Max HP can be attained in this manner.`,
      image: 'UI_Talent_S_Yelan_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Dealer's Sleight`,
      content: `Increases the Level of <b>Lingering Lifeline</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yelan_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Winner Takes All`,
      content: `After using <b>Depth-Clarion Dice</b>, Yelan will enter the <b class="text-desc">Mastermind</b> state.
      <br />In this state, all of Yelan's Normal Attacks will be special <b>Breakthrough Barbs</b>. These <b>Breakthrough Barbs</b> will have similar abilities to normal ones and the DMG dealt will be considered Charged Attack DMG, dealing <span class="text-desc">156%</span> of a normal <b>Breakthrough Barb</b>'s DMG.
      <br />
      <br />The <b class="text-desc">Mastermind</b> state lasts <span class="text-desc">20</span>s and will be cleared after Yelan fires <span class="text-desc">5</span> arrows.`,
      image: 'UI_Talent_S_Yelan_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'yelan_a4',
      text: `Exquisite Throw Duration`,
      ...talents.a4,
      show: a >= 4,
      default: 14,
      min: 0,
      max: 14,
    },
    {
      type: 'number',
      id: 'yelan_c4',
      text: `Enemies marked by Lifeline`,
      ...talents.c4,
      show: c >= 4,
      default: 4,
      min: 0,
      max: 4,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'yelan_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'yelan_a4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4068, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3904, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.516, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.3251, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
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
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Breakthrough Barb DMG',
          value: [{ scaling: calcScaling(0.1158, normal, 'elemental', '1_alt'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.2261, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(0.0731, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Exquisite Throw DMG`,
          value: [{ scaling: calcScaling(0.0487, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
          hit: 3,
        },
      ]

      if (a >= 1) {
        switch (uniqueCount) {
          case 1:
            base[Stats.P_HP].push({ value: 0.06, name: 'Ascension 1 Passive', source: `Self` })
            break
          case 2:
            base[Stats.P_HP].push({ value: 0.12, name: 'Ascension 1 Passive', source: `Self` })
            break
          case 3:
            base[Stats.P_HP].push({ value: 0.18, name: 'Ascension 1 Passive', source: `Self` })
            break
          case 4:
            base[Stats.P_HP].push({ value: 0.3, name: 'Ascension 1 Passive', source: `Self` })
        }
      }
      if (form.yelan_a4)
        base[Stats.ALL_DMG].push({ value: 0.01 + form.yelan_a4 * 0.035, name: 'Ascension 4 Passive', source: `Self` })
      if (c >= 2)
        base.BURST_SCALING.push({
          name: `C2 Additional Arrow`,
          value: [{ scaling: 0.14, multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        })
      if (form.yelan_c4) base[Stats.P_HP].push({ value: form.yelan_c4 * 0.1, name: 'Constellation 4', source: `Self` })
      if (c >= 6)
        base.BASIC_SCALING.push({
          name: `Mastermind Breakthrough Barb`,
          value: [{ scaling: calcScaling(0.1158, normal, 'elemental', '1_alt') * 1.56, multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.yelan_a4)
        base[Stats.ALL_DMG].push({ value: 0.01 + form.yelan_a4 * 0.035, name: 'Ascension 4 Passive', source: `Yelan` })
      if (form.yelan_c4) base[Stats.P_HP].push({ value: form.yelan_c4 * 0.1, name: 'Constellation 4', source: `Yelan` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Yelan
