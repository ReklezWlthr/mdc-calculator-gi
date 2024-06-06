import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Gorou = (c: number, a: number, t: ITalentLevel, ...rest: [ITeamChar[]]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const [team] = rest
  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const geoCount = _.filter(teamData, (item) => item === Element.GEO).length

  const talents: ITalent = {
    normal: {
      title: `Ripping Fang Fletching`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />While aiming, stone crystals will accumulate on the arrowhead. A fully charged crystalline arrow will deal <b class="text-genshin-geo">Geo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Inuzaka All-Round Defense`,
      content: `Deals <b class="text-genshin-geo">AoE Geo DMG</b> and sets up a General's War Banner.
      <br />
      <br /><b>General's War Banner</b>
      <br />Provides up to 3 buffs to active characters within the skill's AoE based on the number of <b class="text-genshin-geo">Geo</b> characters in the party at the time of casting:
      <br />- 1 <b class="text-genshin-geo">Geo</b> character: Adds "Standing Firm" - DEF Bonus.
      <br />- 2 <b class="text-genshin-geo">Geo</b> characters: Adds "Impregnable" - Increased resistance to interruption.
      <br />- 3 <b class="text-genshin-geo">Geo</b> characters: Adds "Crunch" - <b class="text-genshin-geo">Geo DMG Bonus</b>.
      <br />
      <br />Gorou can deploy only <span class="text-desc">1</span> General's War Banner on the field at any one time.
      <br />Characters can only benefit from 1 General's War Banner at a time. When a party member leaves the field, the active buff will last for 2s.
      <br />
      <br /><b>Hold</b>
      <br />Adjust the location of the skill.`,
    },
    burst: {
      title: `Juuga: Forward Unto Victory`,
      content: `Displaying his valor as a general, Gorou deals <b class="text-genshin-geo">AoE Geo DMG</b> and creates a field known as General's Glory to embolden his comrades.
      <br />
      <br /><b>General's Glory</b>
      <br />This field has the following properties:
      <br />- Like the General's War Banner created by Inuzaka All-Round Defense, provides buffs to active characters within the skill's AoE based on the number of <b class="text-genshin-geo">Geo</b> characters in the party. Also moves together with your active character.
      <br />- Generates 1 Crystal Collapse every <span class="text-desc">1.5</span>s that deals <b class="text-genshin-geo">AoE Geo DMG</b> to 1 opponent within the skill's AoE.
      <br />- Pulls 1 elemental shard in the skill's AoE to your active character's position every 1.5s (elemental shards are created by Crystallize reactions).
      <br />
      <br />If a General's War Banner created by Gorou currently exists on the field when his ability is used, it will be destroyed. In addition, for the duration of General's Glory, Gorou's Elemental Skill "Inuzaka All-Round Defense" will not create the General's War Banner.
      <br />If Gorou falls, the effects of General's Glory will be cleared.
      `,
    },
    a1: {
      title: `A1: Heedless of the Wind and Weather`,
      content: `After using Juuga: Forward Unto Victory, all nearby party members' DEF is increased by <span class="text-desc">25%</span> for <span class="text-desc">12</span>s.`,
    },
    a4: {
      title: `A4: A Favor Repaid`,
      content: `Gorou receives the following DMG Bonuses to his attacks based on his DEF:
      <br />- Inuzaka All-Round Defense: Skill DMG increased by <span class="text-desc">156%</span> of DEF
      <br />- Juuga: Forward Unto Victory: Skill DMG and Crystal Collapse DMG increased by <span class="text-desc">15.6%</span> of DEF`,
    },
    util: {
      title: `Seeker of Shinies`,
      content: `Displays the location of nearby resources unique to Inazuma on the mini-map.`,
    },
    c1: {
      title: `C1: Rushing Hound: Swift as the Wind`,
      content: `When characters (other than Gorou) within the AoE of Gorou's General's War Banner or General's Glory deal <b class="text-genshin-geo">Geo DMG</b> to opponents, the CD of Gorou's Inuzaka All-Round Defense is decreased by <span class="text-desc">2</span>s. This effect can occur once every <span class="text-desc">10</span>s.`,
    },
    c2: {
      title: `C2: Sitting Hound: Steady as a Clock`,
      content: `While General's Glory is in effect, its duration is extended by <span class="text-desc">1</span>s when a nearby active character obtains an Elemental Shard from a Crystallize reaction. This effect can occur once every <span class="text-desc">0.1</span>s. Max extension is <span class="text-desc">3</span>s.`,
    },
    c3: {
      title: `C3: Mauling Hound: Fierce as Fire`,
      content: `Increases the Level of Inuzaka All-Round Defense by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Lapping Hound: Warm as Water`,
      content: `When General's Glory is in the "Impregnable" or "Crunch" states, it will also heal active characters within its AoE by <span class="text-desc">50%</span> of Gorou's own DEF every <span class="text-desc">1.5</span>s.`,
    },
    c5: {
      title: `C5: Striking Hound: Thunderous Force`,
      content: `Increases the Level of Juuga: Forward Unto Victory by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Valiant Hound: Mountainous Fealty`,
      content: `For <span class="text-desc">12</span>s after using Inuzaka All-Round Defense or Juuga: Forward Unto Victory, increases the CRIT DMG of all nearby party members' <b class="text-genshin-geo">Geo DMG</b> based on the buff level of the skill's field at the time of use:
      <br />- "Standing Firm": <span class="text-desc">+10%</span>
      <br />- "Impregnable": <span class="text-desc">+20%</span>
      <br />- "Crunch": <span class="text-desc">+40%</span>
      <br />
      <br />This effect cannot stack and will take reference from the last instance of the effect that is triggered.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'gorou_skill',
      text: `General's War Banner`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'gorou_a1',
      text: `A1 DEF Bonus`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'gorou_c6',
      text: `C6 CRIT DMG`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'gogour_skill'),
    findContentById(content, 'gorou_a1'),
    findContentById(content, 'gorou_c6'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3775, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3715, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4945, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.59, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          element: Element.GEO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      const a4Skill = a >= 4 ? [{ scaling: 1.56, multiplier: Stats.DEF }] : []
      const a4Burst = a >= 4 ? [{ scaling: 0.156, multiplier: Stats.DEF }] : []

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.072, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Skill],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(0.9822, burst, 'elemental', '1'), multiplier: Stats.DEF }, ...a4Burst],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
        {
          name: `Crystal Collapse DMG`,
          value: [{ scaling: calcScaling(0.613, burst, 'elemental', '1'), multiplier: Stats.DEF }, ...a4Burst],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.gorou_skill) {
        if (geoCount >= 1) base[Stats.DEF] += calcScaling(206.16, skill, 'elemental', '1')
        if (geoCount >= 3) base[Stats.GEO_DMG] += 0.15
      }

      if (form.gorou_a1) {
        base[Stats.P_DEF] += 0.25
      }

      if (c >= 4)
        base.SKILL_SCALING.push({
          name: `C4 Healing Over Time`,
          value: [{ scaling: 0.5, multiplier: Stats.DEF }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.gorou_c6) {
        if (geoCount >= 1) base[Stats.CRIT_DMG] += 0.1
        if (geoCount >= 2) base[Stats.CRIT_DMG] += 0.2
        if (geoCount >= 3) base[Stats.CRIT_DMG] += 0.4
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.gorou_skill) {
        if (geoCount >= 1) base[Stats.DEF] += calcScaling(206.16, skill, 'elemental', '1')
        if (geoCount >= 3) base[Stats.GEO_DMG] += 0.15
      }

      if (form.gorou_a1) {
        base[Stats.P_DEF] += 0.25
      }

      if (form.gorou_c6) {
        if (geoCount >= 1) base[Stats.CRIT_DMG] += 0.1
        if (geoCount >= 2) base[Stats.CRIT_DMG] += 0.2
        if (geoCount >= 3) base[Stats.CRIT_DMG] += 0.4
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Gorou
