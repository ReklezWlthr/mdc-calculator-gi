import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Breastplate`,
      content: `Summons protective stone armor, dealing <b class="text-genshin-geo">Geo DMG</b> to surrounding opponents and creating a shield. The shield's DMG Absorption scales based on Noelle's DEF.
      <br />The shield has the following properties:
      <br />- When Noelle's Normal and Charged Attacks hit a target, they have a certain chance to regenerate HP for all characters.
      <br />- Possesses <span class="text-desc">150%</span> DMG Absorption efficiency against all <b>Elemental and Physical DMG</b>.
      <br />
      <br />The amount of HP healed when regeneration is triggered scales based on Noelle's DEF.
      `,
      image: 'Skill_S_Noel_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Sweeping Time`,
      content: `Gathering the strength of stone around her weapon, Noelle strikes the opponents surrounding her within a large AoE, dealing <b class="text-genshin-geo">Geo DMG</b>.
      <br />Afterwards, Noelle gains the following effects:
      <br />- Larger attack AoE.
      <br />- Converts attack DMG to <b class="text-genshin-geo">Geo DMG</b> that cannot be overridden by any other elemental infusion.
      <br />- Increased ATK that scales based on her DEF.`,
      image: 'Skill_E_Noel_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Devotion`,
      content: `When Noelle is in the party but not on the field, this ability triggers automatically when your active character's HP falls below <span class="text-desc">30%</span>:
      <br />Creates a shield for your active character that lasts for <span class="text-desc">20</span>s and absorbs DMG equal to <span class="text-desc">400%</span> of Noelle's DEF.
      <br />The shield has a <span class="text-desc">150%</span> DMG Absorption effectiveness against all <b>Elemental and Physical DMG</b>.
      <br />This effect can only occur once every <span class="text-desc">60</span>s.`,
      image: 'UI_Talent_S_Noel_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Nice and Clean`,
      content: `Every <span class="text-desc">4</span> Normal or Charged Attack hits will decrease the CD of <b>Breastplate</b> by <span class="text-desc">1</span>s.
      <br />Hitting multiple opponents with a single attack is only counted as <span class="text-desc">1</span> hit.`,
      image: 'UI_Talent_S_Noel_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Maid's Knighthood`,
      content: `When a Perfect Cooking is achieved on a DEF-boosting dish, Noelle has a <span class="text-desc">12%</span> chance to obtain double the product.`,
      image: 'UI_Talent_Cook_Defense',
    },
    c1: {
      trace: `Constellation 1`,
      title: `I Got Your Back`,
      content: `While <b>Sweeping Time</b> and Breastplate are both in effect, the chance of <b>Breastplate</b>'s healing effects activating is increased to <span class="text-desc">100%</span>.`,
      image: 'UI_Talent_S_Noel_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Combat Maid`,
      content: `Decreases the Stamina Consumption of Noelle's Charged Attacks by <span class="text-desc">20%</span> and increases her Charged Attack DMG by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Noel_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Invulnerable Maid`,
      content: `Increases the Level of <b>Breastplate</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Noel_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `To Be Cleaned`,
      content: `When <b>Breastplate</b>'s duration expires or it is destroyed by DMG, it will deal <span class="text-desc">400%</span> of Noelle's ATK of <b class="text-genshin-geo">Geo DMG</b> to surrounding opponents.`,
      image: 'UI_Talent_S_Noel_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Favonius Sweeper Master`,
      content: `Increases the Level of <b>Sweeping Time</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Noel_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Must Be Spotless`,
      content: `<b>Sweeping Time</b> increases Noelle's ATK by an additional <span class="text-desc">50%</span> of her DEF.
      <br />Additionally, every opponent defeated during the skill's duration adds <span class="text-desc">1</span>s to the duration, up to <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Noel_04',
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
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

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
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.8626, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 3,
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
      if (c >= 2) base.CHARGE_DMG.push({ value: 0.15, name: 'Constellation 2', source: `Self` })
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
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const b = base.getDef()
      const m = calcScaling(0.4, burst, 'elemental', '1') + (c >= 6 ? 0.5 : 0)
      if (form.noelle_burst)
        base[Stats.ATK].push({
          value: b * m,
          name: 'Sweeping Time',
          source: 'Self',
          base: b,
          multiplier: m,
        })

      return base
    },
  }
}

export default Noelle
