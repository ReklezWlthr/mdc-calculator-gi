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
      trace: `Normal Attack`,
      title: `Stealthy Bowshot`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, flowing water will accumulate on the arrowhead. A fully charged torrential arrow will deal <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b>Breakthrough</b>
      <br />Yelan will enter a "Breakthrough" state after spending <span class="text-desc">5</span>s out of combat, which will cause her next Charged Aimed Shot to have 80% decreased charge time, and once charged, she can fire a "Breakthrough Barb" that will <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Yelan's Max HP.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Lingering Lifeline`,
      content: `Fires off a Lifeline that allows her to move rapidly, entangling and marking opponents along its path.
      <br />When this rapid movement ends, the Lifeline will explode, dealing <b class="text-genshin-hydro">Hydro DMG</b> to the marked opponents based on Yelan's Max HP.
      <br />
      <br /><b>Press</b>
      <br />Moves a certain distance forward swiftly.
      <br />
      <br /><b>Hold</b>
      <br />Engages in continuous, swift movement, during which Yelan's resistance to interruption is increased.
      <br />During this time, Yelan can control this rapid movement and end it by using this Skill again.
      <br />
      <br />Additionally, each opponent marked by the Lifeline when it explodes grants Yelan a <span class="text-desc">34%</span> chance to reset her Breakthrough state.`,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Depth-Clarion Dice`,
      content: `Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> and creates an "Exquisite Throw," which aids her in battle.
      <br />
      <br /><b>Exquisite Throw</b>
      <br />Follows the character around and will initiate a coordinated attack under the following circumstances, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on Yelan's Max HP:
      <br />- Can occur once every second when your active character uses a Normal Attack.
      <br />- Will occur each time Yelan's Lifeline explodes and hits opponents.
      `,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Turn Control`,
      content: `When the party has <span class="text-desc">1/2/3/4</span> Elemental Types, Yelan's Max HP is increased by <span class="text-desc">6%/12%/18%/30%</span>.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Adapt With Ease`,
      content: `So long as an Exquisite Throw is in play, your own active character deals <span class="text-desc">1%</span> more DMG. This increases by a further <span class="text-desc">3.5%</span> DMG every second. The maximum increase to DMG dealt is <span class="text-desc">50%</span>.
      <br />The pre-existing effect will be dispelled if Depth-Clarion Dice is recast during its duration.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Necessary Calculation`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on a Liyue Expedition for 20 hours.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Enter the Plotters`,
      content: `Lingering Lifeline gains <span class="text-desc">1</span> additional charge.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Taking All Comers`,
      content: `When Exquisite Throw conducts a coordinated attack, it will fire an additional water arrow that will deal <span class="text-desc">14%</span> of Yelan's Max HP as Hydro DMG.
      <br />This effect can trigger once every <span class="text-desc">1.8</span>s.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Beware the Trickster's Dice`,
      content: `Increases the Level of Depth-Clarion Dice by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Bait-and-Switch`,
      content: `Increases all party members' Max HP by <span class="text-desc">10%</span> for <span class="text-desc">25</span>s for every opponent marked by Lifeline when the Lifeline explodes. A maximum increase of <span class="text-desc">40%</span> Max HP can be attained in this manner.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Dealer's Sleight`,
      content: `Increases the Level of Lingering Lifeline by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Winner Takes All`,
      content: `After using Depth-Clarion Dice, Yelan will enter the Mastermind state.
      <br />In this state, all of Yelan's Normal Attacks will be special Breakthrough Barbs. These Breakthrough Barbs will have similar abilities to normal ones and the DMG dealt will be considered Charged Attack DMG, dealing <span class="text-desc">156%</span> of a normal Breakthrough Barb's DMG.
      <br />
      <br />The Mastermind state lasts <span class="text-desc">20</span>s and will be cleared after Yelan fires <span class="text-desc">5</span> arrows.`,
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

  const teammateContent: IContent[] = [findContentById(content, 'yelan_a4'), findContentById(content, 'yelan_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 70

      base.BASIC_SCALING = [
        {
          name: '1-Hit [x2]',
          value: [{ scaling: calcScaling(0.4068, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
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
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.3251, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          name: `Exquisite Throw DMG [x3]`,
          value: [{ scaling: calcScaling(0.0487, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1) {
        switch (uniqueCount) {
          case 1:
            base[Stats.P_HP] += 0.06
            break
          case 2:
            base[Stats.P_HP] += 0.12
            break
          case 3:
            base[Stats.P_HP] += 0.18
            break
          case 4:
            base[Stats.P_HP] += 0.3
        }
      }
      if (form.yelan_a4) base[Stats.ALL_DMG] += 0.01 + form.yelan_a4 * 0.035
      if (c >= 2)
        base.BURST_SCALING.push({
          name: `C2 Additional Arrow`,
          value: [{ scaling: 0.14, multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        })
      if (form.yelan_c4) base[Stats.P_HP] += form.yelan_c4 * 0.1
      if (c >= 6)
        base.BASIC_SCALING.push({
          name: `Mastermind Breakthrough Barb`,
          value: [{ scaling: calcScaling(0.1158, normal, 'elemental', '1_alt') * 1.56, multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.yelan_a4) base[Stats.ALL_DMG] += 0.01 + form.yelan_a4 * 0.035
      if (form.yelan_c4) base[Stats.P_HP] += form.yelan_c4 * 0.1

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Yelan
