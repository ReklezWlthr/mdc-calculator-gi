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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Inuzaka All-Round Defense`,
      content: `Deals <b class="text-genshin-geo">AoE Geo DMG</b> and sets up a <b class="text-genshin-geo">General's War Banner</b>.
      <br />
      <br /><b class="text-genshin-geo">General's War Banner</b>
      <br />Provides up to <span class="text-desc">3</span> buffs to active characters within the skill's AoE based on the number of <b class="text-genshin-geo">Geo</b> characters in the party at the time of casting:
      <br />- <span class="text-desc">1</span> <b class="text-genshin-geo">Geo</b> character: Adds <b>Standing Firm</b> - DEF Bonus.
      <br />- <span class="text-desc">2</span> <b class="text-genshin-geo">Geo</b> characters: Adds <b>Impregnable</b> - Increased resistance to interruption.
      <br />- <span class="text-desc">3</span> <b class="text-genshin-geo">Geo</b> characters: Adds <b>Crunch</b> - <b class="text-genshin-geo">Geo DMG Bonus</b>.
      <br />
      <br />Gorou can deploy only <span class="text-desc">1</span> <b class="text-genshin-geo">General's War Banner</b> on the field at any one time.
      <br />Characters can only benefit from <span class="text-desc">1</span> <b class="text-genshin-geo">General's War Banner</b> at a time. When a party member leaves the field, the active buff will last for <span class="text-desc">2</span>s.
      <br />
      <br /><b>Hold</b>
      <br />Adjust the location of the skill.`,
      image: 'Skill_S_Gorou_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Juuga: Forward Unto Victory`,
      content: `Displaying his valor as a general, Gorou deals <b class="text-genshin-geo">AoE Geo DMG</b> and creates a field known as <b class="text-genshin-geo">General's Glory</b> to embolden his comrades.
      <br />
      <br /><b class="text-desc">General's Glory</b>
      <br />This field has the following properties:
      <br />- Like the <b class="text-genshin-geo">General's War Banner</b> created by <b>Inuzaka All-Round Defense</b>, provides buffs to active characters within the skill's AoE based on the number of <b class="text-genshin-geo">Geo</b> characters in the party. Also moves together with your active character.
      <br />- Generates <span class="text-desc">1</span> <b>Crystal Collapse</b> every <span class="text-desc">1.5</span>s that deals <b class="text-genshin-geo">AoE Geo DMG</b> to <span class="text-desc">1</span> opponent within the skill's AoE.
      <br />- Pulls <span class="text-desc">1</span> elemental shard in the skill's AoE to your active character's position every <span class="text-desc">1.5</span>s (elemental shards are created by Crystallize reactions).
      <br />
      <br />If a <b class="text-genshin-geo">General's War Banner</b> created by Gorou currently exists on the field when his ability is used, it will be destroyed. In addition, for the duration of <b class="text-desc">General's Glory</b>, Gorou's Elemental Skill <b>Inuzaka All-Round Defense</b> will not create the <b class="text-genshin-geo">General's War Banner</b>.
      <br />If Gorou falls, the effects of <b class="text-desc">General's Glory</b> will be cleared.
      `,
      image: 'Skill_E_Gorou_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Heedless of the Wind and Weather`,
      content: `After using <b>Juuga: Forward Unto Victory</b>, all nearby party members' DEF is increased by <span class="text-desc">25%</span> for <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Gorou_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `A Favor Repaid`,
      content: `Gorou receives the following DMG Bonuses to his attacks based on his DEF:
      <br />- <b>Inuzaka All-Round Defense</b>: Skill DMG increased by <span class="text-desc">156%</span> of DEF
      <br />- <b>Juuga: Forward Unto Victory</b>: Skill DMG and <b>Crystal Collapse</b> DMG increased by <span class="text-desc">15.6%</span> of DEF`,
      image: 'UI_Talent_S_Gorou_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Seeker of Shinies`,
      content: `Displays the location of nearby resources unique to Inazuma on the mini-map.`,
      image: 'UI_Talent_S_Gorou_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Rushing Hound: Swift as the Wind`,
      content: `When characters (other than Gorou) within the AoE of Gorou's <b class="text-genshin-geo">General's War Banner</b> or <b class="text-desc">General's Glory</b> deal <b class="text-genshin-geo">Geo DMG</b> to opponents, the CD of Gorou's <b>Inuzaka All-Round Defense</b> is decreased by <span class="text-desc">2</span>s. This effect can occur once every <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Gorou_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Sitting Hound: Steady as a Clock`,
      content: `While <b class="text-desc">General's Glory</b> is in effect, its duration is extended by <span class="text-desc">1</span>s when a nearby active character obtains an Elemental Shard from a Crystallize reaction. This effect can occur once every <span class="text-desc">0.1</span>s. Max extension is <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Gorou_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Mauling Hound: Fierce as Fire`,
      content: `Increases the Level of <b>Inuzaka All-Round Defense</b>> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Gorou_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Lapping Hound: Warm as Water`,
      content: `When <b class="text-desc">General's Glory</b> is in the <b>Impregnable</b> or <b>Crunch</b> states, it will also heal active characters within its AoE by <span class="text-desc">50%</span> of Gorou's own DEF every <span class="text-desc">1.5</span>s.`,
      image: 'UI_Talent_S_Gorou_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Striking Hound: Thunderous Force`,
      content: `Increases the Level of <b>Juuga: Forward Unto Victory</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Gorou_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Valiant Hound: Mountainous Fealty`,
      content: `For <span class="text-desc">12</span>s after using <b>Inuzaka All-Round Defense</b> or <b>Juuga: Forward Unto Victory</b>, increases the CRIT DMG of all nearby party members' <b class="text-genshin-geo">Geo DMG</b> based on the buff level of the skill's field at the time of use:
      <br />- <b>Standing Firm</b>: <span class="text-desc">+10%</span>
      <br />- "<b>Impregnable</b> <span class="text-desc">+20%</span>
      <br />- <b>Crunch</b>: <span class="text-desc">+40%</span>
      <br />
      <br />This effect cannot stack and will take reference from the last instance of the effect that is triggered.`,
      image: 'UI_Talent_S_Gorou_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'gorou_skill',
      text: `General's War Banner`,
      ...talents.skill,
      show: true,
      default: false,
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

  const teammateContent: IContent[] = [findContentById(content, 'gorou_a1'), findContentById(content, 'gorou_c6')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'gorou_skill')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

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
        if (geoCount >= 1)
          base[Stats.DEF].push({
            value: calcScaling(206.16, skill, 'elemental', '1'),
            name: `General's War Banner`,
            source: 'Self',
          })
        if (geoCount >= 3) base[Stats.GEO_DMG].push({ value: 0.15, name: `General's War Banner`, source: `Self` })
      }

      if (form.gorou_a1) {
        base[Stats.P_DEF].push({ value: 0.25, name: 'Ascension 1 Passive', source: `Self` })
      }

      if (c >= 4)
        base.SKILL_SCALING.push({
          name: `C4 Healing Over Time`,
          value: [{ scaling: 0.5, multiplier: Stats.DEF }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.gorou_c6) {
        if (geoCount >= 1) base[Stats.CRIT_DMG].push({ value: 0.1, name: 'Constellation 6', source: `Self` })
        if (geoCount >= 2) base[Stats.CRIT_DMG].push({ value: 0.2, name: 'Constellation 6', source: `Self` })
        if (geoCount >= 3) base[Stats.CRIT_DMG].push({ value: 0.4, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.gorou_skill) {
        if (geoCount >= 1)
          base[Stats.DEF].push({
            value: calcScaling(206.16, skill, 'elemental', '1'),
            name: `General's War Banner`,
            source: 'Gorou',
          })
        if (geoCount >= 3) base[Stats.GEO_DMG].push({ value: 0.15, name: `General's War Banner`, source: `Gorou` })
      }

      if (form.gorou_a1) {
        base[Stats.P_DEF].push({ value: 0.25, name: 'Ascension 1 Passive', source: `Gorou` })
      }

      if (form.gorou_c6) {
        if (geoCount >= 1) base[Stats.CRIT_DMG].push({ value: 0.1, name: 'Constellation 6', source: `Gorou` })
        if (geoCount >= 2) base[Stats.CRIT_DMG].push({ value: 0.2, name: 'Constellation 6', source: `Gorou` })
        if (geoCount >= 3) base[Stats.CRIT_DMG].push({ value: 0.4, name: 'Constellation 6', source: `Gorou` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Gorou
