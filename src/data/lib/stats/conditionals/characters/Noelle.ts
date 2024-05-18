import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Noelle = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const elementCount = _.filter(teamData, (item) =>
    _.includes([Element.PYRO, Element.HYDRO, Element.ELECTRO, Element.CRYO], item)
  ).length

  const talents: ITalent = {
    normal: {
      title: `Favonius Bladework - Maid`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Drains Stamina over time to perform continuous spinning attacks against all nearby opponents.
      <br />At the end of the sequence, performs a more powerful slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Breastplate`,
      content: `Summons protective stone armor, dealing <b class="text-genshin-geo">Geo DMG</b> to surrounding opponents and creating a shield. The shield's DMG Absorption scales based on Noelle's DEF.
      <br />The shield has the following properties:
      <br />- When Noelle's Normal and Charged Attacks hit a target, they have a certain chance to regenerate HP for all characters.
      <br />- Possesses <span class="text-desc">150%</span> DMG Absorption efficiency against all <b>Elemental and Physical DMG</b>.
      <br />
      <br />The amount of HP healed when regeneration is triggered scales based on Noelle's DEF.
      `,
    },
    burst: {
      title: `Sweeping Time`,
      content: `Gathering the strength of stone around her weapon, Noelle strikes the opponents surrounding her within a large AoE, dealing <b class="text-genshin-geo">Geo DMG</b>.
      <br />Afterwards, Noelle gains the following effects:
      <br />- Larger attack AoE.
      <br />- Converts attack DMG to <b class="text-genshin-geo">Geo DMG</b> that cannot be overridden by any other elemental infusion.
      <br />- Increased ATK that scales based on her DEF.`,
      // value: [
      //   {
      //     name: 'Current ATK Bonus',
      //     value: {
      //       stat: Stats.DEF,
      //       scaling: (def) => _.round(calcScaling(0.4, burst, 'elemental', '1') * def).toLocaleString(),
      //     },
      //   },
      // ],
    },
    a1: {
      title: `A1: Devotion`,
      content: `When Noelle is in the party but not on the field, this ability triggers automatically when your active character's HP falls below <span class="text-desc">30%</span>:
      <br />Creates a shield for your active character that lasts for <span class="text-desc">20</span>s and absorbs DMG equal to <span class="text-desc">400%</span> of Noelle's DEF.
      <br />The shield has a <span class="text-desc">150%</span> DMG Absorption effectiveness against all <b>Elemental and Physical DMG</b>.
      <br />This effect can only occur once every <span class="text-desc">60</span>s.`,
    },
    a4: {
      title: `A4: Nice and Clean`,
      content: `Every <span class="text-desc">4</span> Normal or Charged Attack hits will decrease the CD of Breastplate by <span class="text-desc">1</span>s.
      <br />Hitting multiple opponents with a single attack is only counted as <span class="text-desc">1</span> hit.`,
    },
    c1: {
      title: `C1: I Got Your Back`,
      content: `While Sweeping Time and Breastplate are both in effect, the chance of Breastplate's healing effects activating is increased to <span class="text-desc">100%</span>.`,
    },
    c2: {
      title: `C2: Combat Maid`,
      content: `Decreases the Stamina Consumption of Noelle's Charged Attacks by <span class="text-desc">20%</span> and increases her Charged Attack DMG by <span class="text-desc">15%</span>.`,
    },
    c3: {
      title: `C3: Invulnerable Maid`,
      content: `Increases the Level of Breastplate by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: To Be Cleaned`,
      content: `When Breastplate's duration expires or it is destroyed by DMG, it will deal <span class="text-desc">400%</span> of Noelle's ATK of <b class="text-genshin-geo">Geo DMG</b> to surrounding opponents.`,
    },
    c5: {
      title: `C5: Favonius Sweeper Master`,
      content: `Increases the Level of Sweeping Time by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Must Be Spotless`,
      content: `Sweeping Time increases Noelle's ATK by an additional <span class="text-desc">50%</span> of her DEF.
      <br />Additionally, every opponent defeated during the skill's duration adds 1s to the duration, up to <span class="text-desc">10</span>s.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'noelle_burst',
      text: `Sweeping Time`,
      ...talents.burst,
      show: true,
      default: true,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      if (form.navia_infusion) {
        base.infuse(Element.GEO, true)
        base.BASIC_DMG += 0.4
        base.CHARGE_DMG += 0.4
        base.PLUNGE_DMG += 0.4
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.7912, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.7336, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x3]',
          value: [{ scaling: calcScaling(0.8626, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.3343, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.5074, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(0.9047, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.2, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'DMG Absorption',
          value: [{ scaling: calcScaling(1.6, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          flat: calcScaling(769, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Healing',
          value: [{ scaling: calcScaling(0.2128, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          flat: calcScaling(102, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Burst DMG`,
          value: [{ scaling: calcScaling(0.672, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
        {
          name: `Slash DMG`,
          value: [{ scaling: calcScaling(0.928, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.noelle_burst) base.infuse(Element.GEO, true)
      if (a >= 1)
        base.SKILL_SCALING.push({
          name: 'A1 Emergency Shield',
          value: [{ scaling: 4, multiplier: Stats.DEF }],
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })
      if (c >= 2) base.CHARGE_DMG += 0.15
      if (c >= 4)
        base.SKILL_SCALING.push({
          name: 'Breastplate Expire DMG',
          value: [{ scaling: 4, multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.navia_c4) base.GEO_RES_PEN += 0.2

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.noelle_burst)
        base[Stats.ATK] += base.getDef() * (calcScaling(0.4, burst, 'elemental', '1') + (c >= 6 ? 0.5 : 0))

      return base
    },
  }
}

export default Noelle
