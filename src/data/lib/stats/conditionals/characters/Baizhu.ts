import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Baizhu = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const c6Scaling = c >= 6 ? [{ scaling: 0.08, multiplier: Stats.HP }] : []

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Universal Diagnosis`,
      content: `Controls a <b>Gossamer Sprite</b> that cruises and attacks nearby opponents, dealing <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />After it performs <span class="text-desc">3</span> attacks or if there are no opponents nearby, the <b>Sprite</b> will return, healing all nearby party members based on Baizhu's Max HP.
      `,
      image: 'Skill_S_Baizhuer_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Holistic Revivification`,
      content: `Enters the Pulsing Clarity state, creating a <b class="text-genshin-dendro">Seamless Shield</b> that absorbs <b class="text-genshin-dendro">Dendro DMG</b> with <span class="text-desc">250%</span> effectiveness.
      <br />While in this state, Baizhu will generate a new <b class="text-genshin-dendro">Seamless Shield</b> every <span class="text-desc">2.5</span>s.
      <br />
      <br />The <b class="text-genshin-dendro">Seamless Shield</b> will heal your own active character based on Baizhu's Max HP and attack opponents by unleashing <b>Spiritveins</b>, dealing <b class="text-genshin-dendro">Dendro DMG</b> under the following circumstances:
      <br />- When a character is under the protection of a <b class="text-genshin-dendro">Seamless Shield</b> and a new <b class="text-genshin-dendro">Seamless Shield</b> is generated.
      <br />- When the <b class="text-genshin-dendro">Seamless Shield</b>'s effects expire, or when it is shattered.
      `,
      image: 'Skill_E_Baizhuer_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Five Fortunes Forever`,
      content: `Baizhu gains different effects according to the current HP of your current active character:
      <br />When their HP is less than <span class="text-desc">50%</span>, Baizhu gains <span class="text-desc">20%</span> Healing Bonus.
      <br />When their HP is equal to or more than <span class="text-desc">50%</span>, Baizhu gains <span class="text-desc">25%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b>.`,
      image: 'UI_Talent_S_Baizhuer_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `All Things Are of the Earth`,
      content: `Characters who are healed by <b class="text-genshin-dendro">Seamless Shield</b> will gain the <b class="text-genshin-dendro">Year of Verdant Favor</b> effect: Each <span class="text-desc">1,000</span> Max HP that Baizhu possesses that does not exceed <span class="text-desc">50,000</span> will increase the Burning, Bloom, Hyperbloom, and Burgeon reaction DMG dealt by these characters by <span class="text-desc">2%</span>, while the Aggravate and Spread reaction DMG dealt by these characters will be increased by <span class="text-desc">0.8%</span>. This effect lasts <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Baizhuer_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Herbal Nourishment`,
      content: `When Baizhu is in the party, interacting with certain harvestable items will heal your current active character for <span class="text-desc">2.5%</span> of Baizhu's Max HP.`,
      image: 'UI_Talent_S_Baizhuer_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Attentive Observation`,
      content: `<b>Universal Diagnosis</b> gains <span class="text-desc">1</span> additional charge.`,
      image: 'UI_Talent_S_Baizhuer_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Incisive Discernment`,
      content: `When your own active character hits a nearby opponent with their attacks, Baizhu will unleash a <b>Gossamer Sprite: Splice</b>.
      <br /><b>Gossamer Sprite: Splice</b> will initiate <span class="text-desc">1</span> attack before returning, dealing <span class="text-desc">250%</span> of Baizhu's ATK as <b class="text-genshin-dendro">Dendro DMG</b> and healing for <span class="text-desc">20%</span> of <b>Universal Diagnosis</b>'s <b>Gossamer Sprite</b>'s normal healing.
      <br />DMG dealt this way is considered Elemental Skill DMG.
      <br />This effect can be triggered once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Baizhuer_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `All Aspects Stabilized`,
      content: `Increases the Level of <b>Holistic Revivification</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Baizhuer_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Ancient Art of Perception`,
      content: `For <span class="text-desc">15</span>s after <b>Holistic Revivification</b> is used, Baizhu will increase all nearby party members' Elemental Mastery by <span class="text-desc">80</span>.`,
      image: 'UI_Talent_S_Baizhuer_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `The Hidden Ebb and Flow`,
      content: `Increases the Level of <b>Universal Diagnosis</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Baizhuer_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Elimination of Malicious Qi`,
      content: `Increases the DMG dealt by <b>Holistic Revivification</b>'s <b>Spiritveins</b> by <span class="text-desc">8%</span> of Baizhu's Max HP.
      <br />Additionally, when a <b>Gossamer Sprite</b> or <b>Gossamer Sprite: Splice</b> hits opponents, there is a <span class="text-desc">100%</span> chance of generating one of <b>Holistic Revivification</b>'s <b class="text-genshin-dendro">Seamless Shields</b>. This effect can only be triggered once by each <b>Gossamer Sprite</b> or <b>Gossamer Sprite: Splice</b>.`,
      image: 'UI_Talent_S_Baizhuer_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'bai_a1',
      text: `Active Character HP >= 50%`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'bai_a4',
      text: `Year of Verdant Fervor`,
      ...talents.a4,
      show: a >= 4,
      default: false,
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
    allyContent: [findContentById(content, 'bai_a4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

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
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.2254, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
          hit: 2,
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
        {
          name: 'Utility Passive Healing',
          value: [{ scaling: 0.025, multiplier: Stats.HP }],
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
        base[Stats.DENDRO_DMG].push({ value: 0.25, name: 'Ascension 1 Passive', source: `Self` })
      } else {
        base[Stats.HEAL].push({ value: 0.2, name: 'Ascension 1 Passive', source: `Self` })
      }

      if (form.bai_c4) base[Stats.EM].push({ value: 80, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      const b = _.min([own.getHP(), 50000]) / 1000
      const a4Trans = {
        value: b * 0.02,
        name: 'Ascension 4 Passive',
        source: 'Baizhu',
        base: b,
        multiplier: 0.02,
      }
      const a4Add = {
        value: b * 0.008,
        name: 'Ascension 4 Passive',
        source: 'Baizhu',
        base: b,
        multiplier: 0.008,
      }

      if (aForm.bai_a4) {
        base.BURNING_DMG.push(a4Trans)
        base.BLOOM_DMG.push(a4Trans)
        base.HYPERBLOOM_DMG.push(a4Trans)
        base.BURGEON_DMG.push(a4Trans)
        base.SPREAD_DMG.push(a4Add)
        base.AGGRAVATE_DMG.push(a4Add)
      }

      if (form.bai_c4) base[Stats.EM].push({ value: 80, name: '', source: `` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const b = _.min([base.getHP(), 50000]) / 1000
      const a4Trans = {
        value: b * 0.02,
        name: 'Ascension 4 Passive',
        source: 'Self',
        base: b,
        multiplier: 0.02,
      }
      const a4Add = {
        value: b * 0.008,
        name: 'Ascension 4 Passive',
        source: 'Self',
        base: b,
        multiplier: 0.008,
      }

      if (form.bai_a4) {
        base.BURNING_DMG.push(a4Trans)
        base.BLOOM_DMG.push(a4Trans)
        base.HYPERBLOOM_DMG.push(a4Trans)
        base.BURGEON_DMG.push(a4Trans)
        base.SPREAD_DMG.push(a4Add)
        base.AGGRAVATE_DMG.push(a4Add)
      }

      return base
    },
  }
}

export default Baizhu
