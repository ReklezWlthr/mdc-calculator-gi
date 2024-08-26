import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Qiqi = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      trace: `Normal Attack`,
      title: `Ancient Sword Art`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Adeptus Art: Herald of Frost`,
      content: `Using the Icevein Talisman, Qiqi brings forth the Herald of Frost, dealing <b class="text-genshin-cryo">Cryo DMG</b> to surrounding opponents.
      <br />
      <br /><b>Herald of Frost</b>
      <br />- On hit, Qiqi's Normal and Charged Attacks regenerate HP for your own party members and nearby teammates. Healing scales based on Qiqi's ATK.
      <br />- Periodically regenerates your active character's HP.
      <br />- Follows the character around, dealing <b class="text-genshin-cryo">Cryo DMG</b> to opponents in their path.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Adeptus Art: Preserver of Fortune`,
      content: `Qiqi releases the adeptus power sealed within her body, marking nearby opponents with a Fortune-Preserving Talisman that deals <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />
      <br /><b>Fortune-Preserving Talisman</b>
      <br />When opponents affected by this Talisman take DMG, the character that dealt this DMG regenerates HP.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Life-Prolonging Methods`,
      content: `When a character under the effects of Adeptus Art: Herald of Frost triggers an Elemental Reaction, their Incoming Healing Bonus is increased by <span class="text-desc">20%</span> for <span class="text-desc">8</span>s.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `A Glimpse Into Arcanum	`,
      content: `When Qiqi hits opponents with her Normal and Charged Attacks, she has a <span class="text-desc">50%</span> chance to apply a Fortune-Preserving Talisman to them for <span class="text-desc">6</span>s. This effect can only occur once every <span class="text-desc">30</span>s.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Former Life Memories`,
      content: `Displays the location of nearby resources unique to Liyue on the mini-map.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Ascetics of Frost`,
      content: `When the Herald of Frost hits an opponent marked by a Fortune-Preserving Talisman, Qiqi regenerates <span class="text-desc">2</span> Energy.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Frozen to the Bone`,
      content: `Qiqi's Normal and Charge Attack DMG against opponents affected by <b class="text-genshin-cryo">Cryo</b> is increased by <span class="text-desc">15%</span>.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Ascendant Praise`,
      content: `Increases the Level of Adeptus Art: Preserver of Fortune by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Divine Suppression`,
      content: `Targets marked by the Fortune-Preserving Talisman have their ATK decreased by <span class="text-desc">20%</span>.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Crimson Lotus Bloom`,
      content: `Increases the Level of Adeptus Art: Herald of Frost by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Rite of Resurrection`,
      content: `Using Adeptus Art: Preserver of Fortune revives all fallen party members nearby and regenerates <span class="text-desc">50%</span> of their HP.
      <br />This effect can only occur once every <span class="text-desc">15</span> mins.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'qiqi_a1',
      text: `A1 Healing Buff`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'qiqi_c2',
      text: `C2 Attack Buffs`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'qiqi_c4',
      text: `C4 ATK Reduction`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'qiqi_a1'), findContentById(content, 'qiqi_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3775, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3887, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.2417, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.2468, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.6304, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [x2]',
          value: [{ scaling: calcScaling(0.6433, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.96, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Healing On-Hit',
          value: [{ scaling: calcScaling(0.1056, skill, 'physical', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(67.4, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Continuous Healing',
          value: [{ scaling: calcScaling(0.696, skill, 'physical', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(450.55, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Herald of Frost DMG',
          value: [{ scaling: calcScaling(0.36, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.848, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Healing',
          value: [{ scaling: calcScaling(0.9, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(577.33, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (form.qiqi_a1) base[Stats.I_HEALING] += 0.2

      if (form.qiqi_c2) {
        base.BASIC_DMG += 0.15
        base.CHARGE_DMG += 0.15
      }
      if (form.qiqi_c4) base.ATK_REDUCTION += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.qiqi_c4) base.ATK_REDUCTION += 0.2
      if (form.qiqi_a1) base[Stats.I_HEALING] += 0.2

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Qiqi
