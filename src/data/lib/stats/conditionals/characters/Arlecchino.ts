import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Arlecchino = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: c >= 3,
    skill: false,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Invitation to a Beheading	`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a fixed amount of Stamina, dashing toward a nearby opponent and cleaving once.
      <br />Continuously holding this button will cause Arlecchino to consume Stamina and engage in up to <span class="text-desc">5</span>s of high-speed movement.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      <br />
      <br /><b class="text-genshin-pyro">Masque of the Red Death</b>
      <br />When Arlecchino has a <b class="text-genshin-bol">Bond of Life</b> equal to or greater than <span class="text-desc">30%</span> of her Max HP, she will enter the "Masque of the Red Death" state, where her Normal, Charged, and Plunging Attacks will be converted to deal <b class="text-genshin-pyro">Pyro DMG</b>. This cannot be overridden.
      <br />When in the <b class="text-genshin-pyro">Masque of the Red Death</b> state, Arlecchino's Normal Attacks will deal extra DMG to opponents on hit that scales off her ATK multiplied by a certain ratio of her current <b class="text-genshin-bol">Bond of Life</b> percentage. This will consume <span class="text-desc">7.5%</span> of said current <b class="text-genshin-bol">Bond of Life</b>. Her <b class="text-genshin-bol">Bond of Life</b> can be consumed this way every <span class="text-desc">0.03</span>s. When her <b class="text-genshin-bol">Bond of Life</b> is consumed in this manner, <b>All Is Ash</b>'s CD will decrease by <span class="text-desc">0.8</span>s.
      `,
      image: 'Skill_A_03',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `All Is Ash`,
      content: `Summons forth Balemoon Bloodfire, dealing <b class="text-genshin-pyro">Pyro DMG</b> to multiple nearby opponents and performing a dash-cleave against one of them, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />Opponents hit by the aforementioned attack will have a <b class="text-genshin-pyro">Blood-Debt Directive</b> applied to them.
      <br />
      <br /><b class="text-genshin-pyro">Blood-Debt Directive</b>
      <br />Lasts <span class="text-desc">30</span>s. Every <span class="text-desc">5</span>s, it will deal <span class="text-desc">1</span> instance of <b class="text-genshin-pyro">Pyro DMG</b> to the opponent. Max <span class="text-desc">2</span> instances. This DMG will be considered Elemental Skill DMG.
      <br />When Arlecchino uses a Charged Attack or her Elemental Burst, <b>Balemoon Rising</b>, she will absorb and clear nearby <b class="text-genshin-pyro">Blood-Debt Directives</b>. Each <b class="text-genshin-pyro">Directive</b> absorbed grants her a <b class="text-genshin-bol">Bond of Life</b> worth <span class="text-desc">65%</span> of her Max HP.
      <br />The maximum value of the <b class="text-genshin-bol">Bond of Life</b> she can be granted through <b class="text-genshin-pyro">Blood-Debt Directives</b> within <span class="text-desc">35</span>s after using her Elemental Skill is <span class="text-desc">145%</span> of her Max HP. Using the Elemental Skill again during this duration will restart the count on duration and the limit on the value of <b class="text-genshin-bol">Bond of Life</b> she may gain from <b class="text-genshin-pyro">Blood-Debt Directives</b>.`,
      image: 'Skill_S_Arlecchino_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Balemoon Rising`,
      content: `Arlecchino's great wing of Balemoon Bloodfire beats as she absorbs and clears <b class="text-genshin-pyro">Blood-Debt Directives</b> around her. She deals <b class="text-genshin-pyro">AoE Pyro DMG</b> before clearing the CD of <b>All Is Ash</b> and healing herself. The healing is based on her <b class="text-genshin-bol">Bond of Life</b> value and ATK.`,
      image: 'Skill_E_Arlecchino_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Agony Alone May Be Repaid`,
      content: `<b class="text-genshin-pyro">Blood-Debt Directives</b> have the following characteristics:
      <br />Arlecchino will be granted a <b class="text-genshin-bol">Bond of Life</b> worth <span class="text-desc">130%</span> of her Max HP when an opponent to which she herself applied a <b class="text-genshin-pyro">Directive</b> is defeated.
      <br /><span class="text-desc">5</span>s after a <b class="text-genshin-pyro">Directive</b> is applied, it will be upgraded to a <b class="text-genshin-pyro">Blood-Debt Due</b>. When absorbed, it will instead grant Arlecchino a <b class="text-genshin-bol">Bond of Life</b> worth <span class="text-desc">130%</span>.
      <br />A <b class="text-genshin-bol">Bond of Life</b> created in the aforementioned ways cannot exceed the original limit on the value of <b class="text-genshin-bol">Bond of Life</b> obtained through <b>All Is Ash</b>.`,
      image: 'UI_Talent_S_Arlecchino_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Strength Alone Can Defend`,
      content: `Arlecchino gains <span class="text-desc">1%</span> All <b>Elemental and Physical RES</b> for every <span class="text-desc">100</span> ATK she has in excess of <span class="text-desc">1,000</span>. The maximum RES increase she can gain this way for each is <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Arlecchino_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Balemoon Alone May Know`,
      content: `While in combat, Arlecchino gains a <span class="text-desc">40%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> and can only be healed through <b>Balemoon Rising</b>.`,
      image: 'UI_Talent_S_Arlecchino_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `"All Reprisals and Arrears, Mine to Bear..."`,
      content: `<b class="text-genshin-pyro">Masque of the Red Death</b> is further enhanced, the value of the increase is <span class="text-desc">100%</span>. Additionally, Arlecchino's interruption resistance is increased when she performs Normal or Charged Attacks while affected by the <b class="text-genshin-pyro">Masque of the Red Death</b>.`,
      image: 'UI_Talent_S_Arlecchino_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `"All Rewards and Retribution, Mine to Bestow..."`,
      content: `<b class="text-genshin-pyro">Blood-Debt Directives</b> are now already <b class="text-genshin-pyro">Blood-Debt Due</b> when first applied.
      <br />When Arlecchino absorbs such a <b class="text-genshin-pyro">Due</b>, she unleashes <b>Balemoon Bloodfire</b> in front of her, dealing <span class="text-desc">900%</span> of her ATK as <b class="text-genshin-pyro">AoE Pyro DMG</b> and increasing her All <b>Elemental RES and Physical RES</b> by <span class="text-desc">20%</span> for <span class="text-desc">15</span>s. This effect can trigger once every <span class="text-desc">10</span>s.
      <br />You must first unlock the Passive Talent <b>Agony Alone May Be Repaid</b>.`,
      image: 'UI_Talent_S_Arlecchino_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `"You Shall Become a New Member of Our Family..."`,
      content: `Increases the Level of <b>Normal Attack: Invitation to a Beheading</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Arlecchino_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `"You Shall Love and Protect Each Other Henceforth..."`,
      content: `When Arlecchino successfully absorbs a <b class="text-genshin-pyro">Blood-Debt Directive</b>, <b>Balemoon Rising</b>'s CD will decrease by <span class="text-desc">2</span>s and <span class="text-desc">15</span> Elemental Energy will be restored to her. This effect can occur once every <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Arlecchino_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `"For Alone, We Are as Good as Dead..."`,
      content: `Increases the Level of <b>Balemoon Rising</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Arlecchino_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `"From This Day On, We Shall Delight in New Life Together."`,
      content: `The DMG of <b>Balemoon Rising</b> is increased by Arlecchino's ATK multiplied by <span class="text-desc">700%</span> of Arlecchino's current <b class="text-genshin-bol">Bond of Life</b> percentage.
      For <span class="text-desc">20</span>s after Arlecchino uses <b>All Is Ash</b>, both her Normal Attacks and Elemental Burst gain <span class="text-desc">10%</span> increased CRIT Rate and <span class="text-desc">70%</span> increased CRIT DMG. This effect can be triggered up to once every <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Arlecchino_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'bol',
      text: `Bond of Life`,
      ...talents.normal,
      show: true,
      default: 145,
      min: 0,
      max: 200,
    },
    {
      type: 'toggle',
      id: 'c2DueConsume',
      text: `C2 Due Absorption`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'c6Crit',
      text: `C6 CRIT Buff`,
      ...talents.c2,
      show: c >= 6,
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

      const bolMultiplier = calcScaling(1.204, 10, 'physical', '1') + (c >= 1 ? 1 : 0)
      const bolPropagation = _.map(Array(7).fill(form.bol / 100), (item, index) => {
        const remaining = item - index * 0.075
        if (remaining >= 0.3) return bolMultiplier * remaining
        return 0
      })
      const c6BurstBonus = c >= 6 ? [{ scaling: 7 * (form.bol / 100), multiplier: Stats.ATK }] : []
      const bolScaling = _.map(bolPropagation, (item) => (item ? [{ scaling: item, multiplier: Stats.ATK }] : []))

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.475, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[0]],
          element: bolPropagation[0] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.5211, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[1]],
          element: bolPropagation[1] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.6539, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[2]],
          element: bolPropagation[2] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [1]',
          value: [{ scaling: calcScaling(0.3715, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[3]],
          element: bolPropagation[3] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [2]',
          value: [{ scaling: calcScaling(0.3715, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[4]],
          element: bolPropagation[4] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.6998, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[5]],
          element: bolPropagation[5] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '6-Hit',
          value: [{ scaling: calcScaling(0.8538, normal, 'physical', '1'), multiplier: Stats.ATK }, ...bolScaling[6]],
          element: bolPropagation[6] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.1266, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: form.bol >= 30 ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal, form.bol >= 30 ? Element.PYRO : Element.PHYSICAL)
      base.SKILL_SCALING = [
        {
          name: 'Spike DMG',
          value: [{ scaling: calcScaling(0.1484, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Cleave DMG',
          value: [{ scaling: calcScaling(1.3356, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Blood-Debt Directive DMG',
          value: [{ scaling: calcScaling(0.318, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(3.704, burst, 'physical', '1'), multiplier: Stats.ATK }, ...c6BurstBonus],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'HP Restored',
          value: [
            { scaling: 1.5, multiplier: Stats.ATK },
            { scaling: (form.bol / 100) * 0.5, multiplier: Stats.HP },
          ],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      base[Stats.PYRO_DMG].push({ value: 0.4, name: 'Utility Passive', source: `Self` })

      if (c >= 2)
        base.CHARGE_SCALING.push({
          name: 'C2 Balemoon Bloodfire',
          value: [{ scaling: 9, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        })
      if (form.c2DueConsume) base.ALL_TYPE_RES.push({ value: 0.2, name: 'Constellation 2', source: `Self` })
      if (form.c6Crit) {
        base.BASIC_CR.push({ value: 0.1, name: 'Constellation 6', source: `Self` })
        base.BASIC_CD.push({ value: 0.7, name: 'Constellation 6', source: `Self` })
        base.BURST_CR.push({ value: 0.1, name: 'Constellation 6', source: `Self` })
        base.BURST_CD.push({ value: 0.7, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4)
        base.ALL_TYPE_RES.push({
          value: _.min([0.01 * ((base.getAtk() - 1000) / 100), 0.2]),
          name: 'Ascension 4 Passive',
          source: 'Self',
        })
      return base
    },
  }
}

export default Arlecchino
