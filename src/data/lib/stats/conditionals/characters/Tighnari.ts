import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Tighnari = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Khanda Barrier-Buster`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, the power of Dendro will accumulate on the arrowhead before the arrow is fired. Has different effects based on how long the energy has been charged:
      <br />- <b>Charge Level 1</b>: Fires off an arrow carrying the power of flora that deals <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />- <b>Charge Level 2</b>: Fires off a <b class="text-lime-600">Wreath Arrow</b> that deals <b class="text-genshin-dendro">Dendro DMG</b>. Upon hit, the <b class="text-lime-600">Wreath Arrow</b> will create <span class="text-desc">4</span> <b class="text-green-500">Clusterbloom Arrows</b> that will track nearby opponents automatically and deal <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Vijnana-Phala Mine`,
      content: `Tighnari throws a Vijnana Stormheart ahead that deals <b class="text-genshin-dendro">AoE Dendro DMG</b>, creating a Vijnana-Khanda Field that creates mysterious illusions that taunt opponents and draw their fire.
      <br />Additionally, Tighnari gains the <b>Vijnana Suffusion</b> effect, which will decrease the <b class="text-lime-600">Wreath Arrow</b>'s charging time by <span class="text-desc">2.4</span>s. This effect will dissipate once the skill duration ends or after Tighnari has fired <span class="text-desc">3</span> <b class="text-lime-600">Wreath Arrows</b>.`,
      image: 'Skill_S_Tighnari_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Fashioner's Tanglevine Shaft`,
      content: `Combines the power of all seeds to fire <span class="text-desc">6</span> <b>Tanglevine Shafts</b> that can track opponents and deal <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />After they hit, the <b>Tanglevine Shafts</b> will create a secondary wave of <b>Tanglevine Shafts</b> that can also track nearby opponents and deal <b class="text-genshin-dendro">Dendro DMG</b> on hit.
      `,
      image: 'Skill_E_Tighnari_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Keen Sight`,
      content: `After Tighnari fires a <b class="text-lime-600">Wreath Arrow</b>, his Elemental Mastery is increased by <span class="text-desc">50</span> for <span class="text-desc">4</span>s.`,
      image: 'UI_Talent_S_Tighnari_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Scholarly Blade`,
      content: `For every point of Elemental Mastery Tighnari possesses, his Charged Attack and <b>Fashioner's Tanglevine Shaft</b> DMG are increased by <span class="text-desc">0.06%</span>.
      <br />The maximum DMG Bonus obtainable this way is <span class="text-desc">60%</span>.`,
      image: 'UI_Talent_S_Tighnari_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Encyclopedic Knowledge`,
      content: `Displays the location of nearby resources unique to Sumeru on the mini-map.`,
      image: 'UI_Talent_S_Tighnari_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Beginnings Determined at the Roots`,
      content: `Tighnari's Charged Attack CRIT Rate is increased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Tighnari_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Origins Known From the Stem`,
      content: `When there are opponents within the Vijnana-Khanda Field created by <b>Vijnana-Phala Mine</b>, Tighnari gains <span class="text-desc">20%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b>.
      <br />The effect will last up to <span class="text-desc">6</span>s if the field's duration ends or if it no longer has opponents within it.`,
      image: 'UI_Talent_S_Tighnari_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Fortunes Read Amongst the Branches`,
      content: `Increases the Level of <b>Fashioner's Tanglevine Shaft</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Tighnari_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Withering Glimpsed in the Leaves`,
      content: `When <b>Fashioner's Tanglevine Shaft</b> is unleashed, all nearby party members gain <span class="text-desc">60</span> Elemental Mastery for <span class="text-desc">8</span>s. If the <b>Fashioner's Tanglevine Shaft</b> triggers a Burning, Bloom, Quicken, or Spread reaction, their Elemental Mastery will be further increased by <span class="text-desc">60</span>. This latter case will also refresh the buff state's duration.`,
      image: 'UI_Talent_S_Tighnari_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Comprehension Amidst the Flowers`,
      content: `Increases the Level of <b>Vijnana-Phala Mine</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Tighnari_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Karma Adjudged From the Leaden Fruit`,
      content: `<b class="text-lime-600">Wreath Arrow</b>'s charging time is decreased by <span class="text-desc">0.9</span>s, and will produce <span class="text-desc">1</span> additional <b class="text-green-500">Clusterbloom Arrow</b> upon hit. This arrow deals <span class="text-desc">150%</span> of Tighnari's ATK as DMG.`,
      image: 'UI_Talent_S_Tighnari_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'tigh_a1',
      text: `A1 EM Buff`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'tigh_c2',
      text: `C2 Dendro DMG Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'number',
      id: 'tigh_c4',
      text: `C4 EM Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 2,
      min: 0,
      max: 2,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'tigh_c4')]

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
          value: [{ scaling: calcScaling(0.4463, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4197, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.2645, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6863, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          name: 'Level 1 Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Wreath Arrow DMG',
          value: [{ scaling: calcScaling(0.872, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Clusterbloom Arrow DMG',
          value: [{ scaling: calcScaling(0.386, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.496, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Tanglevine Shaft DMG`,
          value: [{ scaling: calcScaling(0.5562, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
          hit: 6,
        },
        {
          name: `Secondary Tanglevine Shaft DMG`,
          value: [{ scaling: calcScaling(0.6798, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
          hit: 6,
        },
      ]

      if (form.tigh_a1) base[Stats.EM].push({ value: 50, name: 'Ascension 1 Passive', source: `Self` })
      if (c >= 1) base.CHARGE_CR.push({ value: 0.15, name: 'Constellation 1', source: `Self` })
      if (form.tigh_c2) base[Stats.DENDRO_DMG].push({ value: 0.2, name: 'Constellation 2', source: `Self` })
      if (form.tigh_c4) base[Stats.EM].push({ value: 60 * form.tigh_c4, name: 'Constellation 4', source: `Self` })

      if (c >= 6)
        base.CHARGE_SCALING.push({
          name: 'C6 Clusterbloom Arrow DMG',
          value: [{ scaling: 1.5, multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.tigh_c4) base[Stats.EM].push({ value: 60 * form.tigh_c4, name: 'Constellation 4', source: `Tighnari` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        base.CALLBACK.push(function P99(x) {
          const a4Bonus = _.min([0.0006 * x.getEM(), 0.6])
          x.CHARGE_DMG.push({
            value: a4Bonus,
            name: 'Ascension 4 Passive',
            source: 'Self',
            base: _.min([x.getEM(), 1000]),
            multiplier: toPercentage(0.0006, 2),
          })
          x.BURST_DMG.push({
            value: a4Bonus,
            name: 'Ascension 4 Passive',
            source: 'Self',
            base: _.min([x.getEM(), 1000]),
            multiplier: toPercentage(0.0006, 2),
          })
          return x
        })
      }

      return base
    },
  }
}

export default Tighnari
