import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { StatObjectT } from '@src/core/hooks/useStat'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Baizhu = (c: number, a: number, t: ITalentLevel, stat: StatObjectT) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const a4Trans = _.min([stat.hp, 50000]) * 0.02
  const a4Add = _.min([stat.hp, 50000]) * 0.008

  const c6Scaling = c >= 6 ? [{ scaling: 0.08, multiplier: Stats.HP }] : []

  const talents: ITalent = {
    normal: {
      title: `The Classics of Acupuncture`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 attacks that deal <b class="text-genshin-dendro">Dendro DMG</b> to opponents in front of him.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-dendro">AoE Dendro DMG</b> to opponents in front of him after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Calling upon the might of Dendro, Baizhu plunges towards the ground from mid-air, damaging all opponents in his path. Deals <b class="text-genshin-dendro">AoE Dendro DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      title: `Universal Diagnosis`,
      content: `Controls a Gossamer Sprite that cruises and attacks nearby opponents, dealing <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />After it performs <span class="text-yellow">3</span> attacks or if there are no opponents nearby, the Sprite will return, healing all nearby party members based on Baizhu's Max HP.
      `,
    },
    burst: {
      title: `Holistic Revivification`,
      content: `Enters the Pulsing Clarity state, creating a Seamless Shield that absorbs <b class="text-genshin-dendro">Dendro DMG</b> with <span class="text-yellow">250%</span> effectiveness.
      <br />While in this state, Baizhu will generate a new Seamless Shield every <span class="text-yellow">2.5</span>s.
      <br />
      <br />The Seamless Shield will heal your own active character based on Baizhu's Max HP and attack opponents by unleashing Spiritveins, dealing <b class="text-genshin-dendro">Dendro DMG</b> under the following circumstances:
      <br />- When a character is under the protection of a Seamless Shield and a new Seamless Shield is generated.
      <br />- When the Seamless Shield's effects expire, or when it is shattered.
      `,
    },
    a1: {
      title: `A1: Five Fortunes Forever`,
      content: `Baizhu gains different effects according to the current HP of your current active character:
      <br />When their HP is less than <span class="text-yellow">50%</span>, Baizhu gains <span class="text-yellow">20%</span> Healing Bonus.
      <br />When their HP is equal to or more than <span class="text-yellow">50%</span>, Baizhu gains <span class="text-yellow">25%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b>.`,
    },
    a4: {
      title: `A4: All Things Are of the Earth`,
      content: `Characters who are healed by Seamless Shields will gain the Year of Verdant Favor effect: Each <span class="text-yellow">1,000</span> Max HP that Baizhu possesses that does not exceed <span class="text-yellow">50,000</span> will increase the Burning, Bloom, Hyperbloom, and Burgeon reaction DMG dealt by these characters by <span class="text-yellow">2%</span>, while the Aggravate and Spread reaction DMG dealt by these characters will be increased by <span class="text-yellow">0.8%</span>. This effect lasts <span class="text-yellow">6</span>s.
      <br /><br />Transformative DMG Bonus: <span class="text-yellow">${_.round(a4Trans)}</span>
      <br />Additive DMG Bonus: <span class="text-yellow">${_.round(a4Add)}</span>`,
    },
    c1: {
      title: `C1: Attentive Observation`,
      content: `Universal Diagnosis gains <span class="text-yellow">1</span> additional charge.`,
    },
    c2: {
      title: `C2: Incisive Discernment`,
      content: `When your own active character hits a nearby opponent with their attacks, Baizhu will unleash a Gossamer Sprite: Splice.
      <br />Gossamer Sprite: Splice will initiate 1 attack before returning, dealing <span class="text-yellow">250%</span> of Baizhu's ATK as <b class="text-genshin-dendro">Dendro DMG</b> and healing for <span class="text-yellow">20%</span> of Universal Diagnosis's Gossamer Sprite's normal healing.
      <br />DMG dealt this way is considered Elemental Skill DMG.
      <br />This effect can be triggered once every <span class="text-yellow">5</span>s.`,
    },
    c3: {
      title: `C3: All Aspects Stabilized`,
      content: `Increases the Level of Holistic Revivification by 3.
      <br />Maximum upgrade level is 15.`,
    },
    c4: {
      title: `C4: Ancient Art of Perception`,
      content: `For <span class="text-yellow">15</span>s after Holistic Revivification is used, Baizhu will increase all nearby party members' Elemental Mastery by <span class="text-yellow">80</span>.`,
    },
    c5: {
      title: `C5: The Hidden Ebb and Flow`,
      content: `Increases the Level of Universal Diagnosis by 3.
      <br />Maximum upgrade level is 15.`,
    },
    c6: {
      title: `C6: Elimination of Malicious Qi`,
      content: `Increases the DMG dealt by Holistic Revivification's Spiritveins by <span class="text-yellow">8%</span> of Baizhu's Max HP.
      <br />Additionally, when a Gossamer Sprite or Gossamer Sprite: Splice hits opponents, there is a <span class="text-yellow">100%</span> chance of generating one of Holistic Revivification's Seamless Shields. This effect can only be triggered once by each Gossamer Sprite or Gossamer Sprite: Splice.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'bai_a1',
      text: `Active Character HP >= 50%`,
      ...talents.a1,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'bai_c4',
      text: `Burst EM Share`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'bai_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (form: Record<string, any>) => {
      const base = _.cloneDeep(baseStatsObject)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3737, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3642, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.2254, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5414, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.2104, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.DENDRO)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.792, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Healing',
          value: [{ scaling: calcScaling(0.08, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(770.3755, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Seamless Shield',
          value: [{ scaling: calcScaling(0.008, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(77.03755, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Seamless Shield Healing',
          value: [{ scaling: calcScaling(0.052, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(500.74408, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Splitveins DMG',
          value: [{ scaling: calcScaling(0.9706, burst, 'elemental', '1'), multiplier: Stats.ATK }, ...c6Scaling],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (c >= 2)
        base.SKILL_SCALING.push(
          {
            name: 'Gossamer Sprite: Splice DMG',
            value: [{ scaling: 2.5, multiplier: Stats.ATK }],
            element: Element.DENDRO,
            property: TalentProperty.SKILL,
          },
          {
            name: 'Gossamer Sprite: Splice Healing',
            value: [{ scaling: calcScaling(0.08, skill, 'elemental', '1') * 0.2, multiplier: Stats.HP }],
            flat: calcScaling(770.3755, skill, 'special', 'flat') * 0.2,
            element: TalentProperty.HEAL,
            property: TalentProperty.HEAL,
          }
        )

      if (form.bai_a1) {
        base[Stats.DENDRO_DMG] += 0.25
      } else {
        base[Stats.HEAL] += 0.2
      }

      if (a >= 4) {
        base.BURNING_DMG += a4Trans
        base.BLOOM_DMG += a4Trans
        base.HYPERBLOOM_DMG += a4Trans
        base.BURGEON_DMG += a4Trans
        base.SPREAD_DMG += a4Add
        base.AGGRAVATE_DMG += a4Add
      }

      if (form.bai_c4) base[Stats.EM] += 80

      return base
    },
    preComputeShared: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        base.BURNING_DMG += a4Trans
        base.BLOOM_DMG += a4Trans
        base.HYPERBLOOM_DMG += a4Trans
        base.BURGEON_DMG += a4Trans
        base.SPREAD_DMG += a4Add
        base.AGGRAVATE_DMG += a4Add
      }

      if (form.bai_c4) base[Stats.EM] += 80

      return base
    },
  }
}

export default Baizhu
