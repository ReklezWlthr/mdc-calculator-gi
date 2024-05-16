import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
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

  let a4Res = 0

  const talents: ITalent = {
    normal: {
      title: `Invitation to a Beheading	`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a fixed amount of Stamina, dashing toward a nearby opponent and cleaving once.
      <br />Continuously holding this button will cause Arlecchino to consume Stamina and engage in up to <span class="text-yellow">5</span>s of high-speed movement.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      <br />
      <br /><b>Masque of the Red Death</b>
      <br />When Arlecchino has a <b class="text-genshin-bol">Bond of Life</b> equal to or greater than <span class="text-yellow">30%</span> of her Max HP, she will enter the "Masque of the Red Death" state, where her Normal, Charged, and Plunging Attacks will be converted to deal <b class="text-genshin-pyro">Pyro DMG</b>. This cannot be overridden.
      <br />When in the "Masque of the Red Death" state, Arlecchino's Normal Attacks will deal extra DMG to opponents on hit that scales off her ATK multiplied by a certain ratio of her current <b class="text-genshin-bol">Bond of Life</b> percentage. This will consume 7.5% of said current Bond of Life. Her <b class="text-genshin-bol">Bond of Life</b> can be consumed this way every 0.03s. When her <b class="text-genshin-bol">Bond of Life</b> is consumed in this manner, All Is Ash's CD will decrease by 0.8s.
      `,
    },
    skill: {
      title: `All Is Ash`,
      content: `Summons forth Balemoon Bloodfire, dealing <b class="text-genshin-pyro">Pyro DMG</b> to multiple nearby opponents and performing a dash-cleave against one of them, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />Opponents hit by the aforementioned attack will have a Blood-Debt Directive applied to them.
      <br />
      <br /><b>Blood-Debt Directive</b>
      <br />Lasts <span class="text-yellow">30</span>s. Every <span class="text-yellow">5</span>s, it will deal <span class="text-yellow">1</span> instance of <b class="text-genshin-pyro">Pyro DMG</b> to the opponent. Max <span class="text-yellow">2</span> instances. This DMG will be considered Elemental Skill DMG.
      <br />When Arlecchino uses a Charged Attack or her Elemental Burst, Balemoon Rising, she will absorb and clear nearby Blood-Debt Directives. Each Directive absorbed grants her a <b class="text-genshin-bol">Bond of Life</b> worth <span class="text-yellow">65%</span> of her Max HP.
      <br />The maximum value of the <b class="text-genshin-bol">Bond of Life</b> she can be granted through Blood-Debt Directives within <span class="text-yellow">35</span>s after using her Elemental Skill is <span class="text-yellow">145%</span> of her Max HP. Using the Elemental Skill again during this duration will restart the count on duration and the limit on the value of <b class="text-genshin-bol">Bond of Life</b> she may gain from Blood-Debt Directives.`,
    },
    burst: {
      title: `Balemoon Rising`,
      content: `Arlecchino's great wing of Balemoon Bloodfire beats as she absorbs and clears Blood-Debt Directives around her. She deals <b class="text-genshin-pyro">AoE Pyro DMG</b> before clearing the CD of All Is Ash and healing herself. The healing is based on her <b class="text-genshin-bol">Bond of Life</b> value and ATK.`,
    },
    a1: {
      title: `A1: Agony Alone May Be Repaid`,
      content: `Blood-Debt Directives have the following characteristics:
      <br />Arlecchino will be granted a <b class="text-genshin-bol">Bond of Life</b> worth <span class="text-yellow">130%</span> of her Max HP when an opponent to which she herself applied a Directive is defeated.
      <br /><span class="text-yellow">5</span>s after a Directive is applied, it will be upgraded to a Blood-Debt Due. When absorbed, it will instead grant Arlecchino a Bond of Life worth <span class="text-yellow">130%</span>.
      <br />A Bond of Life created in the aforementioned ways cannot exceed the original limit on the value of <b class="text-genshin-bol">Bond of Life</b> obtained through All Is Ash.`,
    },
    a4: {
      title: `A4: Strength Alone Can Defend`,
      content: `Arlecchino gains <span class="text-yellow">1%</span> All Elemental and Physical RES for every <span class="text-yellow">100</span> ATK she has in excess of <span class="text-yellow">1,000</span>. The maximum RES increase she can gain this way for each is <span class="text-yellow">20%</span>.
      <br /><br />Current RES Bonus: <span class="text-yellow">${toPercentage(a4Res)}</span>`,
    },
    c1: {
      title: `C1: "All Reprisals and Arrears, Mine to Bear..."`,
      content: `Masque of the Red Death is further enhanced, the value of the increase is <span class="text-yellow">100%</span>. Additionally, Arlecchino's interruption resistance is increased when she performs Normal or Charged Attacks while affected by the Masque of the Red Death.`,
    },
    c2: {
      title: `C2: "All Rewards and Retribution, Mine to Bestow..."`,
      content: `Blood-Debt Directives are now already Blood-Debt Due when first applied.
      <br />When Arlecchino absorbs such a Due, she unleashes Balemoon Bloodfire in front of her, dealing <span class="text-yellow">900%</span> of her ATK as <b class="text-genshin-pyro">AoE Pyro DMG</b> and increasing her All Elemental RES and Physical RES by <span class="text-yellow">20%</span> for <span class="text-yellow">15</span>s. This effect can trigger once every <span class="text-yellow">10</span>s.
      <br />You must first unlock the Passive Talent "Agony Alone May Be Repaid."`,
    },
    c3: {
      title: `C3: "You Shall Become a New Member of Our Family..."`,
      content: `Increases the Level of Normal Attack: Invitation to a Beheading by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: "You Shall Love and Protect Each Other Henceforth..."`,
      content: `When Arlecchino successfully absorbs a Blood-Debt Directive, Balemoon Rising's CD will decrease by <span class="text-yellow">2</span>s and <span class="text-yellow">15</span> Elemental Energy will be restored to her. This effect can occur once every <span class="text-yellow">10</span>s.`,
    },
    c5: {
      title: `C5: "For Alone, We Are as Good as Dead..."`,
      content: `Increases the Level of Balemoon Rising by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: "From This Day On, We Shall Delight in New Life Together."`,
      content: `The DMG of Balemoon Rising is increased by Arlecchino's ATK multiplied by <span class="text-yellow">700%</span> of Arlecchino's current <b class="text-genshin-bol">Bond of Life</b> percentage.
      For <span class="text-yellow">20</span>s after Arlecchino uses All Is Ash, both her Normal Attacks and Elemental Burst gain <span class="text-yellow">10%</span> increased CRIT Rate and <span class="text-yellow">70%</span> increased CRIT DMG. This effect can be triggered up to once every <span class="text-yellow">15</span>s.`,
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
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      const bolMultiplier = calcScaling(1.204, 10, 'physical', '1') + (c >= 1 ? 1 : 0)
      const bolPropagation = _.map(Array(7).fill(form.bol / 100), (item, index) => {
        const remaining = item - index * 0.075
        if (remaining >= 0.3) return bolMultiplier * remaining
        return 0
      })
      const c6BurstBonus = c >= 6 ? [{ scaling: 7 * (form.bol / 100), multiplier: Stats.ATK }] : []

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [
            { scaling: calcScaling(0.475, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[0], multiplier: Stats.ATK },
          ],
          element: bolPropagation[0] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [
            { scaling: calcScaling(0.5211, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[1], multiplier: Stats.ATK },
          ],
          element: bolPropagation[1] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [
            { scaling: calcScaling(0.6539, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[2], multiplier: Stats.ATK },
          ],
          element: bolPropagation[2] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [1]',
          value: [
            { scaling: calcScaling(0.3715, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[3], multiplier: Stats.ATK },
          ],
          element: bolPropagation[3] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [2]',
          value: [
            { scaling: calcScaling(0.3715, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[4], multiplier: Stats.ATK },
          ],
          element: bolPropagation[4] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [
            { scaling: calcScaling(0.6998, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[5], multiplier: Stats.ATK },
          ],
          element: bolPropagation[5] ? Element.PYRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '6-Hit',
          value: [
            { scaling: calcScaling(0.8538, normal, 'physical', '1'), multiplier: Stats.ATK },
            { scaling: bolPropagation[6], multiplier: Stats.ATK },
          ],
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

      base[Stats.PYRO_DMG] += 0.4

      if (c >= 2)
        base.CHARGE_SCALING.push({
          name: 'C2 Balemoon Bloodfire',
          value: [{ scaling: 9, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        })
      if (form.c2DueConsume) base.ALL_TYPE_RES += 0.2
      if (form.c6Crit) {
        base.BASIC_CR += 0.1
        base.BASIC_CD += 0.7
        base.BURST_CR += 0.1
        base.BURST_CD += 0.7
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      a4Res = _.min([0.01 * ((base.getAtk() - 1000) / 100), 0.2])
      return base
    },
  }
}

export default Arlecchino
